import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { ScrollReset } from '@/components/ScrollReset'
import { PageLoader } from '@/components/PageLoader'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrains = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: {
    default: 'Joel George Kaudzu | Healthcare Systems Builder | MoyoWanga Creator',
    template: '%s | Joel George Kaudzu'
  },
  description: 'Dental Surgery Student at KUHeS building healthcare technology for Africa. Creator of MoyoWanga — multilingual chronic disease support for low-resource environments.',
  keywords: ['healthcare', 'technology', 'Africa', 'innovation', 'digital health', 'Malawi', 'dental surgery', 'MoyoWanga', 'healthtech', 'telemedicine', 'AI healthcare'],
  authors: [{ name: 'Joel George Kaudzu', url: 'https://joelkaudzu-portfolio.vercel.app' }],
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
    description: 'Building scalable healthcare systems for Africa. Creator of MoyoWanga — multilingual chronic disease support.',
    url: 'https://joelkaudzu-portfolio.vercel.app',
    siteName: 'Joel George Kaudzu',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://joelkaudzu-portfolio.vercel.app/og-image.jpg',
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
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://joelkaudzu-portfolio.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
        <GoogleAnalytics gaId="G-SK1J9MS1TH" />
      </body>
    </html>
  )
}