import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Helper function to send email
async function sendDownloadEmail(email: string, name: string, tx_ref: string) {
  try {
    const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL}/poetry/download?email=${encodeURIComponent(email)}&token=${tx_ref}`
    
    await transporter.sendMail({
      from: `"Joel George Kaudzu" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '📖 Your Poetry Collection - Threads of Becoming',
      html: `
        <h2>Thank you for your purchase, ${name}!</h2>
        <p>Click the link below to download your poetry collection:</p>
        <a href="${downloadLink}">Download Threads of Becoming</a>
        <p>Or copy this link: ${downloadLink}</p>
        <br>
        <p>Thank you for supporting my work!</p>
        <p>Joel Kaudzu</p>
      `
    })
    console.log('📧 Email sent to:', email)
    return true
  } catch (error) {
    console.error('❌ Email error:', error)
    return false
  }
}

// Handle GET request from PayChangu redirect
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tx_ref = searchParams.get('tx_ref')
    const status = searchParams.get('status')
    
    console.log('📡 ========== PAYMENT REDIRECT RECEIVED ==========')
    console.log('tx_ref:', tx_ref)
    console.log('status:', status)
    
    if (!tx_ref) {
      console.error('❌ No tx_ref provided')
      return NextResponse.redirect(new URL('/poetry/failed?error=no_reference', request.url))
    }
    
    const secretKey = process.env.PAYCHANGU_SECRET_KEY
    
    if (!secretKey) {
      console.error('❌ PayChangu secret key not configured')
      return NextResponse.redirect(new URL('/poetry/failed?error=config', request.url))
    }
    
    // Verify payment status with PayChangu
    const verifyUrl = `https://api.paychangu.com/verify-payment/${tx_ref}`
    console.log('🔍 Verifying payment at:', verifyUrl)
    
    const verifyResponse = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`
      }
    })
    
    const verifyData = await verifyResponse.json()
    console.log('📡 PayChangu verification response:', JSON.stringify(verifyData, null, 2))
    
    // Check if payment was successful
    const isSuccessful = verifyData.status === 'success' && 
                         verifyData.data?.status === 'success'
    
    if (isSuccessful) {
      // Get customer details from response
      const email = verifyData.data?.customer?.email || ''
      const firstName = verifyData.data?.customer?.first_name || ''
      const lastName = verifyData.data?.customer?.last_name || ''
      const name = `${firstName} ${lastName}`.trim() || 'Customer'
      const amount = verifyData.data?.amount || 200
      
      console.log('✅ Payment successful for:', { email, name, amount })
      
      // Check if purchase already exists
      const { data: existingPurchase } = await supabaseAdmin
        .from('poetry_purchases')
        .select('*')
        .eq('tx_ref', tx_ref)
        .single()
      
      if (!existingPurchase) {
        // Save to database
        const { data: newPurchase, error: dbError } = await supabaseAdmin
          .from('poetry_purchases')
          .insert({
            tx_ref: tx_ref,
            name: name,
            email: email,
            amount: amount,
            status: 'completed',
            payment_method: 'mobile_money',
            completed_at: new Date().toISOString()
          })
          .select()
          .single()
        
        if (dbError) {
          console.error('❌ Database insert error:', dbError)
        } else {
          console.log('✅ Purchase saved to database:', newPurchase)
          
          // Send email
          await sendDownloadEmail(email, name, tx_ref)
        }
      } else {
        console.log('📦 Purchase already exists:', existingPurchase)
        
        // Update status if pending
        if (existingPurchase.status !== 'completed') {
          await supabaseAdmin
            .from('poetry_purchases')
            .update({ status: 'completed', completed_at: new Date().toISOString() })
            .eq('tx_ref', tx_ref)
          console.log('✅ Purchase updated to completed')
        }
        
        // Send email if not sent
        await sendDownloadEmail(email, name, tx_ref)
      }
      
      // Redirect to success page
      return NextResponse.redirect(
        new URL(`/poetry/success?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&tx_ref=${tx_ref}`, request.url)
      )
    } else {
      console.error('❌ Payment verification failed:', verifyData)
      return NextResponse.redirect(new URL('/poetry/failed?error=payment_failed', request.url))
    }
    
  } catch (error) {
    console.error('❌ Verification error:', error)
    return NextResponse.redirect(new URL('/poetry/failed?error=exception', request.url))
  }
}

// Handle POST for webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📡 ========== WEBHOOK RECEIVED ==========')
    console.log('Webhook body:', JSON.stringify(body, null, 2))
    
    const { tx_ref, status } = body
    
    if ((status === 'success') && tx_ref) {
      console.log(`✅ Webhook: Payment successful for tx_ref: ${tx_ref}`)
      
      // Verify with PayChangu to get details
      const secretKey = process.env.PAYCHANGU_SECRET_KEY
      const verifyUrl = `https://api.paychangu.com/verify-payment/${tx_ref}`
      
      const verifyResponse = await fetch(verifyUrl, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${secretKey}` }
      })
      const verifyData = await verifyResponse.json()
      
      if (verifyData.status === 'success') {
        const email = verifyData.data?.customer?.email || ''
        const firstName = verifyData.data?.customer?.first_name || ''
        const lastName = verifyData.data?.customer?.last_name || ''
        const name = `${firstName} ${lastName}`.trim() || 'Customer'
        const amount = verifyData.data?.amount || 200
        
        // Save to database
        const { data: existingPurchase } = await supabaseAdmin
          .from('poetry_purchases')
          .select('*')
          .eq('tx_ref', tx_ref)
          .single()
        
        if (!existingPurchase) {
          await supabaseAdmin
            .from('poetry_purchases')
            .insert({
              tx_ref: tx_ref,
              name: name,
              email: email,
              amount: amount,
              status: 'completed',
              payment_method: 'mobile_money',
              completed_at: new Date().toISOString()
            })
          console.log('✅ Webhook: Purchase saved')
          
          // Send email
          await sendDownloadEmail(email, name, tx_ref)
        }
      }
    }
    
    return NextResponse.json({ status: 'received' })
    
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}