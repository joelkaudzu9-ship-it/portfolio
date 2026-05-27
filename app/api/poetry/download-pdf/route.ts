import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const pdfPath = path.join(process.cwd(), 'public', 'threads-of-becoming.pdf')
    
    if (!fs.existsSync(pdfPath)) {
      return new NextResponse(
        'PDF file not found. Please contact joelkaudzu9@gmail.com for assistance.',
        { status: 404, headers: { 'Content-Type': 'text/plain' } }
      )
    }
    
    const fileBuffer = fs.readFileSync(pdfPath)
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Threads_of_Becoming_Joel_Kaudzu.pdf"',
        'Content-Length': fileBuffer.length.toString()
      }
    })
    
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}