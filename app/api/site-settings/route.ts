import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

// GET all settings (public)
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('*')
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  // Convert array to object with key as property
  const settings = (data || []).reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {} as Record<string, any>)
  
  return NextResponse.json(settings)
}

// POST/UPDATE settings (admin only)
export async function POST(request: Request) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { key, value } = await request.json()
  
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date() })
    .select()
    .single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}