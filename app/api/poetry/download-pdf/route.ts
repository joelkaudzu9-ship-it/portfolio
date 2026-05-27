import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Path to your actual poetry PDF
    const pdfPath = path.join(process.cwd(), 'public', 'threads-of-becoming.pdf')
    
    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      console.error('PDF file not found at:', pdfPath)
      return NextResponse.json(
        { error: 'PDF file not found. Please contact support.' },
        { status: 404 }
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
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    )
  }
}