// app/blog/[slug]/metadata.ts
import { Metadata } from 'next'

async function getPost(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://joelkaudzu-portfolio.vercel.app'
  
  try {
    const res = await fetch(`${baseUrl}/api/blog/slug/${slug}`, {
      cache: 'force-cache'
    })
    
    if (!res.ok) {
      return null
    }
    
    return res.json()
  } catch (error) {
    console.error('Failed to fetch post for metadata:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }
  
  // Get featured image URL (prioritize: video thumbnail > featured_image > media_gallery > default)
  let featuredImageUrl = ''
  
  if (post.video_id) {
    // YouTube thumbnail
    featuredImageUrl = `https://img.youtube.com/vi/${post.video_id}/maxresdefault.jpg`
  } else if (post.featured_image) {
    featuredImageUrl = post.featured_image
  } else if (post.media_gallery && post.media_gallery.length > 0) {
    const firstMedia = post.media_gallery[0]
    if (firstMedia.type === 'image') {
      featuredImageUrl = firstMedia.url
    } else if (firstMedia.type === 'youtube' && firstMedia.videoId) {
      featuredImageUrl = `https://img.youtube.com/vi/${firstMedia.videoId}/maxresdefault.jpg`
    }
  }
  
  // If no image found, use default OG image
  if (!featuredImageUrl) {
    featuredImageUrl = 'https://joelkaudzu-portfolio.vercel.app/og-image.jpg'
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://joelkaudzu-portfolio.vercel.app'
  const postUrl = `${siteUrl}/blog/${post.slug}`
  
  return {
    title: `${post.title} | Joel George Kaudzu`,
    description: post.excerpt || post.content.substring(0, 160).replace(/[#*`]/g, ''),
    keywords: [...(post.tags || []), 'healthcare', 'technology', 'Africa', 'digital health'],
    authors: [{ name: 'Joel George Kaudzu' }],
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160).replace(/[#*`]/g, ''),
      url: postUrl,
      siteName: 'Joel George Kaudzu',
      type: 'article',
      publishedTime: post.created_at,
      authors: ['Joel George Kaudzu'],
      images: [
        {
          url: featuredImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160).replace(/[#*`]/g, ''),
      images: [featuredImageUrl],
      creator: '@joelkaudzu',
    },
  }
}