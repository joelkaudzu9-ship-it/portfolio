import BlogPostClient from './BlogPostClient'

async function getPost(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://joelkaudzu-portfolio.vercel.app'
  const res = await fetch(`${baseUrl}/api/blog/slug/${slug}`, { cache: 'no-store' })
  return res.json()
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  return <BlogPostClient initialPost={post} />
}