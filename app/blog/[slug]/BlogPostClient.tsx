'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PageLoader } from '@/components/PageLoader'
import { Calendar, User, ArrowLeft, Video, Play, Image as ImageIcon, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SocialShare from '@/components/SocialShare'

type MediaItem = {
  url: string
  type: 'image' | 'video' | 'youtube'
  videoId?: string
}

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
  media_gallery: MediaItem[]
  views?: number
}

export default function BlogPostClient({ initialPost }: { initialPost: Post | null }) {
  const [post, setPost] = useState<Post | null>(initialPost)
  const [loading, setLoading] = useState(!initialPost)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const params = useParams()
  const slug = params?.slug as string

  useEffect(() => {
    if (!initialPost && slug) {
      fetch(`/api/blog/slug/${slug}`)
        .then(res => res.json())
        .then(data => {
          setPost(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [slug, initialPost])

  const nextImage = () => {
    if (post?.media_gallery) {
      setGalleryIndex((prev) => (prev + 1) % post.media_gallery.length)
    }
  }

  const prevImage = () => {
    if (post?.media_gallery) {
      setGalleryIndex((prev) => (prev - 1 + post.media_gallery.length) % post.media_gallery.length)
    }
  }

  if (loading || !post) {
    return <PageLoader />
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-text-secondary hover:text-amber-500 mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Blog
        </Link>

        <div>
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-4">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> 
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">
                <User size={14} /> Joel George Kaudzu
              </span>
              <span className="flex items-center gap-1">
                <Eye size={14} /> {post.views || 0} views
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text-gold mb-4">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-text-secondary leading-relaxed border-l-4 border-amber-500 pl-4 italic">
                {post.excerpt}
              </p>
            )}
          </div>

          {post.video_id && (
            <div className="mb-8 rounded-2xl overflow-hidden aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${post.video_id}`}
                title={post.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {!post.video_id && post.featured_image && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {post.media_gallery && post.media_gallery.length > 0 && !post.video_id && (
            <div className="mb-8">
              <div className="relative">
                {post.media_gallery[galleryIndex].type === 'image' && (
                  <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img 
                      src={post.media_gallery[galleryIndex].url} 
                      alt={`Gallery ${galleryIndex + 1}`}
                      className="w-full h-auto max-h-[500px] object-contain"
                    />
                  </div>
                )}
                
                {post.media_gallery[galleryIndex].type === 'youtube' && (
                  <div className="rounded-2xl overflow-hidden aspect-video">
                    <iframe
                      src={post.media_gallery[galleryIndex].url}
                      title="YouTube video"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
                
                {post.media_gallery[galleryIndex].type === 'video' && (
                  <div className="rounded-2xl overflow-hidden bg-black">
                    <video controls className="w-full" preload="metadata">
                      <source src={post.media_gallery[galleryIndex].url} type="video/mp4" />
                    </video>
                  </div>
                )}
                
                {post.media_gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
              
              {post.media_gallery.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {post.media_gallery.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGalleryIndex(idx)}
                      className={`transition-all ${
                        idx === galleryIndex 
                          ? 'w-6 h-2 bg-amber-500 rounded-full' 
                          : 'w-2 h-2 bg-gray-600 rounded-full hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
            <SocialShare title={post.title} url={`/blog/${post.slug}`} />
          </div>
        </div>
      </div>
    </div>
  )
}