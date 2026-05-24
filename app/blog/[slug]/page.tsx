import { supabaseAdmin } from '@/lib/supabase/server'
import BlogPostClient from './BlogPostClient'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Query without any filters first
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
  
  let initialPost = null
  
  if (!error && data && data.length > 0) {
    initialPost = data[0]
  }
  
  // If no post found, try all posts to debug
  if (!initialPost) {
    const { data: allPosts } = await supabaseAdmin
      .from('blog_posts')
      .select('slug, title')
      .limit(5)
    
    console.log('Available slugs:', allPosts)
  }
  
  return <BlogPostClient initialPost={initialPost} />
}