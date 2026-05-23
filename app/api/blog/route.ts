import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  
  // Insert the post
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .insert({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      published: body.published,
      featured_image: body.featured_image,
      featured_image_type: body.featured_image_type,
      media_gallery: body.media_gallery || [],
      created_at: new Date(),
      updated_at: new Date(),
    })
    .select()
  
  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // Return the first item (single object)
  return NextResponse.json(data?.[0] || {})
}