import { Metadata } from 'next'

async function getPost(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://joelkaudzu-portfolio.vercel.app'
  
  try {
    const res = await fetch(`${baseUrl}/api/blog/slug/${slug}`, {
      cache: 'force-cache'
    })
    
    if (!res.ok) return null
    
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found | Joel George Kaudzu',
      description: 'The requested blog post could not be found.',
    }
  }
  
  // Get featured image URL
  let imageUrl = post.featured_image
  
  if (!imageUrl && post.video_id) {
    imageUrl = `https://img.youtube.com/vi/${post.video_id}/maxresdefault.jpg`
  }
  
  if (!imageUrl && post.media_gallery?.[0]) {
    imageUrl = post.media_gallery[0].url
  }
  
  // Clean title (max 60 chars)
  let title = post.title
  if (title.length > 57) {
    title = title.substring(0, 54) + '...'
  }
  
  // Clean description (110-160 chars)
  let description = post.excerpt || post.content.substring(0, 200).replace(/[#*`]/g, ' ').replace(/\s+/g, ' ').trim()
  if (description.length > 157) {
    description = description.substring(0, 154) + '...'
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://joelkaudzu-portfolio.vercel.app'
  const postUrl = `${siteUrl}/blog/${post.slug}`
  
  return {
    title: `${title} | Joel George Kaudzu`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: postUrl,
      siteName: 'Joel George Kaudzu',
      type: 'article',
      publishedTime: post.created_at,
      authors: ['Joel George Kaudzu'],
      images: imageUrl ? [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: post.title,
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: imageUrl ? [imageUrl] : [],
      creator: '@joelkaudzu',
    },
    alternates: {
      canonical: postUrl,
    },
  }
}