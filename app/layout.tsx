import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
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
  title: 'Joel George Kaudzu | Healthcare Systems Builder & Innovator',
  description: 'Dental Surgery Student at KUHeS | Building MoyoWanga - Multilingual Chronic Disease Support Ecosystem | African Healthcare Innovation',
  keywords: 'healthcare technology, digital health, African innovation, dental surgery, MoyoWanga, Malawi, healthcare systems',
  authors: [{ name: 'Joel George Kaudzu' }],
  openGraph: {
    title: 'Joel George Kaudzu | Healthcare Systems Builder',
    description: 'Building scalable healthcare systems for Africa. Creator of MoyoWanga - multilingual chronic disease support.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans`}>
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