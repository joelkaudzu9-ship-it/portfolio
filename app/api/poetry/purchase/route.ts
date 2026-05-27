import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, paymentMethod, amount, product } = body
    
    // Validate required fields
    if (!name || !email || !phone || !paymentMethod || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Get the secret key from environment
    const secretKey = process.env.PAYCHANGU_SECRET_KEY
    
    if (!secretKey) {
      console.error('PayChangu secret key not configured')
      // Fallback for testing
      return NextResponse.json({
        success: true,
        paymentUrl: `/poetry/success?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`
      })
    }
    
    // PayChangu API integration
    const payChanguUrl = 'https://api.paychangu.com/v1/payment/initialize'
    
    const response = await fetch(payChanguUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'MWK',
        email: email,
        name: name,
        phone: phone,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/poetry/verify`,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/poetry/success`,
        description: product || 'Threads of Becoming - Poetry Collection'
      })
    })
    
    const data = await response.json()
    
    if (data.status === 'success' && data.data?.payment_url) {
      // Save purchase to database
      await savePurchase({ name, email, phone, amount, paymentMethod, reference: data.data.reference })
      
      return NextResponse.json({
        success: true,
        paymentUrl: data.data.payment_url,
        reference: data.data.reference
      })
    } else {
      return NextResponse.json(
        { error: data.message || 'Payment initialization failed' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function savePurchase(data: any) {
  // Implement your database save logic here
  console.log('Saving purchase:', data)
}