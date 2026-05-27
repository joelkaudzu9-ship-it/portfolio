import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'

// Configure email transporter (same as your existing setup)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Helper function to send email with download link
async function sendDownloadEmail(email: string, name: string, tx_ref: string) {
  try {
    const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL}/poetry/download?email=${encodeURIComponent(email)}&token=${tx_ref}`
    
    await transporter.sendMail({
      from: `"Joel George Kaudzu" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '📖 Your Poetry Collection - Threads of Becoming',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Poetry Download</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #D4A017, #B8860B); border-radius: 10px; color: white;">
            <h1 style="margin: 0;">Threads of Becoming</h1>
            <p style="margin: 5px 0 0; opacity: 0.9;">Poetry Collection by Joel Kaudzu</p>
          </div>
          
          <div style="padding: 20px;">
            <h2>Thank you for your purchase, ${name}!</h2>
            <p>Your payment was successful. You can now download your copy of <strong>"Threads of Becoming"</strong>.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${downloadLink}" style="display: inline-block; padding: 12px 30px; background: #D4A017; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">📥 Download Your Poetry Collection</a>
            </div>
            
            <p>This collection includes <strong>13 poems</strong> across 4 sections:</p>
            <ul>
              <li><strong>Broken and Becoming</strong> - Personal transformation</li>
              <li><strong>Light Through the Storm</strong> - Hope and resilience</li>
              <li><strong>Infinite Thoughts</strong> - Deep reflections</li>
              <li><strong>Society and Reality Check</strong> - Critical observations</li>
            </ul>
            
            <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #666; word-break: break-all;">${downloadLink}</p>
            
            <hr style="margin: 20px 0; border-color: #eee;">
            
            <p style="font-size: 12px; color: #666;">Thank you for supporting my work!</p>
            <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} Joel George Kaudzu</p>
          </div>
        </body>
        </html>
      `
    })
    
    console.log('📧 Email sent to:', email)
  } catch (error) {
    console.error('❌ Email error:', error)
  }
}

// Handle redirect from PayChangu (GET request)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tx_ref = searchParams.get('tx_ref')
    const status = searchParams.get('status')
    
    console.log('📡 Payment redirect received:', { tx_ref, status })
    
    const secretKey = process.env.PAYCHANGU_SECRET_KEY
    
    if (!secretKey) {
      console.error('❌ PayChangu secret key not configured')
      return NextResponse.redirect(new URL('/poetry/failed?error=config', request.url))
    }
    
    if (tx_ref) {
      // Verify the payment status with PayChangu
      const verifyUrl = `https://api.paychangu.com/verify-payment/${tx_ref}`
      
      const verifyResponse = await fetch(verifyUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secretKey}`
        }
      })
      
      const verifyData = await verifyResponse.json()
      console.log('📡 Verification response:', JSON.stringify(verifyData, null, 2))
      
      if (verifyData.status === 'success' && verifyData.data?.status === 'success') {
        // Payment successful - get customer details
        const email = verifyData.data?.customer?.email || ''
        const firstName = verifyData.data?.customer?.first_name || ''
        const lastName = verifyData.data?.customer?.last_name || ''
        const name = `${firstName} ${lastName}`.trim() || 'Customer'
        const amount = verifyData.data?.amount || 200
        
        // Save purchase to database
        const { data: purchase, error: dbError } = await supabaseAdmin
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
          console.error('❌ Database error:', dbError)
        } else {
          console.log('✅ Purchase saved:', purchase)
          
          // Send email with download link using Nodemailer
          await sendDownloadEmail(email, name, tx_ref)
        }
        
        // Redirect to success page
        return NextResponse.redirect(
          new URL(`/poetry/success?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&tx_ref=${tx_ref}`, request.url)
        )
      }
    }
    
    // If payment failed or status unclear
    return NextResponse.redirect(new URL('/poetry/failed', request.url))
    
  } catch (error) {
    console.error('❌ Verification error:', error)
    return NextResponse.redirect(new URL('/poetry/failed', request.url))
  }
}

// Handle webhook from PayChangu (POST request)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📡 Webhook received:', body)
    
    const { tx_ref, status, payment_status } = body
    
    if ((status === 'success' || payment_status === 'success') && tx_ref) {
      console.log(`✅ Payment successful for tx_ref: ${tx_ref}`)
      
      // Get or update purchase in database
      const { data: existingPurchase } = await supabaseAdmin
        .from('poetry_purchases')
        .select('*')
        .eq('tx_ref', tx_ref)
        .single()
      
      if (!existingPurchase) {
        // Try to get details from the payment
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
          
          // Send email
          await sendDownloadEmail(email, name, tx_ref)
        }
      } else if (existingPurchase.status !== 'completed') {
        // Update existing purchase
        await supabaseAdmin
          .from('poetry_purchases')
          .update({ status: 'completed', completed_at: new Date().toISOString() })
          .eq('tx_ref', tx_ref)
        
        // Send email
        await sendDownloadEmail(existingPurchase.email, existingPurchase.name, tx_ref)
      }
    }
    
    return NextResponse.json({ status: 'received' })
    
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}