import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

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
    
    if (error) {
      console.error('Testimonial submission error:', error)
      return NextResponse.json({ error: 'Failed to submit testimonial' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Testimonial submitted for review' 
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}