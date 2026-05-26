import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl
  
  // Cache static assets for 1 year
  if (pathname.match(/\.(jpg|jpeg|png|webp|avif|ico|svg|woff2)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // Cache images from Next.js for 1 year
  if (pathname.startsWith('/_next/image')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // Cache static Next.js assets
  if (pathname.startsWith('/_next/static')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // Cache HTML pages for 1 hour with stale-while-revalidate
  if (pathname === '/' || pathname.startsWith('/blog') || pathname.startsWith('/projects')) {
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}