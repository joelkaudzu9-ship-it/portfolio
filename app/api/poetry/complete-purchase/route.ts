import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

async function sendEmail(email: string, name: string, tx_ref: string) {
  try {
    const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL}/poetry/download?email=${encodeURIComponent(email)}&token=${tx_ref}`
    
    const info = await transporter.sendMail({
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
    
    console.log('Email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Email error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tx_ref, email, name } = await request.json()
    
    console.log('Completing purchase:', { tx_ref, email, name })
    
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
    
    console.log('Purchase saved to database')
    
    // Send email
    let emailSent = false
    if (email) {
      emailSent = await sendEmail(email, name || 'Customer', tx_ref)
    }
    
    return NextResponse.json({ 
      success: true, 
      emailSent,
      message: emailSent ? 'Email sent' : 'Purchase saved but email failed'
    })
    
  } catch (error) {
    console.error('Complete purchase error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}