import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  
  // Increment views
  const { data } = await supabaseAdmin
    .from('blog_posts')
    .select('views')
    .eq('slug', slug)
    .single()
  
  const newViews = (data?.views || 0) + 1
  
  await supabaseAdmin
    .from('blog_posts')
    .update({ views: newViews })
    .eq('slug', slug)
  
  return NextResponse.json({ views: newViews })
}