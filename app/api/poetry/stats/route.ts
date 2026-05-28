import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from('poetry_purchases')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
    
    if (error) throw error
    
    return NextResponse.json({ totalSales: count || 0 })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ totalSales: 0 }, { status: 500 })
  }
}