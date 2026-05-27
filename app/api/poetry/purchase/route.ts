import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, paymentMethod, amount, product } = body
    
    console.log('📦 Purchase request:', { name, email, phone, paymentMethod, amount })
    
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
      console.error('❌ PayChangu secret key not configured')
      return NextResponse.json(
        { error: 'Payment provider not configured' },
        { status: 500 }
      )
    }
    
    // Generate unique transaction reference
    const tx_ref = `POETRY_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    
    // CORRECT PayChangu API endpoint - /payment (not /payment/initialize)
    const payChanguUrl = 'https://api.paychangu.com/payment'
    
    // Prepare payload according to PayChangu docs
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
      },
      meta: JSON.stringify({
        customer_name: name,
        product_type: 'poetry_collection',
        phone: phone
      })
    }
    
    console.log('🚀 Sending to PayChangu:', { url: payChanguUrl, payload })
    
    // Make request to PayChangu
    const response = await fetch(payChanguUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`
      },
      body: JSON.stringify(payload)
    })
    
    const responseText = await response.text()
    console.log('📡 PayChangu response status:', response.status)
    console.log('📡 PayChangu response body:', responseText)
    
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error('❌ Failed to parse PayChangu response:', responseText)
      return NextResponse.json(
        { error: 'Invalid response from payment provider' },
        { status: 500 }
      )
    }
    
    // Handle successful response
    if (response.ok && data.status === 'success' && data.data?.checkout_url) {
      console.log('✅ Payment initialized successfully')
      
      // Save purchase to database
      // await savePurchase({ name, email, phone, amount, tx_ref, status: 'pending' })
      
      return NextResponse.json({
        success: true,
        paymentUrl: data.data.checkout_url,
        tx_ref: tx_ref
      })
    } else {
      console.error('❌ PayChangu error:', data)
      return NextResponse.json(
        { error: data.message || 'Payment initialization failed' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('❌ Payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}