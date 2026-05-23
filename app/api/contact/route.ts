import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    
    const { error } = await supabaseAdmin
      .from('messages')
      .insert({ name, email, message, read: false, created_at: new Date() })
    
    if (error) {
      console.error('Contact form error:', error)
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}