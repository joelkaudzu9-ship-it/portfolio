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
          name: process.env.BREVO_SENDER_NAME || 'Joel George Kaudzu',
          email: process.env.BREVO_SENDER_EMAIL || 'joelkaudzu9@gmail.com'
        },
        to: [{
          email: email,
          name: name || 'Customer'
        }],
        subject: '📖 Your Poetry Collection - Threads of Becoming',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="UTF-8"></head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #D4A017, #B8860B); border-radius: 10px; color: white;">
              <h1 style="margin: 0;">Threads of Becoming</h1>
              <p style="margin: 5px 0 0;">Poetry Collection by Joel Kaudzu</p>
            </div>
            
            <div style="padding: 20px;">
              <h2>Thank you for your purchase, ${name || 'Poetry Lover'}!</h2>
              <p>Your payment was successful. Click the button below to download your poetry collection:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${downloadLink}" style="display: inline-block; padding: 12px 30px; background: #D4A017; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">📥 Download Now</a>
              </div>
              
              <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link:</p>
              <p style="font-size: 12px; color: #666; word-break: break-all;">${downloadLink}</p>
              
              <hr style="margin: 20px 0;">
              <p style="font-size: 12px; color: #666;">Thank you for supporting my work!</p>
              <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} Joel George Kaudzu</p>
            </div>
          </body>
          </html>
        `
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Email sent to:', email, 'Message ID:', data.messageId)
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
    
    console.log('💾 Completing purchase:', { tx_ref, email, name })
    
    if (!tx_ref) {
      return NextResponse.json({ error: 'Missing tx_ref' }, { status: 400 })
    }
    
    // Check if purchase already exists
    const { data: existing } = await supabaseAdmin
      .from('poetry_purchases')
      .select('*')
      .eq('tx_ref', tx_ref)
      .single()
    
    let emailSent = false
    
    if (!existing) {
      // Save to database
      const { error: dbError } = await supabaseAdmin
        .from('poetry_purchases')
        .insert({
          tx_ref: tx_ref,
          email: email || '',
          name: name || 'Customer',
          amount: 400,
          status: 'completed',
          payment_method: 'paychangu',
          completed_at: new Date().toISOString()
        })
      
      if (dbError) {
        console.error('❌ DB error:', dbError)
        return NextResponse.json({ error: dbError.message }, { status: 500 })
      }
      
      console.log('✅ Purchase saved to database')
      
      // ✅ SEND EMAIL - This was missing!
      if (email) {
        emailSent = await sendEmail(email, name || 'Customer', tx_ref)
      } else {
        console.warn('⚠️ No email provided, cannot send download link')
      }
    } else {
      console.log('⚠️ Purchase already exists, skipping email')
      emailSent = true // Assume already sent
    }
    
    return NextResponse.json({ 
      success: true, 
      emailSent,
      message: emailSent ? 'Purchase completed and email sent' : 'Purchase completed but email failed'
    })
    
  } catch (error) {
    console.error('❌ Complete purchase error:', error)
    return NextResponse.json({ error: 'Failed to complete purchase' }, { status: 500 })
  }
}