import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    // Send email to you
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'joelkaudzu9@gmail.com',
      subject: `📬 Portfolio Contact: ${name}`,
      text: `
Name: ${name}
Email: ${email}
Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #f59e0b;">New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #6b7280;">Reply directly to: ${email}</p>
        </div>
      `,
      replyTo: email,
    })

    // Send auto-reply to the person who contacted you
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Thanks for reaching out! - Joel Kaudzu',
      text: `
Hi ${name},

Thanks for reaching out! I've received your message and will get back to you within 24-48 hours.

In the meantime, feel free to:
• Check out my projects: https://joelkaudzu-portfolio.vercel.app/projects
• Read my blog: https://joelkaudzu-portfolio.vercel.app/blog
• Connect on LinkedIn: https://www.linkedin.com/in/joel-kaudzu-0bba48392

Best regards,
Joel George Kaudzu
Healthcare Systems Builder
      `,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px;">
          <h2 style="color: #f59e0b;">Thanks for reaching out, ${name}!</h2>
          <p>I've received your message and will get back to you within 24-48 hours.</p>
          <p>In the meantime, feel free to:</p>
          <ul>
            <li><a href="https://joelkaudzu-portfolio.vercel.app/projects">Check out my projects</a></li>
            <li><a href="https://joelkaudzu-portfolio.vercel.app/blog">Read my blog</a></li>
            <li><a href="https://www.linkedin.com/in/joel-kaudzu-0bba48392">Connect on LinkedIn</a></li>
          </ul>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #6b7280;">Best regards,<br><strong>Joel George Kaudzu</strong><br>Healthcare Systems Builder</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}