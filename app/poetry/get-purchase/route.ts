import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const tx_ref = request.nextUrl.searchParams.get('tx_ref')
  
  if (!tx_ref) {
    return NextResponse.json({ error: 'Missing tx_ref' }, { status: 400 })
  }
  
  try {
    const secretKey = process.env.PAYCHANGU_SECRET_KEY
    
    const response = await fetch(`https://api.paychangu.com/verify-payment/${tx_ref}`, {
      headers: { 'Authorization': `Bearer ${secretKey}` }
    })
    
    const data = await response.json()
    
    if (data.status === 'success') {
      return NextResponse.json({
        email: data.data?.customer?.email || '',
        name: `${data.data?.customer?.first_name || ''} ${data.data?.customer?.last_name || ''}`.trim()
      })
    } else {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }
    
  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}