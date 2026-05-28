import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { tx_ref, email, name } = await request.json()
    
    console.log('💾 Saving purchase:', { tx_ref, email, name })
    
    if (!tx_ref) {
      return NextResponse.json({ error: 'Missing tx_ref' }, { status: 400 })
    }
    
    const { error: dbError } = await supabaseAdmin
      .from('poetry_purchases')
      .upsert({
        tx_ref: tx_ref,
        email: email || '',
        name: name || 'Customer',
        amount: 400,
        status: 'completed',
        payment_method: 'paychangu',
        completed_at: new Date().toISOString()
      }, { onConflict: 'tx_ref' })
    
    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Save error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}