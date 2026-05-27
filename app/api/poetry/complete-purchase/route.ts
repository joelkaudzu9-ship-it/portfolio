import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

async function sendEmail(email: string, name: string, tx_ref: string) {
  try {
    const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL}/poetry/download?email=${encodeURIComponent(email)}&token=${tx_ref}`
    
    const brevoApiKey = process.env.BREVO_API_KEY
    
    if (!brevoApiKey) {
      console.error('❌ BREVO_API_KEY not configured')
      return false
    }
    
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify({
        sender: {
          name: 'Joel George Kaudzu',
          email: 'joelkaudzu9@gmail.com'
        },
        to: [{ email: email, name: name || 'Customer' }],
        subject: '📖 Your Poetry Collection - Threads of Becoming',
        htmlContent: `
          <h2>Thank you for your purchase, ${name || 'Customer'}!</h2>
          <p>Click the link below to download your poetry collection:</p>
          <a href="${downloadLink}">Download Threads of Becoming</a>
          <p>Or copy this link: ${downloadLink}</p>
          <br>
          <p>Thank you for supporting my work!</p>
          <p>Joel Kaudzu</p>
        `
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Email sent to:', email)
      return true
    } else {
      console.error('❌ Brevo error:', data)
      return false
    }
    
  } catch (error) {
    console.error('❌ Email error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tx_ref, email, name } = await request.json()
    
    console.log('📦 Completing purchase:', { tx_ref, email, name })
    
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
      console.error('❌ DB error:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }
    
    console.log('✅ Purchase saved')
    
    // Send email directly from here!
    let emailSent = false
    if (email) {
      emailSent = await sendEmail(email, name, tx_ref)
    }
    
    return NextResponse.json({ 
      success: true, 
      emailSent,
      message: emailSent ? 'Purchase completed and email sent' : 'Purchase saved but email failed'
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}