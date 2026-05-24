import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function getPost(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://joelkaudzu-portfolio.vercel.app'
  
  try {
    const res = await fetch(`${baseUrl}/api/blog/slug/${slug}`)
    if (!res.ok) return null
    const data = await res.json()
    if (Array.isArray(data)) return data.length > 0 ? data[0] : null
    return data
  } catch {
    return null
  }
}

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  
  let imageUrl = 'https://joelkaudzu-portfolio.vercel.app/og-image.jpg'
  
  if (post) {
    if (post.featured_image) imageUrl = post.featured_image
    else if (post.video_id) imageUrl = `https://img.youtube.com/vi/${post.video_id}/maxresdefault.jpg`
    else if (post.media_gallery?.[0]) imageUrl = post.media_gallery[0].url
  }
  
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex' }}>
        <img src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    ),
    size
  )
}