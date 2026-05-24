import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // Handle array response
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
  
  // Return the first item (single object
  return NextResponse.json(data[0])
}