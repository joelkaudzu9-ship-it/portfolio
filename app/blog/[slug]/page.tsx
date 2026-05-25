import { supabaseAdmin } from '@/lib/supabase/server'
import BlogPostClient from './BlogPostClient'
import SimpleComments from '@/components/SimpleComments'

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

// Function to increment views
async function incrementViews(slug: string) {
  try {
    // First get current views
    const { data: current } = await supabaseAdmin
      .from('blog_posts')
      .select('views')
      .eq('slug', slug)
      .single()
    
    const newViews = (current?.views || 0) + 1
    
    // Update with new count
    await supabaseAdmin
      .from('blog_posts')
      .update({ views: newViews })
      .eq('slug', slug)
  } catch (error) {
    console.error('Error incrementing views:', error)
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const post = await getPost(slug)
  
  // Increment views when page is viewed
  if (post) {
    await incrementViews(slug)
  }
  
  return (
    <>
      <BlogPostClient initialPost={post} />
      {/* Comments Section */}
      {post && <SimpleComments postSlug={post.slug} />}
    </>
  )
}

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