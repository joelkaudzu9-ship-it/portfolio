import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'

// Create transporter with proper config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // Add these for better reliability
  tls: {
    rejectUnauthorized: false
  }
})

// Verify transporter connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter error:', error)
  } else {
    console.log('✅ Email transporter ready')
  }
})

async function sendEmail(email: string, name: string, tx_ref: string) {
  try {
    const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL}/poetry/download?email=${encodeURIComponent(email)}&token=${tx_ref}`
    
    const mailOptions = {
      from: `"Joel George Kaudzu" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '📖 Your Poetry Collection - Threads of Becoming',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #D4A017, #B8860B); border-radius: 10px; color: white;">
            <h1 style="margin: 0;">Threads of Becoming</h1>
            <p style="margin: 5px 0 0;">Poetry Collection by Joel Kaudzu</p>
          </div>
          
          <div style="padding: 20px;">
            <h2>Thank you for your purchase, ${name}!</h2>
            <p>Your payment was successful. Click the button below to download your poetry collection:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${downloadLink}" style="display: inline-block; padding: 12px 30px; background: #D4A017; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">📥 Download Now</a>
            </div>
            
            <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #666; word-break: break-all;">${downloadLink}</p>
            
            <hr style="margin: 20px 0;">
            
            <p style="font-size: 12px; color: #666;">Thank you for supporting my work!</p>
            <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} Joel George Kaudzu</p>
          </div>
        </body>
        </html>
      `
    }
    
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent to:', email, 'Message ID:', info.messageId)
    return true
    
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tx_ref, email, name } = await request.json()
    
    console.log('💾 Completing purchase:', { tx_ref, email, name })
    
    if (!tx_ref) {
      return NextResponse.json({ error: 'Missing tx_ref' }, { status: 400 })
    }
    
    // Save to database
    const { error: dbError } = await supabaseAdmin
      .from('poetry_purchases')
      .upsert({
        tx_ref: tx_ref,
        email: email || '',
        name: name || 'Customer',
        amount: 200,
        status: 'completed',
        payment_method: 'paychangu',
        completed_at: new Date().toISOString()
      }, { onConflict: 'tx_ref' })
    
    if (dbError) {
      console.error('❌ DB error:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }
    
    console.log('✅ Purchase saved to database')
    
    // Send email if email provided
    let emailSent = false
    if (email) {
      emailSent = await sendEmail(email, name || 'Customer', tx_ref)
    }
    
    return NextResponse.json({ 
      success: true, 
      emailSent: emailSent,
      message: emailSent ? 'Purchase completed and email sent' : 'Purchase completed but email failed'
    })
    
  } catch (error) {
    console.error('❌ Complete purchase error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}