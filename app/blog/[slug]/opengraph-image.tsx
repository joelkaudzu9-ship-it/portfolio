import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = await params
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://joelkaudzu-portfolio.vercel.app'
  
  try {
    const res = await fetch(`${baseUrl}/api/blog/slug/${slug}`)
    const post = await res.json()
    
    let imageUrl = post.featured_image
    
    if (!imageUrl && post.video_id) {
      imageUrl = `https://img.youtube.com/vi/${post.video_id}/maxresdefault.jpg`
    }
    
    if (!imageUrl && post.media_gallery?.[0]) {
      imageUrl = post.media_gallery[0].url
    }
    
    if (!imageUrl) {
      imageUrl = `${baseUrl}/og-image.jpg`
    }
    
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
          <img
            src={imageUrl}
            alt={post.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      ),
      size
    )
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#1a1a1a',
            fontSize: 48,
            fontWeight: 'bold',
            color: '#f59e0b',
          }}
        >
          Joel Kaudzu
        </div>
      ),
      size
    )
  }
}