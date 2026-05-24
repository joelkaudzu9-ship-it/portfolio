import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }

export default async function Image({ params }: { params: { slug: string } }) {
  const response = await fetch(`https://joelkaudzu-portfolio.vercel.app/api/blog/public/${params.slug}`)
  const data = await response.json()
  
  // Handle both array and object responses
  const post = Array.isArray(data) ? data[0] : data
  
  if (!post) {
    return new ImageResponse(
      <div style={{ width: '100%', height: '100%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontSize: 32 }}>
        Post Not Found
      </div>,
      size
    )
  }
  
  const imageUrl = post.featured_image || 
                   (post.video_id ? `https://img.youtube.com/vi/${post.video_id}/maxresdefault.jpg` : null) ||
                   post.media_gallery?.[0]?.url ||
                   'https://joelkaudzu-portfolio.vercel.app/og-image.jpg'

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex' }}>
        <img src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    ),
    size
  )
}