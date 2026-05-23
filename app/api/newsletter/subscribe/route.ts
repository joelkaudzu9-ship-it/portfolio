import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }
    
    // Check if already subscribed
    const { data: existing } = await supabaseAdmin
      .from('newsletter')
      .select('email')
      .eq('email', email)
      .single()
    
    if (existing) {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 400 })
    }
    
    // Save to database
    const { error: dbError } = await supabaseAdmin
      .from('newsletter')
      .insert({ 
        email, 
        name: name || null, 
        subscribed_at: new Date(),
        source: 'website'
      })
    
    if (dbError) throw dbError
    
    // Send welcome email
    try {
      await resend.emails.send({
        from: 'Joel Kaudzu <newsletter@joelkaudzu.netlify.app>',
        to: [email],
        subject: 'Welcome to my newsletter! 🚀',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #D4A017;">Welcome to my newsletter!</h1>
            <p>Thank you for subscribing. I share insights on:</p>
            <ul>
              <li>Healthcare innovation in Africa</li>
              <li>Building MoyoWanga and other projects</li>
              <li>Lessons from my journey as a dental student & developer</li>
              <li>Tech and systems thinking</li>
            </ul>
            <p>You'll hear from me about once a month.</p>
            <hr style="border-color: #333;">
            <p style="color: #666; font-size: 12px;">
              Joel George Kaudzu<br>
              <a href="https://joelkaudzu.netlify.app" style="color: #D4A017;">joelkaudzu.netlify.app</a>
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Welcome email failed:', emailError)
      // Don't fail the subscription if email fails
    }
    
    // Notify admin
    try {
      await resend.emails.send({
        from: 'Newsletter <onboarding@resend.dev>',
        to: ['joelkaudzu9@gmail.com'],
        subject: `New Newsletter Subscriber: ${email}`,
        html: `<p><strong>New subscriber:</strong> ${email}${name ? ` (${name})` : ''}</p>`,
      })
    } catch (emailError) {
      console.error('Admin notification failed:', emailError)
    }
    
    return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}