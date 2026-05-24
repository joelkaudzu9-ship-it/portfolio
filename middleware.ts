// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  
  // List of social media crawlers
  const crawlers = [
    'facebookexternalhit',
    'Twitterbot',
    'LinkedInBot',
    'Slackbot',
    'Discordbot',
    'WhatsApp',
    'TelegramBot',
    'Googlebot',
    'Bingbot'
  ]
  
  const isCrawler = crawlers.some(crawler => userAgent.includes(crawler))
  
  // Allow crawlers to bypass any authentication
  if (isCrawler) {
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'index, follow')
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}