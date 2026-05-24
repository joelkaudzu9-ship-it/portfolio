import { ImageResponse } from 'next/og'
import { supabaseAdmin } from '@/lib/supabase/server'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
  
  let imageUrl = 'https://joelkaudzu-portfolio.vercel.app/og-image.jpg'
  
  if (!error && data && data.length > 0) {
    const post = data[0]
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