import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { ScrollReset } from '@/components/ScrollReset'
import { PageLoader } from '@/components/PageLoader'
import { Suspense } from 'react'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
})

const jetbrains = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
  fallback: ['monospace'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://joelkaudzu-portfolio.vercel.app'),
  title: {
    default: 'Joel George Kaudzu | Healthcare Systems Builder | MoyoWanga Creator',
    template: '%s | Joel George Kaudzu'
  },
  description: 'Dental Surgery Student at KUHeS building healthcare technology for Africa. Creator of MoyoWanga — multilingual chronic disease support for low-resource environments.',
  keywords: ['healthcare', 'technology', 'Africa', 'innovation', 'digital health', 'Malawi', 'dental surgery', 'MoyoWanga', 'healthtech'],
  authors: [{ name: 'Joel George Kaudzu' }],
  creator: 'Joel George Kaudzu',
  publisher: 'Joel George Kaudzu',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Joel George Kaudzu | Healthcare Systems Builder',
    description: 'Building scalable healthcare systems for Africa. Creator of MoyoWanga.',
    url: 'https://joelkaudzu-portfolio.vercel.app',
    siteName: 'Joel George Kaudzu',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Joel George Kaudzu - Healthcare Systems Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joel George Kaudzu | Healthcare Systems Builder',
    description: 'Building scalable healthcare systems for Africa.',
    creator: '@joelkaudzu',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: '/',
  },
  category: 'technology',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for CDNs */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}>
        <ThemeProvider>
          <ScrollReset />
          <Navigation />
          <main className="min-h-screen-dynamic pt-16">
            <Suspense fallback={<PageLoader />}>
              {children}
            </Suspense>
          </main>
          <Footer />
        </ThemeProvider>

        {/* Defer Google Analytics until after page load */}
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-SK1J9MS1TH"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SK1J9MS1TH', {
                page_path: window.location.pathname,
                send_page_view: false,
                transport_type: 'beacon'
              });
            `,
          }}
        />
      </body>
    </html>
  )
}