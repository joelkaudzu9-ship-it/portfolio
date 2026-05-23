import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

function isAdmin() {
  const cookieStore = cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data, error } = await supabaseAdmin
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}