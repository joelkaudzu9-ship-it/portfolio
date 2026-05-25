import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Get current views
    const { data: current } = await supabaseAdmin
      .from('blog_posts')
      .select('views')
      .eq('slug', slug)
      .single()
    
    const newViews = (current?.views || 0) + 1
    
    // Update views
    const { error } = await supabaseAdmin
      .from('blog_posts')
      .update({ views: newViews })
      .eq('slug', slug)
    
    if (error) throw error
    
    return NextResponse.json({ success: true, views: newViews })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const { data } = await supabaseAdmin
      .from('blog_posts')
      .select('views')
      .eq('slug', slug)
      .single()
    
    return NextResponse.json({ views: data?.views || 0 })
  } catch (error) {
    return NextResponse.json({ views: 0 })
  }
}