// app/blog/[slug]/metadata.ts
import { Metadata } from 'next'

async function getPost(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/slug/${slug}`, {
    cache: 'force-cache'
  })
  return res.json()
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }
  
  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      type: 'article',
      publishedTime: post.created_at,
      authors: ['Joel George Kaudzu'],
      images: post.featured_image ? [{
        url: post.featured_image,
        width: 1200,
        height: 630,
        alt: post.title,
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: post.featured_image ? [post.featured_image] : [],
    },
  }
}