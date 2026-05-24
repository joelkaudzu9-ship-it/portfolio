import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

export async function POST(request: Request) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { subject, content } = await request.json()
  
  if (!subject || !content) {
    return NextResponse.json({ error: 'Subject and content required' }, { status: 400 })
  }
  
  // Get all active subscribers
  const { data: subscribers, error } = await supabaseAdmin
    .from('newsletter')
    .select('email, name')
    .eq('is_active', true)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // Send emails in batches (Resend limit)
  const results = []
  for (const subscriber of subscribers) {
    try {
      await resend.emails.send({
        from: 'Joel Kaudzu <newsletter@joelkaudzu-portfolio.vercel.app>',
        to: [subscriber.email],
        subject: subject,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #D4A017;">${subject}</h1>
            <div>${content.replace(/\n/g, '<br/>')}</div>
            <hr style="border-color: #333; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              You're receiving this because you subscribed to my newsletter.<br>
              <a href="https://joelkaudzu-portfolio.vercel.app/api/newsletter/unsubscribe?email=${subscriber.email}" style="color: #D4A017;">Unsubscribe</a>
            </p>
          </div>
        `,
      })
      results.push({ email: subscriber.email, status: 'sent' })
    } catch (err) {
      results.push({ email: subscriber.email, status: 'failed', error: String(err) })
    }
  }
  
  return NextResponse.json({ 
    success: true, 
    total: subscribers.length,
    results 
  })
}