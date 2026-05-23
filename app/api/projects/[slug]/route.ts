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
  
  // Validate required fields
  if (!body.title || body.title.trim() === '') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  
  if (!body.slug || body.slug.trim() === '') {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }
  
  // Check for duplicate slug (excluding current project)
  if (body.slug !== slug) {
    const { data: existingProject, error: checkError } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('slug', body.slug)
      .maybeSingle()
    
    if (existingProject) {
      return NextResponse.json({ 
        error: `Slug "${body.slug}" already exists. Please choose a different slug.` 
      }, { status: 409 })
    }
  }
  
  // Build update object with only the fields that are provided
  const updateData: any = {
    updated_at: new Date().toISOString(),
  }
  
  if (body.title !== undefined) updateData.title = body.title.trim()
  if (body.slug !== undefined) updateData.slug = body.slug.trim()
  if (body.subtitle !== undefined) updateData.subtitle = body.subtitle || null
  if (body.description !== undefined) updateData.description = body.description || null
  if (body.content !== undefined) updateData.content = body.content || null
  if (body.technologies !== undefined) updateData.technologies = body.technologies || []
  if (body.image_url !== undefined) updateData.image_url = body.image_url || null
  if (body.gallery_urls !== undefined) updateData.gallery_urls = body.gallery_urls || []
  if (body.github_url !== undefined) updateData.github_url = body.github_url || null
  if (body.live_url !== undefined) updateData.live_url = body.live_url || null
  if (body.status !== undefined) updateData.status = body.status || 'active'
  if (body.featured !== undefined) updateData.featured = body.featured || false
  
  const { data, error } = await supabaseAdmin
    .from('projects')
    .update(updateData)
    .eq('slug', slug)
    .select()
  
  if (error) {
    console.error('Project update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }
  
  // Return the first item (single object) instead of array
  return NextResponse.json(data[0])
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
  
  // Check if project exists before deleting
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .single()
  
  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }
  
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