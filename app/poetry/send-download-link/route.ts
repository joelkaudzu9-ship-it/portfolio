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
        <h2>Thank you ${name || 'Reader'}!</h2>
        <p>Click the link below to download your poetry collection:</p>
        <a href="${downloadLink}" style="display: inline-block; padding: 10px 20px; background: #D4A017; color: white; text-decoration: none; border-radius: 5px;">Download Now</a>
        <p>Or copy this link: ${downloadLink}</p>
        <br>
        <p>Thank you for supporting my work!</p>
        <p>Joel Kaudzu</p>
      `
    })
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}