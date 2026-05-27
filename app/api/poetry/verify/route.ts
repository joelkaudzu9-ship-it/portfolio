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
  } catch (error) {
    console.error('❌ Email error:', error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tx_ref = searchParams.get('tx_ref')
    const status = searchParams.get('status')
    
    console.log('📡 ========== PAYMENT VERIFICATION ==========')
    console.log('tx_ref:', tx_ref)
    console.log('status:', status)
    
    if (!tx_ref) {
      console.error('❌ No tx_ref provided')
      return NextResponse.redirect(new URL('/poetry/failed?error=no_reference', request.url))
    }
    
    const secretKey = process.env.PAYCHANGU_SECRET_KEY
    
    if (!secretKey) {
      console.error('❌ No PayChangu secret key')
      return NextResponse.redirect(new URL('/poetry/failed?error=config', request.url))
    }
    
    // Verify payment with PayChangu
    const verifyUrl = `https://api.paychangu.com/verify-payment/${tx_ref}`
    console.log('🔍 Verifying at:', verifyUrl)
    
    const verifyResponse = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    const verifyData = await verifyResponse.json()
    console.log('📡 PayChangu response:', JSON.stringify(verifyData, null, 2))
    
    // Check if payment was successful
    const paymentSuccess = verifyData.status === 'success' && 
                           verifyData.data?.status === 'success'
    
    if (paymentSuccess) {
      const email = verifyData.data?.customer?.email || ''
      const firstName = verifyData.data?.customer?.first_name || ''
      const lastName = verifyData.data?.customer?.last_name || ''
      const name = `${firstName} ${lastName}`.trim() || 'Customer'
      const amount = verifyData.data?.amount || 200
      
      console.log('✅ Payment confirmed for:', { email, name })
      
      // Check if already saved
      const { data: existing } = await supabaseAdmin
        .from('poetry_purchases')
        .select('*')
        .eq('tx_ref', tx_ref)
        .single()
      
      if (!existing) {
        // Save to database
        const { error: dbError } = await supabaseAdmin
          .from('poetry_purchases')
          .insert({
            tx_ref: tx_ref,
            name: name,
            email: email,
            amount: amount,
            status: 'completed',
            payment_method: 'paychangu',
            completed_at: new Date().toISOString()
          })
        
        if (dbError) {
          console.error('❌ DB insert error:', dbError)
        } else {
          console.log('✅ Purchase saved to database')
          await sendDownloadEmail(email, name, tx_ref)
        }
      } else {
        console.log('📦 Purchase already exists')
        if (existing.status !== 'completed') {
          await supabaseAdmin
            .from('poetry_purchases')
            .update({ status: 'completed', completed_at: new Date().toISOString() })
            .eq('tx_ref', tx_ref)
        }
        await sendDownloadEmail(email, name, tx_ref)
      }
      
      // Redirect to success page with params
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📡 Webhook received:', body)
    
    const { tx_ref, status } = body
    
    if (status === 'success' && tx_ref) {
      const secretKey = process.env.PAYCHANGU_SECRET_KEY
      const verifyUrl = `https://api.paychangu.com/verify-payment/${tx_ref}`
      
      const verifyResponse = await fetch(verifyUrl, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${secretKey}` }
      })
      const verifyData = await verifyResponse.json()
      
      if (verifyData.status === 'success') {
        const email = verifyData.data?.customer?.email || ''
        const name = `${verifyData.data?.customer?.first_name || ''} ${verifyData.data?.customer?.last_name || ''}`.trim() || 'Customer'
        
        const { data: existing } = await supabaseAdmin
          .from('poetry_purchases')
          .select('*')
          .eq('tx_ref', tx_ref)
          .single()
        
        if (!existing) {
          await supabaseAdmin.from('poetry_purchases').insert({
            tx_ref: tx_ref,
            name: name,
            email: email,
            amount: verifyData.data?.amount || 200,
            status: 'completed',
            payment_method: 'paychangu',
            completed_at: new Date().toISOString()
          })
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