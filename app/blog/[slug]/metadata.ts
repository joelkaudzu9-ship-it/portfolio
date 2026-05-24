// app/blog/[slug]/metadata.ts
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Simple test - hardcode a result
  return {
    title: `Test Post: ${params.slug} | Joel George Kaudzu`,
    description: 'This is a test description for the blog post.',
    openGraph: {
      title: `Test Post: ${params.slug}`,
      description: 'This is a test description for the blog post.',
      url: `https://joelkaudzu-portfolio.vercel.app/blog/${params.slug}`,
    },
    alternates: {
      canonical: `https://joelkaudzu-portfolio.vercel.app/blog/${params.slug}`,
    },
  }
}