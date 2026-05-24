import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    // Check if already subscribed
    const { data: existing } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('email')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 })
    }

    // Save to database
    const { error: insertError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        subscribed_at: new Date().toISOString(),
        status: 'active',
      })

    if (insertError) {
      console.error('Newsletter insert error:', insertError)
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    // Send welcome email to subscriber
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Welcome to my newsletter! 🚀',
      text: `
Welcome to my newsletter!

Thanks for subscribing! You'll receive updates about:
• Healthcare tech innovations in Africa
• Frugal engineering insights
• New blog posts and projects
• Opportunities in digital health

I send emails occasionally (no spam, I promise!), and you can unsubscribe anytime.

Best regards,
Joel George Kaudzu
Healthcare Systems Builder

P.S. Check out my latest projects: https://joelkaudzu.vercel.app/projects
      `,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px;">
          <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">Welcome! 👋</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Thanks for subscribing to my newsletter!</p>
            <p>You'll receive updates about:</p>
            <ul>
              <li>🔬 Healthcare tech innovations in Africa</li>
              <li>💡 Frugal engineering insights</li>
              <li>📝 New blog posts and projects</li>
              <li>🌍 Opportunities in digital health</li>
            </ul>
            <p>I send emails occasionally (no spam, I promise!), and you can unsubscribe anytime.</p>
            <a href="https://joelkaudzu.vercel.app/blog" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">Explore my blog →</a>
            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #6b7280;">Best regards,<br><strong>Joel George Kaudzu</strong><br>Healthcare Systems Builder</p>
          </div>
        </div>
      `,
    })

    // Send notification to you (admin)
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'joelkaudzu9@gmail.com',
      subject: '📧 New Newsletter Subscriber!',
      text: `
New subscriber!

Email: ${email}
Time: ${new Date().toLocaleString()}

View all subscribers in your admin dashboard.
      `,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #f59e0b;">📧 New Newsletter Subscriber!</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <a href="https://joelkaudzu.vercel.app/admin/newsletter" style="background: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View all subscribers →</a>
        </div>
      `,
    })

    return NextResponse.json({ success: true, message: 'Subscribed successfully! Check your email for a welcome message.' })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}