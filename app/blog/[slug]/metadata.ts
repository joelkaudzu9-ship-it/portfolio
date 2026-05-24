import { Metadata } from 'next'

async function getPost(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://joelkaudzu-portfolio.vercel.app'
  
  try {
    const res = await fetch(`${baseUrl}/api/blog/slug/${slug}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) return null
    
    const data = await res.json()
    
    // Handle array response from API
    if (Array.isArray(data)) {
      return data[0] || null
    }
    
    return data
  } catch (error) {
    console.error('Metadata fetch error:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  // If no post found, return default metadata for 404
  if (!post) {
    return {
      title: 'Post Not Found | Joel George Kaudzu',
      description: 'The requested blog post could not be found.',
      openGraph: {
        title: 'Post Not Found',
        description: 'The requested blog post could not be found.',
        url: `https://joelkaudzu-portfolio.vercel.app/blog/${params.slug}`,
      },
    }
  }
  
  // Get featured image URL
  let imageUrl = post.featured_image
  
  if (!imageUrl && post.video_id) {
    imageUrl = `https://img.youtube.com/vi/${post.video_id}/maxresdefault.jpg`
  }
  
  if (!imageUrl && post.media_gallery && post.media_gallery.length > 0) {
    imageUrl = post.media_gallery[0].url
  }
  
  // Clean title (max 60 chars)
  let title = post.title
  if (title && title.length > 57) {
    title = title.substring(0, 54) + '...'
  }
  
  // Clean description (110-160 chars)
  let description = post.excerpt || (post.content ? post.content.substring(0, 200).replace(/[#*`]/g, ' ').replace(/\s+/g, ' ').trim() : '')
  if (description && description.length > 157) {
    description = description.substring(0, 154) + '...'
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://joelkaudzu-portfolio.vercel.app'
  const postUrl = `${siteUrl}/blog/${post.slug}`
  const defaultImage = `${siteUrl}/og-image.jpg`
  
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
      }] : [{
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: 'Joel George Kaudzu',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: imageUrl ? [imageUrl] : [defaultImage],
      creator: '@joelkaudzu',
    },
    alternates: {
      canonical: postUrl,
    },
  }
}