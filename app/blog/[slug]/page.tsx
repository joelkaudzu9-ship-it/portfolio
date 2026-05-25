import { supabaseAdmin } from '@/lib/supabase/server'
import BlogPostClient from './BlogPostClient'
import SimpleComments from '@/components/SimpleComments'
import { getReadingTime } from '@/lib/readingTime'

async function getPost(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
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

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const post = await getPost(slug)
  const allPosts = await getAllPosts()
  
  if (!post) {
    return (
      <div className="min-h-screen py-20 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <a href="/blog" className="text-accent-gold mt-4 inline-block">← Back to blog</a>
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