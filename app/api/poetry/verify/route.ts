import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

async function sendDownloadEmail(email: string, name: string, tx_ref: string) {
  const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL}/poetry/download?email=${encodeURIComponent(email)}&token=${tx_ref}`
  await transporter.sendMail({
    from: `"Joel George Kaudzu" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '📖 Your Poetry Collection - Threads of Becoming',
    html: `<h2>Thank you ${name}!</h2><p><a href="${downloadLink}">Click here to download</a></p>`
  })
}

// This endpoint receives BOTH redirects and webhooks
export async function GET(request: NextRequest) {
  return handleVerification(request)
}

export async function POST(request: NextRequest) {
  return handleVerification(request)
}

async function handleVerification(request: NextRequest) {
  try {
    let tx_ref = ''
    let status = ''
    
    // Handle both GET (query params) and POST (body)
    if (request.method === 'GET') {
      const searchParams = request.nextUrl.searchParams
      tx_ref = searchParams.get('tx_ref') || ''
      status = searchParams.get('status') || ''
    } else {
      const body = await request.json()
      tx_ref = body.tx_ref || body.reference || ''
      status = body.status || body.payment_status || ''
    }
    
    console.log(`📡 Payment verification: ${request.method} - tx_ref: ${tx_ref}, status: ${status}`)
    
    if (!tx_ref) {
      console.error('❌ No tx_ref provided')
      return NextResponse.redirect(new URL('/poetry/failed', request.url))
    }
    
    // Verify with PayChangu API
    const secretKey = process.env.PAYCHANGU_SECRET_KEY
    const verifyRes = await fetch(`https://api.paychangu.com/verify-payment/${tx_ref}`, {
      headers: { 'Authorization': `Bearer ${secretKey}` }
    })
    const verifyData = await verifyRes.json()
    
    console.log('PayChangu verification:', JSON.stringify(verifyData, null, 2))
    
    const isSuccessful = verifyData.status === 'success' && verifyData.data?.status === 'success'
    
    if (!isSuccessful) {
      console.error('❌ Payment not successful')
      return NextResponse.redirect(new URL('/poetry/failed', request.url))
    }
    
    const email = verifyData.data?.customer?.email || ''
    const name = `${verifyData.data?.customer?.first_name || ''} ${verifyData.data?.customer?.last_name || ''}`.trim() || 'Customer'
    
    // Save to database - use upsert to avoid duplicates
    const { error: dbError } = await supabaseAdmin
      .from('poetry_purchases')
      .upsert({
        tx_ref: tx_ref,
        name: name,
        email: email,
        amount: verifyData.data?.amount || 200,
        status: 'completed',
        payment_method: 'paychangu',
        completed_at: new Date().toISOString()
      }, { onConflict: 'tx_ref' })
    
    if (dbError) {
      console.error('❌ DB error:', dbError)
    } else {
      console.log('✅ Purchase saved for:', email)
      await sendDownloadEmail(email, name, tx_ref)
    }
    
    // Redirect to success page for GET requests
    if (request.method === 'GET') {
      return NextResponse.redirect(new URL(`/poetry/success?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&tx_ref=${tx_ref}`, request.url))
    }
    
    return NextResponse.json({ status: 'success' })
    
  } catch (error) {
    console.error('❌ Verification error:', error)
    if (request.method === 'GET') {
      return NextResponse.redirect(new URL('/poetry/failed', request.url))
    }
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}