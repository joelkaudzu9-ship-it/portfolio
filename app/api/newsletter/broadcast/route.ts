import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'
import { cookies } from 'next/headers'

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

export async function POST(request: Request) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { subject, content, sendTo = 'active' } = await request.json()

    if (!subject || !content) {
      return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 })
    }

    // Get subscribers based on filter
    let query = supabaseAdmin.from('newsletter_subscribers').select('email')
    
    if (sendTo === 'active') {
      query = query.eq('status', 'active')
    }

    const { data: subscribers, error } = await query

    if (error) {
      console.error('Error fetching subscribers:', error)
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'No subscribers found' }, { status: 400 })
    }

    const transporter = createTransporter()
    
    const htmlTemplate = (emailContent: string, unsubscribeLink: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af; }
          h1 { margin: 0; font-size: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Joel George Kaudzu</h1>
          </div>
          <div class="content">
            ${emailContent}
            <hr style="margin: 30px 0 20px;">
            <p style="font-size: 12px; color: #6b7280;">
              You received this email because you subscribed to my newsletter.
              <br>
              <a href="${unsubscribeLink}" style="color: #f59e0b;">Unsubscribe</a>
            </p>
          </div>
          <div class="footer">
            <p>Joel George Kaudzu - Healthcare Systems Builder</p>
            <p><a href="https://joelkaudzu-portfolio.vercel.app" style="color: #9ca3af;">Visit Website</a></p>
          </div>
        </div>
      </body>
      </html>
    `

    const batchSize = 50
    const results = { sent: 0, failed: 0 }
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      
      await Promise.allSettled(
        batch.map(async (subscriber) => {
          try {
            const unsubscribeLink = `https://joelkaudzu-portfolio.vercel.app/unsubscribe?email=${encodeURIComponent(subscriber.email)}`
            const htmlWithLink = htmlTemplate(content, unsubscribeLink)
            
            await transporter.sendMail({
              from: `"Joel Kaudzu" <${process.env.GMAIL_USER}>`,
              to: subscriber.email,
              subject: subject,
              html: htmlWithLink,
              text: content.replace(/<[^>]*>/g, ''),
            })
            results.sent++
          } catch (err) {
            console.error(`Failed to send to ${subscriber.email}:`, err)
            results.failed++
          }
        })
      )
      
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    await supabaseAdmin.from('newsletter_broadcasts').insert({
      subject,
      content,
      sent_count: results.sent,
      failed_count: results.failed,
      sent_at: new Date().toISOString(),
    })

    return NextResponse.json({ 
      success: true, 
      sent: results.sent, 
      failed: results.failed,
      total: subscribers.length 
    })
  } catch (error) {
    console.error('Broadcast error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}