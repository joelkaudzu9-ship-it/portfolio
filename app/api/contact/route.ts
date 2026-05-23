import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const { name, email, message } = await request.json()
  
  const { error } = await supabaseAdmin
    .from('messages')
    .insert({ name, email, message, read: false })
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}