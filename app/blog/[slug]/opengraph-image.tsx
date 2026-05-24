import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }

export default async function Image({ params }: { params: { slug: string } }) {
  // Hardcode a test image from one of your posts to verify it works
  // Use the Cloudinary image from your post
  const testImageUrl = 'https://res.cloudinary.com/dfth3jtai/image/upload/v1779628475/portfolio/blog/jrtux8pv4ipvqg1qjekl.jpg'
  
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex' }}>
        <img 
          src={testImageUrl} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    ),
    size
  )
}