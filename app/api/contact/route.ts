import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    
    // Save to Supabase
    const { error: dbError } = await supabaseAdmin
      .from('messages')
      .insert({ name, email, message, read: false, created_at: new Date() })
    
    if (dbError) throw dbError
    
    // Send email notification using Resend
    try {
      await resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>',
        to: ['joelkaudzu9@gmail.com'],
        subject: `New Contact Message from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br/>')}</p>
          <hr/>
          <p><small>View in admin panel: https://joelkaudzu.netlify.app/admin/messages</small></p>
        `,
      })
    } catch (emailError) {
      console.error('Email send failed:', emailError)
      // Don't fail the request if email fails - just log it
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}