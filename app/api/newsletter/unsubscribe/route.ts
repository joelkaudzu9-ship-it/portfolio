import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

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
    
    console.log('Successfully subscribed:', email, data)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed!' 
    })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}