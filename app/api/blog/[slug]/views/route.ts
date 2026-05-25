import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
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
  } catch (error) {
    return NextResponse.json({ views: 0 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Get current viewsss
    const { data: current } = await supabaseAdmin
      .from('blog_posts')
      .select('views')
      .eq('slug', slug)
      .single()
    
    const newViews = (current?.views || 0) + 1
    
    // Update with new count
    const { error } = await supabaseAdmin
      .from('blog_posts')
      .update({ views: newViews })
      .eq('slug', slug)
    
    if (error) {
      console.error('Error updating views:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, views: newViews })
  } catch (error) {
    console.error('Views error:', error)
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 })
  }
}