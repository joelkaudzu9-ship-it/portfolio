import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const tx_ref = request.nextUrl.searchParams.get('tx_ref')
  return NextResponse.redirect(new URL(`/poetry/success?tx_ref=${tx_ref}`, request.url))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  console.log('Webhook received:', body)
  return NextResponse.json({ status: 'received' })
}