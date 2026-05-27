import { NextRequest, NextResponse } from 'next/server'

// Handle both GET (from redirect) and POST (webhook)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tx_ref = searchParams.get('tx_ref')
    const status = searchParams.get('status')
    
    console.log('📡 Payment redirect received:', { tx_ref, status })
    
    // Get the secret key
    const secretKey = process.env.PAYCHANGU_SECRET_KEY
    
    if (!secretKey) {
      console.error('❌ PayChangu secret key not configured')
      return NextResponse.redirect(new URL('/poetry/success?error=config', request.url))
    }
    
    if (tx_ref) {
      // Verify the payment status with PayChangu
      const verifyUrl = `https://api.paychangu.com/verify-payment/${tx_ref}`
      
      const verifyResponse = await fetch(verifyUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secretKey}`
        }
      })
      
      const verifyData = await verifyResponse.json()
      console.log('📡 Verification response:', verifyData)
      
      if (verifyData.status === 'success' && verifyData.data?.status === 'success') {
        // Payment successful
        const email = verifyData.data?.customer?.email || ''
        const name = verifyData.data?.customer?.first_name || ''
        
        // Redirect to success page
        return NextResponse.redirect(
          new URL(`/poetry/success?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&tx_ref=${tx_ref}`, request.url)
        )
      }
    }
    
    // If payment failed or status unclear, redirect to failure
    return NextResponse.redirect(new URL('/poetry/failed', request.url))
    
  } catch (error) {
    console.error('❌ Verification error:', error)
    return NextResponse.redirect(new URL('/poetry/failed', request.url))
  }
}

// Handle POST for webhook (kept for automatic notifications)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📡 Webhook received:', body)
    
    const { tx_ref, status } = body
    
    if (status === 'success' && tx_ref) {
      console.log(`✅ Payment successful for tx_ref: ${tx_ref}`)
      // Update database, send email, etc.
    }
    
    return NextResponse.json({ status: 'received' })
    
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}