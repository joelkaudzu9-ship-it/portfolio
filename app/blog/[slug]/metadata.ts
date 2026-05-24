import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://joelkaudzu-portfolio.vercel.app'
  
  const res = await fetch(`${baseUrl}/api/blog/slug/${slug}`)
  const data = await res.json()
  
  const post = Array.isArray(data) ? data[0] : data
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.'
    }
  }
  
  const postUrl = `${baseUrl}/blog/${post.slug}`
  const imageUrl = post.featured_image || `${baseUrl}/og-image.jpg`
  
  return {
    title: `${post.title} | Joel George Kaudzu`,
    description: post.excerpt || `Read ${post.title} on Joel George Kaudzu's blog.`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read ${post.title} on Joel George Kaudzu's blog.`,
      url: postUrl,
      images: [imageUrl],
    },
    alternates: {
      canonical: postUrl,
    },
  }
}