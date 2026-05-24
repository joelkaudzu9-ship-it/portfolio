import { Metadata } from 'next'

// Don't fetch from API - fetch directly from database or use static params
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  
  // Option 1: If you have direct database access
  // const post = await db.post.findUnique({ where: { slug } })
  
  // Option 2: For now, hardcode a test to verify it works
  // Once verified, you can implement the actual fetch
  
  return {
    title: `Blog Post: ${slug} | Joel George Kaudzu`,
    description: `Read this blog post about healthcare technology and innovation in Africa.`,
    openGraph: {
      title: `Blog Post: ${slug}`,
      description: `Read this blog post about healthcare technology and innovation in Africa.`,
      images: ['https://joelkaudzu-portfolio.vercel.app/og-image.jpg'],
    },
  }
}