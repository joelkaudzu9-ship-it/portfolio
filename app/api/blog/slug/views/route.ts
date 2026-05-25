import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = await params
  
  // Increment view count
  const { data, error } = await supabaseAdmin.rpc('increment_blog_views', {
    post_slug: slug
  })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = await params
  
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('views')
    .eq('slug', slug)
    .single()
  
  if (error) {
    return NextResponse.json({ views: 0 })
  }
  
  return NextResponse.json({ views: data?.views || 0 })
}