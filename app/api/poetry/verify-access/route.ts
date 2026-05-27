import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json()
    
    console.log('🔍 Verifying access for:', { email, token })
    
    if (!email && !token) {
      return NextResponse.json({ hasAccess: false, error: 'Email or token required' }, { status: 400 })
    }
    
    let query = supabaseAdmin.from('poetry_purchases').select('*')
    
    if (token) {
      query = query.eq('tx_ref', token)
    } else if (email) {
      query = query.eq('email', email)
    }
    
    const { data, error } = await query
    
    console.log('Database query result:', { data, error })
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ hasAccess: false, error: 'Database error' }, { status: 500 })
    }
    
    const hasAccess = data && data.length > 0 && data[0].status === 'completed'
    
    console.log('Access granted:', hasAccess)
    
    return NextResponse.json({ 
      hasAccess: hasAccess,
      purchase: hasAccess ? { email: data[0].email, name: data[0].name } : null
    })
    
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ hasAccess: false, error: 'Server error' }, { status: 500 })
  }
}