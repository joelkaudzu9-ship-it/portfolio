import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email') || 'joelkaudzu9@gmail.com'
    const name = request.nextUrl.searchParams.get('name') || 'Test User'
    
    const brevoApiKey = process.env.BREVO_API_KEY
    
    if (!brevoApiKey) {
      return NextResponse.json({ error: 'BREVO_API_KEY not configured' }, { status: 500 })
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
        to: [{ email: email, name: name }],
        subject: 'Test Email from Brevo',
        htmlContent: `<h2>Hello ${name}!</h2><p>This is a test email to confirm Brevo is working.</p>`
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      return NextResponse.json({ success: true, messageId: data.messageId })
    } else {
      return NextResponse.json({ success: false, error: data }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}