import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET comments for a post
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postSlug = searchParams.get('postSlug')
  
  if (!postSlug) {
    return NextResponse.json({ error: 'postSlug required' }, { status: 400 })
  }
  
  const { data, error } = await supabaseAdmin
    .from('blog_comments')
    .select('*')
    .eq('post_slug', postSlug)
    .eq('approved', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data || [])
}

// POST a new comment
export async function POST(request: NextRequest) {
  try {
    const { postSlug, author, content } = await request.json()
    
    if (!postSlug || !author || !content) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }
    
    if (content.length < 3 || content.length > 2000) {
      return NextResponse.json({ error: 'Comment must be between 3-2000 characters' }, { status: 400 })
    }
    
    const { data, error } = await supabaseAdmin
      .from('blog_comments')
      .insert({ 
        post_slug: postSlug, 
        author: author.trim(), 
        content: content.trim(),
        approved: false
      })
      .select()
      .single()
    
    if (error) {
      console.error('Comment error:', error)
      return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}