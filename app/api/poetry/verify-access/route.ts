import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }
    
    // Check if email has purchased
    const { data, error } = await supabaseAdmin
      .from('poetry_purchases')
      .select('id')
      .eq('email', email)
      .eq('status', 'completed')
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Database error:', error)
    }
    
    return NextResponse.json({ 
      hasAccess: !!data,
      email: email 
    })
    
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}