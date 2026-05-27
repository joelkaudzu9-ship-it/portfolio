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
  const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL}/poetry/download?email=${encodeURIComponent(email)}&token=${tx_ref}`
  
  await transporter.sendMail({
    from: `"Joel George Kaudzu" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '📖 Your Poetry Collection - Threads of Becoming',
    html: `
      <h2>Thank you for your purchase, ${name}!</h2>
      <p>Click the link below to download your poetry collection:</p>
      <a href="${downloadLink}" style="display: inline-block; padding: 10px 20px; background: #D4A017; color: white; text-decoration: none; border-radius: 5px;">Download Now</a>
      <p>Or copy this link: ${downloadLink}</p>
      <br>
      <p>Thank you for supporting my work!</p>
      <p>Joel Kaudzu</p>
    `
  })
}

export async function POST(request: NextRequest) {
  try {
    const { tx_ref, email, name } = await request.json()
    
    console.log('💾 Completing purchase:', { tx_ref, email, name })
    
    if (!tx_ref) {
      return NextResponse.json({ error: 'Missing tx_ref' }, { status: 400 })
    }
    
    // Save to database
    const { error: dbError } = await supabaseAdmin
      .from('poetry_purchases')
      .upsert({
        tx_ref: tx_ref,
        email: email || '',
        name: name || 'Customer',
        amount: 200,
        status: 'completed',
        payment_method: 'paychangu',
        completed_at: new Date().toISOString()
      }, { onConflict: 'tx_ref' })
    
    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }
    
    console.log('✅ Purchase saved to database')
    
    // Send email if email provided
    if (email) {
      await sendEmail(email, name || 'Customer', tx_ref)
      console.log('✅ Email sent to:', email)
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Complete purchase error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}