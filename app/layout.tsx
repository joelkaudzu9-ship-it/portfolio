import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'

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
    default: 'Joel George Kaudzu | Healthcare Systems Builder',
    template: '%s | Joel George Kaudzu'
  },
  description: 'Dental Surgery Student at KUHeS building healthcare technology for Africa. Creator of MoyoWanga — multilingual chronic disease support for low-resource environments.',
  keywords: 'healthcare, technology, Africa, innovation, digital health, Malawi, dental surgery, MoyoWanga',
  authors: [{ name: 'Joel George Kaudzu', url: 'https://joelkaudzu.netlify.app' }],
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
    url: 'https://joelkaudzu.netlify.app',
    siteName: 'Joel George Kaudzu',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://joelkaudzu.netlify.app/og-image.jpg',
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
    images: ['https://joelkaudzu.netlify.app/og-image.jpg'],
    creator: '@joelkaudzu',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://joelkaudzu.netlify.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with your actual code
  },
  category: 'technology',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans`}>
        <GoogleAnalytics />
        <ThemeProvider>
          <Navigation />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}