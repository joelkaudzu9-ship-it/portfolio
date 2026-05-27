import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { tx_ref, email, name } = await request.json()
    
    console.log('💾 Saving purchase:', { tx_ref, email, name })
    
    if (!tx_ref) {
      return NextResponse.json({ error: 'Missing tx_ref' }, { status: 400 })
    }
    
    // Check if already exists
    const { data: existing } = await supabaseAdmin
      .from('poetry_purchases')
      .select('*')
      .eq('tx_ref', tx_ref)
      .single()
    
    if (!existing) {
      const { error } = await supabaseAdmin
        .from('poetry_purchases')
        .insert({
          tx_ref: tx_ref,
          email: email || '',
          name: name || 'Customer',
          amount: 200,
          status: 'completed',
          payment_method: 'paychangu',
          completed_at: new Date().toISOString()
        })
      
      if (error) {
        console.error('DB insert error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      console.log('✅ Purchase saved successfully')
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Save purchase error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}