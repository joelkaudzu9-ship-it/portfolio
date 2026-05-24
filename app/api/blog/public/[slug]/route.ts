import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server' // Use public client

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  
  const supabase = createClient() // Public client, not admin
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true) // Only published posts
    .single()
  
  if (error) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
  
  return NextResponse.json(data)
}