import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, role, content } = await request.json()
    
    if (!name || !content) {
      return NextResponse.json({ error: 'Name and testimonial are required' }, { status: 400 })
    }
    
    // Insert testimonial with is_active = false (requires admin approval)
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert({
        name: name.trim(),
        role: role?.trim() || null,
        content: content.trim(),
        is_active: false,
        created_at: new Date(),
      })
      .select()
    
    if (error) throw error
    
    // Send email notification to admin
    try {
      await resend.emails.send({
        from: 'Testimonials <onboarding@resend.dev>',
        to: ['joelkaudzu9@gmail.com'],
        subject: `New Testimonial from ${name}`,
        html: `
          <h2>New Testimonial Submitted</h2>
          <p><strong>From:</strong> ${name}</p>
          ${role ? `<p><strong>Role:</strong> ${role}</p>` : ''}
          <p><strong>Content:</strong></p>
          <p>${content.replace(/\n/g, '<br/>')}</p>
          <hr/>
          <p><strong>Action Required:</strong> Approve or reject this testimonial</p>
          <p><a href="https://joelkaudzu-portfolio.vercel.app/admin/testimonials">Go to Admin Panel</a></p>
        `,
      })
    } catch (emailError) {
      console.error('Email send failed:', emailError)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Testimonial submitted for review' 
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to submit testimonial' }, { status: 500 })
  }
}