import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Project fetch error:', error)
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }
  
  return NextResponse.json(data)
}