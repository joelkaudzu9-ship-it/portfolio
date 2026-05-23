import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

const TABLE_MAP: Record<string, string> = {
  'hero': 'hero_section',
  'executive': 'executive_identity',
  'professional': 'professional_profile',
  'values': 'core_values',
  'education': 'education',
  'skills': 'skills',
  'strengths': 'personal_strengths',
  'growth': 'areas_of_growth',
  'leadership': 'leadership_roles',
  'teaching': 'teaching_experience',
  'conferences': 'conferences',
  'mentors': 'mentors',
  'timeline': 'timeline_events',
  'quotes': 'personal_quotes',
  'vision': 'long_term_vision',
  'roadmap': 'roadmap_items',
  'testimonials': 'testimonials',
  'achievements': 'achievements'
}

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params
  const table = TABLE_MAP[section]
  
  if (!table) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }
  
  try {
    // For sections that should have a single record
    if (section === 'hero' || section === 'executive' || section === 'professional') {
      const { data, error } = await supabaseAdmin
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) throw error
      return NextResponse.json(data || [])
    }
    
    // For sections with multiple records
    const { data, error } = await supabaseAdmin
      .from(table)
      .select('*')
      .order('order_index', { ascending: true, nullsLast: true })
    
    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error(`Error fetching ${section}:`, error)
    // Return empty array instead of error to prevent UI crash
    return NextResponse.json([])
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { section } = await params
  const table = TABLE_MAP[section]
  
  if (!table) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }
  
  const body = await request.json()
  
  // Special handling for hero section (single record)
  if (section === 'hero') {
    // Check if a record already exists
    const { data: existing } = await supabaseAdmin
      .from(table)
      .select('id')
      .limit(1)
    
    if (existing && existing.length > 0) {
      // Update existing record
      const { data, error } = await supabaseAdmin
        .from(table)
        .update(body)
        .eq('id', existing[0].id)
        .select()
      
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json(data?.[0] || {})
    } else {
      // Insert new record
      const { data, error } = await supabaseAdmin
        .from(table)
        .insert(body)
        .select()
      
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json(data?.[0] || {})
    }
  }
  
  // For other sections, insert as new item
  const { data, error } = await supabaseAdmin
    .from(table)
    .insert(body)
    .select()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0] || {})
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { section } = await params
  const table = TABLE_MAP[section]
  
  if (!table) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }
  
  const body = await request.json()
  const { id, ...dataToUpdate } = body
  
  const { data, error } = await supabaseAdmin
    .from(table)
    .update(dataToUpdate)
    .eq('id', id)
    .select()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0] || {})
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { section } = await params
  const table = TABLE_MAP[section]
  
  if (!table) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }
  
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }
  
  const { error } = await supabaseAdmin
    .from(table)
    .delete()
    .eq('id', id)
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}