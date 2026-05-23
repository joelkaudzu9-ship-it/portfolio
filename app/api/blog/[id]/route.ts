import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

// Get single post by ID (admin use)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

// Update post
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { id } = await params
  const body = await request.json()
  
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .update({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      published: body.published,
      featured_image: body.featured_image,
      featured_image_type: body.featured_image_type,
      media_gallery: body.media_gallery || [],
      updated_at: new Date(),
    })
    .eq('id', id)
    .select()
  
  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data?.[0] || {})
}

// Delete post
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { id } = await params
  
  const { error } = await supabaseAdmin
    .from('blog_posts')
    .delete()
    .eq('id', id)
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}