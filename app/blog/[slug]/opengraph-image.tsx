import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/slug/${params.slug}`).then(res => res.json())
  
  const imageUrl = post.featured_image || 
                   (post.video_id ? `https://img.youtube.com/vi/${post.video_id}/maxresdefault.jpg` : null) ||
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