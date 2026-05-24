import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const admin = await isAdmin()
  
  let query = supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
  
  // If not admin, only return published posts
  if (!admin) {
    query = query.eq('published', true)
  }
  
  const { data, error } = await query.single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}