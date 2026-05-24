import BlogPostClient from './BlogPostClient'

async function getPost(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://joelkaudzu-portfolio.vercel.app'
  
  try {
    const res = await fetch(`${baseUrl}/api/blog/slug/${slug}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) return null
    
    const data = await res.json()
    
    // Handle both array and object responses
    if (Array.isArray(data)) {
      return data.length > 0 ? data[0] : null
    }
    
    return data
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Make sure to await params in Next.js 15+
  const { slug } = await params
  
  const post = await getPost(slug)
  
  return <BlogPostClient initialPost={post} />
}