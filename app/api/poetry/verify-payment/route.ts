import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const tx_ref = request.nextUrl.searchParams.get('tx_ref')
    
    if (!tx_ref) {
      return NextResponse.json({ status: 'failed', paymentStatus: 'no_reference' }, { status: 400 })
    }
    
    const secretKey = process.env.PAYCHANGU_SECRET_KEY
    
    if (!secretKey) {
      return NextResponse.json({ status: 'failed', paymentStatus: 'config_error' }, { status: 500 })
    }
    
    // Verify with PayChangu
    const response = await fetch(`https://api.paychangu.com/verify-payment/${tx_ref}`, {
      headers: { 'Authorization': `Bearer ${secretKey}` }
    })
    
    const data = await response.json()
    
    if (data.status === 'success' && data.data?.status === 'success') {
      return NextResponse.json({ 
        status: 'success', 
        paymentStatus: 'success',
        email: data.data?.customer?.email,
        amount: data.data?.amount
      })
    } else if (data.data?.status === 'cancelled') {
      return NextResponse.json({ status: 'failed', paymentStatus: 'cancelled' })
    } else {
      return NextResponse.json({ status: 'failed', paymentStatus: 'failed' })
    }
    
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ status: 'failed', paymentStatus: 'error' }, { status: 500 })
  }
}