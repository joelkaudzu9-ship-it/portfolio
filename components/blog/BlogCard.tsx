'use client'

import Link from 'next/link'
import { Calendar, User, Video, Play, ImageIcon, Eye } from 'lucide-react'

type Post = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  created_at: string
  featured_image: string | null
  featured_image_type: string | null
  video_id: string | null
  media_gallery: any[]
  views?: number  // Add optional views field
}

interface BlogCardProps {
  post: Post
}

export default function BlogCard({ post }: BlogCardProps) {
  const getFeaturedImage = () => {
    if (post.featured_image) return post.featured_image
    if (post.video_id) return `https://img.youtube.com/vi/${post.video_id}/maxresdefault.jpg`
    if (post.media_gallery?.[0]) return post.media_gallery[0].url
    return null
  }

  const getMediaType = () => {
    if (post.video_id) return 'youtube'
    if (post.featured_image_type) return post.featured_image_type
    if (post.media_gallery?.[0]) return post.media_gallery[0].type
    return null
  }

  const displayImage = getFeaturedImage()
  const mediaType = getMediaType()

  return (
    <article className="glass-card-hover overflow-hidden relative group">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-amber-500/20 to-amber-500/5">
          {displayImage ? (
            <>
              <img 
                src={displayImage} 
                alt={post.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const parent = e.currentTarget.parentElement
                  if (parent) {
                    const fallback = document.createElement('div')
                    fallback.className = 'w-full h-full flex items-center justify-center'
                    fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-text-muted"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"></path></svg>'
                    parent.appendChild(fallback)
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={48} className="text-text-muted" />
            </div>
          )}
          
          {mediaType === 'youtube' && (
            <div className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs z-10">
              <Play size={12} /> YouTube
            </div>
          )}
          {mediaType === 'video' && (
            <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs z-10">
              <Video size={12} /> Video
            </div>
          )}
          
          {(mediaType === 'youtube' || mediaType === 'video') && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                <Play size={20} className="text-black ml-0.5" />
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-3 text-xs text-text-muted mb-2">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> 
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={12} /> {post.views || 0} views
            </span>
          </div>
          
          <h2 className="text-lg font-bold mb-2 group-hover:text-amber-500 transition-colors line-clamp-2">
            {post.title}
          </h2>
          
          <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed">
            {post.excerpt || (post.content ? post.content.substring(0, 100).replace(/[#*`]/g, '') + '...' : '')}
          </p>
          
          <div className="mt-3 text-amber-500 font-medium text-sm group-hover:gap-2 inline-flex items-center gap-1 transition-all">
            Read more <span>→</span>
          </div>
        </div>
      </Link>
    </article>
  )
}