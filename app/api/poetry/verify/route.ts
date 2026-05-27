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

async function sendEmail(email: string, name: string, tx_ref: string) {
  const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL}/poetry/success?tx_ref=${tx_ref}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`
  
  await transporter.sendMail({
    from: `"Joel George Kaudzu" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '📖 Your Poetry Collection - Threads of Becoming',
    html: `
      <h2>Thank you for your purchase, ${name}!</h2>
      <p>Click the link below to download your poetry collection:</p>
      <a href="${downloadLink}">Download Threads of Becoming</a>
      <p>Or copy this link: ${downloadLink}</p>
      <br>
      <p>Thank you for supporting my work!</p>
      <p>Joel Kaudzu</p>
    `
  })
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tx_ref = searchParams.get('tx_ref')
  const status = searchParams.get('status')
  
  console.log('📡 Payment redirect:', { tx_ref, status })
  
  // Just redirect to success page
  return NextResponse.redirect(new URL(`/poetry/success?tx_ref=${tx_ref}&status=${status}`, request.url))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📡 Webhook received:', body)
    
    const { tx_ref, status } = body
    
    if (status === 'success' && tx_ref) {
      // Verify with PayChangu
      const secretKey = process.env.PAYCHANGU_SECRET_KEY
      const verifyRes = await fetch(`https://api.paychangu.com/verify-payment/${tx_ref}`, {
        headers: { 'Authorization': `Bearer ${secretKey}` }
      })
      const verifyData = await verifyRes.json()
      
      if (verifyData.status === 'success') {
        const email = verifyData.data?.customer?.email || ''
        const name = `${verifyData.data?.customer?.first_name || ''} ${verifyData.data?.customer?.last_name || ''}`.trim() || 'Customer'
        
        // Save to database
        const { data: existing } = await supabaseAdmin
          .from('poetry_purchases')
          .select('*')
          .eq('tx_ref', tx_ref)
          .single()
        
        if (!existing) {
          await supabaseAdmin.from('poetry_purchases').insert({
            tx_ref: tx_ref,
            email: email,
            name: name,
            amount: 200,
            status: 'completed',
            payment_method: 'paychangu',
            completed_at: new Date().toISOString()
          })
        }
        
        // Send email
        await sendEmail(email, name, tx_ref)
      }
    }
    
    return NextResponse.json({ status: 'received' })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}