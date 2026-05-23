import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

function isAdmin() {
  const cookieStore = cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .update({ ...body, updated_at: new Date() })
    .eq('id', params.id)
    .select()
    .single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { error } = await supabaseAdmin
    .from('blog_posts')
    .delete()
    .eq('id', params.id)
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}