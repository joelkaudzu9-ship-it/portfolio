import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

// GET single project by slug
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
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }
  
  return NextResponse.json(data)
}

// UPDATE project by slug - allows partial updates
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
  
  // Only update the fields that are provided
  // Don't require all fields
  const updateData: any = {
    updated_at: new Date(),
  }
  
  // Only add fields that exist in the request body
  if (body.featured !== undefined) updateData.featured = body.featured
  if (body.title !== undefined) updateData.title = body.title
  if (body.slug !== undefined) updateData.slug = body.slug
  if (body.subtitle !== undefined) updateData.subtitle = body.subtitle
  if (body.description !== undefined) updateData.description = body.description
  if (body.content !== undefined) updateData.content = body.content
  if (body.technologies !== undefined) updateData.technologies = body.technologies
  if (body.image_url !== undefined) updateData.image_url = body.image_url
  if (body.gallery_urls !== undefined) updateData.gallery_urls = body.gallery_urls
  if (body.github_url !== undefined) updateData.github_url = body.github_url
  if (body.live_url !== undefined) updateData.live_url = body.live_url
  if (body.status !== undefined) updateData.status = body.status
  
  const { data, error } = await supabaseAdmin
    .from('projects')
    .update(updateData)
    .eq('slug', slug)
    .select()
  
  if (error) {
    console.error('Project update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data?.[0] || {})
}

// DELETE project by slug
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}