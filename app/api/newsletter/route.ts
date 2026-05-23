import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// Create newsletter table if not exists
// CREATE TABLE newsletter (
//   id SERIAL PRIMARY KEY,
//   email TEXT UNIQUE NOT NULL,
//   created_at TIMESTAMP DEFAULT NOW()
// );

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }
    
    const { error } = await supabaseAdmin
      .from('newsletter')
      .insert({ email, created_at: new Date() })
    
    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Already subscribed' }, { status: 400 })
      }
      throw error
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}