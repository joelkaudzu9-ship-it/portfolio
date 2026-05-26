import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

export async function GET(request: Request) {
  // Secret key to prevent unauthorized access
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  // Skip auth check if no secret is set (for testing)
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get posts from last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: posts, error } = await supabaseAdmin
      .from('blog_posts')
      .select('title, slug, excerpt, content, created_at')
      .eq('published', true)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json({ message: 'No new posts in the last 7 days' })
    }

    // Get active subscribers
    const { data: subscribers, error: subError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('email')
      .eq('status', 'active')

    if (subError) {
      console.error('Error fetching subscribers:', subError)
      return NextResponse.json({ error: subError.message }, { status: 500 })
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No active subscribers' })
    }

    // Build email HTML
    const postsHtml = posts.map(post => {
      const cleanExcerpt = post.excerpt || (post.content ? post.content.substring(0, 150).replace(/[#*`]/g, '') : '')
      return `
        <div style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
          <h3 style="margin: 0 0 10px;">
            <a href="https://joelkaudzu-portfolio.vercel.app/blog/${post.slug}" style="color: #f59e0b; text-decoration: none;">
              ${escapeHtml(post.title)}
            </a>
          </h3>
          <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
            ${new Date(post.created_at).toLocaleDateString()}
          </p>
          <p style="margin: 0; color: #374151;">${escapeHtml(cleanExcerpt)}...</p>
          <a href="https://joelkaudzu-portfolio.vercel.app/blog/${post.slug}" style="color: #f59e0b; font-size: 14px;">Read more →</a>
        </div>
      `
    }).join('')

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weekly Digest</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; }
        </style>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">Weekly Digest</h1>
          <p style="margin: 10px 0 0;">from Joel Kaudzu</p>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Here's what I wrote this week:</p>
          ${postsHtml}
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #9ca3af;">
            <a href="https://joelkaudzu-portfolio.vercel.app/blog" style="color: #f59e0b;">View all posts</a> |
            <a href="https://joelkaudzu-portfolio.vercel.app/unsubscribe?email={{email}}" style="color: #9ca3af;">Unsubscribe</a>
          </p>
        </div>
      </body>
      </html>
    `

    const transporter = createTransporter()
    let sentCount = 0

    // Send to all subscribers
    for (const subscriber of subscribers) {
      try {
        const personalizedHtml = html.replace('{{email}}', encodeURIComponent(subscriber.email))
        await transporter.sendMail({
          from: `"Joel Kaudzu" <${process.env.GMAIL_USER}>`,
          to: subscriber.email,
          subject: `📬 Weekly Digest: ${posts.length} new post${posts.length > 1 ? 's' : ''}`,
          html: personalizedHtml,
        })
        sentCount++
      } catch (err) {
        console.error(`Failed to send to ${subscriber.email}:`, err)
      }
    }

    return NextResponse.json({ 
      success: true, 
      sentTo: sentCount, 
      totalSubscribers: subscribers.length,
      postsCount: posts.length 
    })
  } catch (error) {
    console.error('Digest error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}