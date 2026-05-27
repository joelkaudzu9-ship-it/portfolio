import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Path to your PDF file in public folder
    const pdfPath = path.join(process.cwd(), 'public', 'threads-of-becoming.pdf')
    
    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      // Return a temporary response with content
      return new NextResponse(
        `Threads of Becoming - Poetry Collection by Joel George Kaudzu
        
This is a placeholder. Please upload your actual poetry collection PDF to the public folder.

Collection includes:
- 13 original poems
- Broken and Becoming section
- Light Through the Storm section
- Infinite Thoughts section
- Society and Reality Check section

Contact: joelkaudzu9@gmail.com for the actual PDF.`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/plain',
            'Content-Disposition': 'attachment; filename="Threads_of_Becoming_Joel_Kaudzu.txt"',
          },
        }
      )
    }
    
    const fileBuffer = fs.readFileSync(pdfPath)
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Threads_of_Becoming_Joel_Kaudzu.pdf"',
      },
    })
    
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}