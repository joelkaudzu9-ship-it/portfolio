export async function generateMetadata({ params }: { params: { slug: string } }) {
  const baseUrl = 'https://joelkaudzu-portfolio.vercel.app'
  const res = await fetch(`${baseUrl}/api/blog/slug/${params.slug}`)
  const data = await res.json()
  const post = Array.isArray(data) ? data[0] : data
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }
  
  return {
    title: post.title,
    openGraph: {
      title: post.title,
      url: `${baseUrl}/blog/${post.slug}`,
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
  }
}