import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, paymentMethod, amount, product } = body
    
    console.log('📦 Purchase request received:', { name, email, phone, paymentMethod, amount })
    
    const secretKey = process.env.PAYCHANGU_SECRET_KEY
    
    if (!secretKey) {
      return NextResponse.json(
        { success: false, error: 'Payment provider not configured' },
        { status: 500 }
      )
    }
    
    // Generate unique transaction reference
    const tx_ref = `POETRY_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    
    const payload = {
      amount: String(amount),
      currency: 'MWK',
      tx_ref: tx_ref,
      first_name: name.split(' ')[0] || name,
      last_name: name.split(' ').slice(1).join(' ') || 'Customer',
      email: email,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/poetry/verify`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/poetry/success`,
      customization: {
        title: 'Threads of Becoming',
        description: product || 'Poetry Collection by Joel Kaudzu'
      }
    }
    
    console.log('🚀 Sending to PayChangu:', { url: 'https://api.paychangu.com/payment', payload })
    
    const response = await fetch('https://api.paychangu.com/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`
      },
      body: JSON.stringify(payload)
    })
    
    const data = await response.json()
    console.log('📡 PayChangu response:', data)
    
    if (response.ok && data.status === 'success' && data.data?.checkout_url) {
      return NextResponse.json({
        success: true,
        paymentUrl: data.data.checkout_url,
        tx_ref: tx_ref
      })
    } else {
      // Always return a string error message
      const errorMessage = data.message || data.error || 'Payment initialization failed'
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('❌ Payment error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}