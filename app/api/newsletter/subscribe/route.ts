import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

// Send welcome email to subscriber
async function sendWelcomeEmail(email: string) {
  const transporter = createTransporter()
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to my newsletter!</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none; }
        .btn { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af; }
        h1 { margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome! 👋</h1>
        </div>
        <div class="content">
          <p>Thanks for subscribing to my newsletter!</p>
          <p>You'll receive updates about:</p>
          <ul>
            <li>🔬 Healthcare tech innovations in Africa</li>
            <li>💡 Frugal engineering insights</li>
            <li>📝 New blog posts and projects</li>
            <li>🌍 Opportunities in digital health</li>
          </ul>
          <p>I send emails occasionally (no spam, I promise!), and you can unsubscribe anytime.</p>
          <a href="https://joelkaudzu-portfolio.vercel.app/blog" class="btn">Explore my blog →</a>
          <p style="margin-top: 30px;">Best regards,<br><strong>Joel George Kaudzu</strong><br>Healthcare Systems Builder</p>
        </div>
        <div class="footer">
          <p>You received this email because you subscribed to my newsletter.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `"Joel Kaudzu" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Welcome to my newsletter! 🚀',
    text: `Thanks for subscribing! You'll receive updates about healthcare tech, frugal innovation, and new blog posts. Best regards, Joel George Kaudzu`,
    html: htmlContent,
  })
}

// Send notification to admin
async function sendAdminNotification(email: string) {
  const transporter = createTransporter()
  
  await transporter.sendMail({
    from: `"Newsletter" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: '📧 New Newsletter Subscriber!',
    text: `New subscriber!\n\nEmail: ${email}\nTime: ${new Date().toLocaleString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #f59e0b;">📧 New Newsletter Subscriber!</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p><a href="https://joelkaudzu-portfolio.vercel.app/admin/newsletter">View all subscribers →</a></p>
      </div>
    `,
  })
}

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

    // Send emails (don't await - let them run in background)
    Promise.all([
      sendWelcomeEmail(email).catch(console.error),
      sendAdminNotification(email).catch(console.error),
    ])

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed! Check your email for a welcome message.' 
    })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}