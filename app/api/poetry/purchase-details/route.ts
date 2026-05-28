import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const tx_ref = request.nextUrl.searchParams.get('tx_ref')
  
  if (!tx_ref) {
    return NextResponse.json({ error: 'Missing tx_ref' }, { status: 400 })
  }
  
  const { data, error } = await supabaseAdmin
    .from('poetry_purchases')
    .select('email, name')
    .eq('tx_ref', tx_ref)
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ email: data?.email, name: data?.name })
}