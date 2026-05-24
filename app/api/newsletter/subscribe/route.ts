import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }
    
    // Check if email already exists
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('email')
      .eq('email', email)
      .single()
    
    if (existing) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 })
    }
    
    // Save to database
    const { error: insertError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert({ 
        email, 
        subscribed_at: new Date().toISOString(),
        status: 'active'
      })
    
    if (insertError) {
      console.error('Newsletter insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}