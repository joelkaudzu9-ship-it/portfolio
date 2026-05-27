import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('🔍 TEST ENDPOINT HIT')
  console.log('Method:', request.method)
  console.log('URL:', request.url)
  console.log('Headers:', JSON.stringify(Object.fromEntries(request.headers), null, 2))
  
  return NextResponse.json({ 
    message: 'Debug endpoint working',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  console.log('📡 POST received at debug endpoint:', JSON.stringify(body, null, 2))
  
  return NextResponse.json({ received: true })
}