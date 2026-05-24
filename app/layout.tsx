import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

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
  description: 'Dental Surgery Student at KUHeS building healthcare technology for Africa. Creator of MoyoWanga — multilingual chronic disease support for low-resource environments. Explore my journey in digital health innovation.',
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
    title: 'Joel George Kaudzu | Healthcare Systems Builder | Building Healthcare Technology for Africa',
    description: 'Discover how I combine dental surgery with technology to build scalable healthcare systems. Creator of MoyoWanga — transforming chronic disease support in low-resource environments.',
    url: 'https://joelkaudzu-portfolio.vercel.app',
    siteName: 'Joel George Kaudzu',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://joelkaudzu-portfolio.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Joel George Kaudzu - Building Healthcare Technology for Africa | Read my story →',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joel George Kaudzu | Healthcare Systems Builder',
    description: 'Dental Surgery Student & Healthcare Tech Builder. Creator of MoyoWanga — multilingual chronic disease support for Africa.',
    images: ['https://joelkaudzu-portfolio.vercel.app/og-image.jpg'],
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
  verification: {
    google: 'your-google-site-verification', // Add your Google Search Console verification code
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
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
          <Navigation />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <GoogleAnalytics gaId="G-SK1J9MS1TH" />
      </body>
    </html>
  )
}