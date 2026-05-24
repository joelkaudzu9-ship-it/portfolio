import { supabaseAdmin } from '@/lib/supabase/server'
import BlogPostClient from './BlogPostClient'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
  
  let initialPost = null
  
  if (!error && data && data.length > 0) {
    initialPost = data[0]
  }
  
  return <BlogPostClient initialPost={initialPost} />
}