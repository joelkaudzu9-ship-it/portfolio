import { supabaseAdmin } from '@/lib/supabase/server'
import BlogPostClient from './BlogPostClient'
import SimpleComments from '@/components/SimpleComments'
import { getReadingTime } from '@/lib/readingTime'

type Post = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  created_at: string
  featured_image: string | null
  featured_image_type: string | null
  video_id: string | null
  media_gallery: any[]
  views: number
  published: boolean
}

async function getPost(slug: string): Promise<Post | null> {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  
  if (error || !data) return null
  return data
}

async function getAllPosts() {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, slug, created_at, views')
    .eq('published', true)
    .order('created_at', { ascending: false })
  
  if (error) return []
  return data || []
}

// Increment view count
async function incrementViewCount(slug: string) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'}/api/blog/${slug}/views`, {
      method: 'POST',
    })
  } catch (error) {
    console.error('Failed to increment view count:', error)
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://joelkaudzu-portfolio.vercel.app'
  const imageUrl = post.featured_image || `${baseUrl}/og-image.jpg`
  const postUrl = `${baseUrl}/blog/${post.slug}`
  
  return {
    title: post.title,
    description: post.excerpt || `Read "${post.title}" on Joel Kaudzu's blog - insights on healthcare, technology, and African innovation.`,
    authors: [{ name: 'Joel George Kaudzu' }],
    keywords: ['healthcare', 'technology', 'africa', 'innovation', 'digital health', 'blog'],
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read "${post.title}" on Joel Kaudzu's blog.`,
      url: postUrl,
      siteName: 'Joel Kaudzu - Portfolio',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.created_at,
      authors: ['Joel George Kaudzu'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || `Read "${post.title}" on Joel Kaudzu's blog.`,
      images: [imageUrl],
      creator: '@joelkaudzu',
      site: '@joelkaudzu',
    },
    alternates: {
      canonical: postUrl,
    },
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
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const post = await getPost(slug)
  const allPosts = await getAllPosts()
  
  // Increment view count asynchronously
  if (post) {
    incrementViewCount(slug)
  }
  
  if (!post) {
    return (
      <div className="min-h-screen py-20 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <a href="/blog" className="text-amber-500 mt-4 inline-block hover:underline">
          ← Back to blog
        </a>
      </div>
    )
  }

  return (
    <>
      <BlogPostClient 
        initialPost={post} 
        readingTime={getReadingTime(post.content)}
        allPosts={allPosts}
      />
      <SimpleComments postSlug={post.slug} />
    </>
  )
}