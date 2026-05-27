import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (optional but secure)
    const signature = request.headers.get('x-paychangu-signature')
    const webhookSecret = process.env.PAYCHANGU_WEBHOOK_SECRET
    
    const body = await request.json()
    console.log('📡 Webhook received:', body)
    
    // Verify signature if secret is set
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(body))
        .digest('hex')
      
      if (signature !== expectedSignature) {
        console.error('❌ Invalid webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }
    
    const { tx_ref, status, payment_status } = body
    
    if ((status === 'success' || payment_status === 'success') && tx_ref) {
      console.log(`✅ Payment successful for tx_ref: ${tx_ref}`)
      
      // Get the purchase from database
      // const purchase = await getPurchaseByTxRef(tx_ref)
      
      // Update purchase status
      // await updatePurchaseStatus(tx_ref, 'completed')
      
      // Send email with download link
      // await sendDownloadLink(purchase.email, purchase.name)
      
      return NextResponse.json({ status: 'success' })
    }
    
    return NextResponse.json({ status: 'received' })
    
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}