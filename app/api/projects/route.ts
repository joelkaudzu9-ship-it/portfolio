import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Projects fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  
  const { data, error } = await supabaseAdmin
    .from('projects')
    .insert({
      title: body.title,
      slug: body.slug,
      subtitle: body.subtitle,
      description: body.description,
      content: body.content || '',
      technologies: body.technologies || [],
      image_url: body.image_url,
      gallery_urls: body.gallery_urls || [],
      github_url: body.github_url,
      live_url: body.live_url,
      status: body.status || 'active',
      featured: body.featured || false,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .select()
  
  if (error) {
    console.error('Project insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data?.[0])
}