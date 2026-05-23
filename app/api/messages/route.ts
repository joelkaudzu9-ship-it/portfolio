import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

// GET all messages (admin only)
export async function GET() {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data, error } = await supabaseAdmin
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data || [])
}

// POST new message (public)
export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert({ name, email, message, read: false, created_at: new Date() })
      .select()
    
    if (error) {
      console.error('Message insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, message: data?.[0] })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}