import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

export async function POST(request: NextRequest) {
  try {
    const { email, name, tx_ref } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }
    
    const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL}/poetry/download?email=${encodeURIComponent(email)}&token=${tx_ref || 'direct'}`
    
    await transporter.sendMail({
      from: `"Joel George Kaudzu" <${process.env.GMAIL_USER}>`,
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
            <h2>Thank you for your purchase, ${name || 'Reader'}!</h2>
            <p>Click the button below to download your poetry collection:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${downloadLink}" style="display: inline-block; padding: 12px 30px; background: #D4A017; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">📥 Download Now</a>
            </div>
            
            <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link:</p>
            <p style="font-size: 12px; color: #666; word-break: break-all;">${downloadLink}</p>
            
            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">Thank you for supporting my work!</p>
            <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} Joel George Kaudzu</p>
          </div>
        </body>
        </html>
      `
    })
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}