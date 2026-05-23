import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

// GET single project by slug (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Project fetch error:', error)
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }
  
  return NextResponse.json(data)
}

// UPDATE project by slug (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { slug } = await params
  const body = await request.json()
  
  const { data, error } = await supabaseAdmin
    .from('projects')
    .update({
      title: body.title,
      slug: body.slug,
      subtitle: body.subtitle,
      description: body.description,
      content: body.content,
      technologies: body.technologies,
      image_url: body.image_url,
      gallery_urls: body.gallery_urls || [],
      github_url: body.github_url,
      live_url: body.live_url,
      status: body.status,
      featured: body.featured,
      updated_at: new Date(),
    })
    .eq('slug', slug)
    .select()
    .single()
  
  if (error) {
    console.error('Project update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}

// DELETE project by slug (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { slug } = await params
  
  const { error } = await supabaseAdmin
    .from('projects')
    .delete()
    .eq('slug', slug)
  
  if (error) {
    console.error('Project delete error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}