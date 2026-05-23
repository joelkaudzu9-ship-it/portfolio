import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const featured = searchParams.get('featured')
  
  let query = supabaseAdmin
    .from('projects')
    .select('*')
    .order('order_index', { ascending: true })
  
  if (featured === 'true') {
    query = query.eq('featured', true)
  }
  
  const { data, error } = await query
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}