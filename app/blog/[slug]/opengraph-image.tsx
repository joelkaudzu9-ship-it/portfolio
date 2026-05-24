import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function getPost(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/slug/${slug}`)
  return res.json()
}

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  
  // Get the featured image URL from your post
  let featuredImage = post.featured_image
  if (!featuredImage && post.video_id) {
    featuredImage = `https://img.youtube.com/vi/${post.video_id}/maxresdefault.jpg`
  }
  if (!featuredImage && post.media_gallery?.[0]) {
    featuredImage = post.media_gallery[0].url
  }
  
  return new ImageResponse(
    (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
      }}>
        {/* Featured Image */}
        {featuredImage ? (
          <img 
            src={featuredImage} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            color: '#f59e0b',
            fontWeight: 'bold',
          }}>
            {post.title}
          </div>
        )}
        
        {/* Overlay gradient for text readability */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
        }} />
        
        {/* Title overlay */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          right: 40,
          fontSize: 42,
          fontWeight: 'bold',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        }}>
          {post.title}
        </div>
      </div>
    ),
    size
  )
}