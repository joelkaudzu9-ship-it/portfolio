import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// Function to send welcome email
async function sendWelcomeEmail(email: string, name?: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  
  if (!RESEND_API_KEY) {
    console.log('Resend not configured - skipping welcome email')
    return
  }
  
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(RESEND_API_KEY)
    
    const { data, error } = await resend.emails.send({
      from: `Joel Kaudzu <onboarding@resend.dev>`,
      to: [email],
      subject: 'Welcome to my newsletter! 🚀',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to my newsletter</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none; }
            .btn { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Welcome! 👋</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Thanks for subscribing to my newsletter! I'm excited to have you on board.</p>
              <p>You'll receive updates about:</p>
              <ul>
                <li> Healthcare tech innovations in Africa</li>
                <li> Frugal engineering insights</li>
                <li> New blog posts and projects</li>
                <li> Opportunities in digital health</li>
              </ul>
              <p>I send emails occasionally (no spam, I promise!), and you can unsubscribe anytime.</p>
              <a href="https://joelkaudzu.netlify.app/blog" class="btn">Explore my blog →</a>
              <p style="margin-top: 30px;">Best regards,<br><strong>Joel George Kaudzu</strong><br>Healthcare Systems Builder</p>
            </div>
            <div class="footer">
              <p>You received this email because you subscribed to my newsletter.<br>
              <a href="https://joelkaudzu.netlify.app/contact" style="color: #f59e0b;">Contact</a> | 
              <a href="%%unsubscribe_link%%" style="color: #9ca3af;">Unsubscribe</a></p>
            </div>
          </div>
        </html>
      `,
    })
    
    if (error) {
      console.error('Welcome email error:', error)
    } else {
      console.log('Welcome email sent to:', email)
    }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}

// Function to send admin notification
async function notifyAdmin(newEmail: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'joelkaudzu9@gmail.com'
  
  if (!RESEND_API_KEY) {
    console.log('Resend not configured - skipping admin notification')
    return
  }
  
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(RESEND_API_KEY)
    
    const { error } = await resend.emails.send({
      from: `Newsletter <onboarding@resend.dev>`,
      to: [ADMIN_EMAIL],
      subject: `📧 New Newsletter Subscriber: ${newEmail}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Subscriber</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none; }
            .email { background: white; padding: 10px; border-radius: 8px; font-family: monospace; font-size: 16px; }
            .btn { display: inline-block; background: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">🎉 New Newsletter Subscriber!</h2>
            </div>
            <div class="content">
              <p><strong>Someone just subscribed to your newsletter:</strong></p>
              <div class="email">${newEmail}</div>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <a href="https://joelkaudzu.netlify.app/admin/newsletter" class="btn">View all subscribers →</a>
            </div>
          </div>
        </body>
        </html>
      `,
    })
    
    if (error) {
      console.error('Admin notification error:', error)
    } else {
      console.log('Admin notification sent for:', newEmail)
    }
  } catch (error) {
    console.error('Failed to send admin notification:', error)
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }
    
    console.log('Attempting to subscribe:', email)
    
    // Check if email already exists
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('email')
      .eq('email', email)
      .maybeSingle()
    
    if (existing) {
      console.log('Email already exists:', email)
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 })
    }
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Check error:', checkError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    
    // Save to database
    const { data, error: insertError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert({ 
        email: email.toLowerCase().trim(),
        subscribed_at: new Date().toISOString(),
        status: 'active'
      })
      .select()
    
    if (insertError) {
      console.error('Newsletter insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }
    
    console.log('Successfully subscribed:', email)
    
    // Send welcome email (don't await - let it run in background)
    sendWelcomeEmail(email).catch(console.error)
    
    // Send admin notification (don't await - let it run in background)
    notifyAdmin(email).catch(console.error)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed! Check your email for a welcome message.' 
    })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}