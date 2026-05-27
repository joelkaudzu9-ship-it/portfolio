import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email') || 'joelkaudzu9@gmail.com'
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    
    const result = await transporter.sendMail({
      from: `"Joel George Kaudzu" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Test Email',
      html: '<h2>Test Email</h2><p>If you receive this, your email system is working!</p>'
    })
    
    return NextResponse.json({ 
      success: true, 
      messageId: result.messageId,
      emailUser: process.env.EMAIL_USER 
    })
    
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}