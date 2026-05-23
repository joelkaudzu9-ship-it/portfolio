import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await isAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { id } = await params
  const body = await request.json()
  
  const { error } = await supabaseAdmin
    .from('messages')
    .update({ read: body.read })
    .eq('id', id)
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await isAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { id } = await params
  const { error } = await supabaseAdmin
    .from('messages')
    .delete()
    .eq('id', id)
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}