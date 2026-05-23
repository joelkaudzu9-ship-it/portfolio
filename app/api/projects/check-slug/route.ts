import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const exclude = searchParams.get('exclude')
  
  if (!slug) {
    return NextResponse.json({ error: 'Slug parameter required' }, { status: 400 })
  }
  
  try {
    let query = supabaseAdmin
      .from('projects')
      .select('id, slug')
      .eq('slug', slug)
    
    if (exclude) {
      query = query.neq('slug', exclude)
    }
    
    const { data, error } = await query.limit(1)
    
    if (error) {
      console.error('Slug check error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      exists: data && data.length > 0,
      slug: slug,
      available: !(data && data.length > 0)
    })
  } catch (error) {
    console.error('Slug check error:', error)
    return NextResponse.json({ error: 'Failed to check slug' }, { status: 500 })
  }
}