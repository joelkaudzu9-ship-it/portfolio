import { supabaseAdmin } from '@/lib/supabase/server'
import BlogPostClient from './BlogPostClient'

async function getPost(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
  
  if (error || !data || data.length === 0) {
    return null
  }
  
  return data[0]
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const post = await getPost(slug)
  
  return <BlogPostClient initialPost={post} />
}

// Metadata generation directly in the page component
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }
  
  const baseUrl = 'https://joelkaudzu-portfolio.vercel.app'
  const imageUrl = post.featured_image || `${baseUrl}/og-image.jpg`
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
  }
}