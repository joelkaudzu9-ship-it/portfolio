'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, Video, Play, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
}

export default function BlogPostPage() {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const params = useParams()
  const slug = params?.slug as string

  useEffect(() => {
    if (slug) {
      fetch(`/api/blog/slug/${slug}`)
        .then(res => res.json())
        .then(data => {
          setPost(data)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    }
  }, [slug])

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-500">Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-amber-500 hover:underline">← Back to Blog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-text-secondary hover:text-amber-500 mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Blog
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 text-sm text-text-muted mb-4">
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

          {/* Featured Media (YouTube/Video/Image) */}
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

          {/* Media Gallery (if multiple images) */}
          {post.media_gallery && post.media_gallery.length > 0 && !post.video_id && (
            <div className="mb-8">
              {post.media_gallery[0].type === 'image' && (
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden">
                    <img 
                      src={post.media_gallery[galleryIndex].url} 
                      alt={`Gallery ${galleryIndex + 1}`}
                      className="w-full h-auto"
                    />
                  </div>
                  
                  {post.media_gallery.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight size={24} />
                      </button>
                      <div className="flex justify-center gap-2 mt-4">
                        {post.media_gallery.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setGalleryIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              idx === galleryIndex ? 'bg-amber-500' : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {post.media_gallery[0].type === 'youtube' && (
                <div className="rounded-2xl overflow-hidden aspect-video">
                  <iframe
                    src={post.media_gallery[0].url}
                    title="YouTube video"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}
              
              {post.media_gallery[0].type === 'video' && (
                <div className="rounded-2xl overflow-hidden">
                  <video controls src={post.media_gallery[0].url} className="w-full rounded-lg" />
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 gradient-text-gold">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3 text-text-primary">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2 text-text-primary">{children}</h3>,
                p: ({ children }) => <p className="text-text-secondary leading-relaxed mb-4">{children}</p>,
                a: ({ href, children }) => <a href={href} className="text-amber-500 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-text-secondary">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-text-secondary">{children}</ol>,
                li: ({ children }) => <li className="text-text-secondary">{children}</li>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-amber-500 pl-4 italic my-4 text-text-secondary">{children}</blockquote>,
                code: ({ children }) => <code className="bg-surface px-1 py-0.5 rounded text-amber-500 text-sm">{children}</code>,
                pre: ({ children }) => <pre className="bg-surface p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                img: ({ src, alt }) => <img src={src} alt={alt} className="rounded-lg my-4 max-w-full h-auto shadow-lg" />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </motion.article>
      </div>
    </div>
  )
}