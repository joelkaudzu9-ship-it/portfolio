import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

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
    
    // Read the PDF file
    const pdfPath = path.join(process.cwd(), 'public', 'threads-of-becoming.pdf')
    
    if (!fs.existsSync(pdfPath)) {
      console.error('PDF not found at:', pdfPath)
      return NextResponse.json({ error: 'PDF file not found' }, { status: 404 })
    }
    
    const pdfBuffer = fs.readFileSync(pdfPath)
    
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
            <p>Your poetry collection is attached to this email.</p>
            
            <div style="text-align: center; margin: 30px 0; padding: 15px; background: #f5f5f5; border-radius: 10px;">
              <p style="margin: 0; color: #333;">📎 The PDF file is attached to this email</p>
              <p style="font-size: 12px; color: #666; margin-top: 8px;">Check your email attachments to download "Threads of Becoming"</p>
            </div>
            
            <p>This collection includes <strong>13 poems</strong> across 4 sections:</p>
            <ul>
              <li><strong>Broken and Becoming</strong> - Personal transformation</li>
              <li><strong>Light Through the Storm</strong> - Hope and resilience</li>
              <li><strong>Infinite Thoughts</strong> - Deep reflections</li>
              <li><strong>Society and Reality Check</strong> - Critical observations</li>
            </ul>
            
            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">Thank you for supporting my work!</p>
            <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} Joel George Kaudzu</p>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: 'Threads_of_Becoming_Joel_Kaudzu.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    })
    
    console.log('✅ PDF email sent to:', email)
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}