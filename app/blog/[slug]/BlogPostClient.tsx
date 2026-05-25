'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, User, ArrowLeft, Share2, BookOpen, Eye, ChevronLeft, ChevronRight, X, Play, Image as ImageIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SocialShare from '@/components/SocialShare'

type MediaItem = {
  url: string
  type: 'image' | 'video' | 'youtube'
  videoId?: string
  thumbnail?: string
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
  views: number
}

interface BlogPostClientProps {
  initialPost: Post | null
  readingTime?: string
  allPosts?: any[]
}

export default function BlogPostClient({ initialPost, readingTime, allPosts = [] }: BlogPostClientProps) {
  const [post] = useState(initialPost)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Build unified gallery from all media sources (no redundancy)
  const getAllMedia = (): MediaItem[] => {
    const media: MediaItem[] = []
    
    // Add featured image if exists
    if (post?.featured_image) {
      media.push({ 
        url: post.featured_image, 
        type: post.featured_image_type as 'image' || 'image'
      })
    }
    
    // Add YouTube video if exists
    if (post?.video_id) {
      media.push({ 
        url: `https://www.youtube.com/embed/${post.video_id}`, 
        type: 'youtube',
        videoId: post.video_id,
        thumbnail: `https://img.youtube.com/vi/${post.video_id}/maxresdefault.jpg`
      })
    }
    
    // Add gallery items (avoid duplicates with featured image)
    if (post?.media_gallery && post.media_gallery.length > 0) {
      post.media_gallery.forEach(item => {
        // Skip if this URL is already the featured image
        if (item.url !== post.featured_image) {
          media.push(item)
        }
      })
    }
    
    return media
  }

  const allMedia = getAllMedia()
  const currentMedia = allMedia[currentIndex]

  // Increment view count
  useEffect(() => {
    if (post?.slug) {
      fetch(`/api/blog/${post.slug}/views`, { method: 'POST' }).catch(console.error)
    }
  }, [post?.slug])

  // Add IDs to headings for table of contents
  useEffect(() => {
    if (!post?.content) return
    
    const timeout = setTimeout(() => {
      const headings = document.querySelectorAll('.blog-content h2, .blog-content h3')
      headings.forEach((heading) => {
        const text = heading.textContent || ''
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        heading.id = id
      })
    }, 100)
    
    return () => clearTimeout(timeout)
  }, [post?.content])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % allMedia.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length)
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  if (!post) {
    return (
      <div className="min-h-screen py-20 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link href="/blog" className="text-accent-gold mt-4 inline-block">← Back to blog</Link>
      </div>
    )
  }

  const relatedPosts = allPosts.filter(p => p.id !== post.id).slice(0, 3)

  return (
    <div className="relative min-h-screen py-16">
      <div className="container-custom max-w-4xl">
        {/* Back button */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent-gold transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="blog-content"
        >
          {/* Header */}
          <div className="mb-6">
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
              {readingTime && (
                <span className="flex items-center gap-1">
                  <BookOpen size={14} /> {readingTime}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye size={14} /> {post.views || 0} views
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text-gold mb-4 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-lg sm:text-xl text-text-secondary leading-relaxed border-l-4 border-accent-gold pl-4 italic">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Decorative separator */}
          <div className="mb-8 w-20 h-0.5 bg-gradient-to-r from-accent-gold/50 to-transparent rounded-full" />

          {/* Main Carousel - Only shows if there's media */}
          {allMedia.length > 0 && (
            <div className="mb-10">
              <div className="relative group">
                {/* Main Display */}
                <div 
                  className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black cursor-pointer shadow-2xl"
                  onClick={() => openLightbox(currentIndex)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentMedia.type === 'image' && (
                        <img 
                          src={currentMedia.url} 
                          alt={`${post.title} - Image ${currentIndex + 1}`}
                          className="w-full h-auto max-h-[500px] object-contain"
                        />
                      )}
                      
                      {currentMedia.type === 'youtube' && (
                        <div className="relative aspect-video">
                          <iframe
                            src={currentMedia.url}
                            title={post.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                      
                      {currentMedia.type === 'video' && (
                        <video controls className="w-full max-h-[500px]" preload="metadata">
                          <source src={currentMedia.url} type="video/mp4" />
                          Your browser doesn't support video playback.
                        </video>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Play overlay for videos */}
                  {currentMedia.type !== 'image' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <Play size={32} className="text-white ml-1" />
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation Arrows */}
                  {allMedia.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft size={24} className="text-white" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight size={24} className="text-white" />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Thumbnail Navigation */}
                {allMedia.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
                    {allMedia.map((media, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`relative flex-shrink-0 transition-all ${
                          idx === currentIndex 
                            ? 'ring-2 ring-accent-gold scale-105' 
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="w-16 h-12 rounded-md overflow-hidden bg-gray-800">
                          {media.type === 'image' && (
                            <img 
                              src={media.url} 
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                          {media.type === 'youtube' && (
                            <div className="w-full h-full bg-red-600 flex items-center justify-center">
                              <Play size={16} className="text-white" />
                            </div>
                          )}
                          {media.type === 'video' && (
                            <div className="w-full h-full bg-purple-600 flex items-center justify-center">
                              <Play size={16} className="text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Counter */}
                {allMedia.length > 1 && (
                  <div className="text-center mt-3 text-sm text-text-muted">
                    {currentIndex + 1} / {allMedia.length}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 gradient-text-gold">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-3 text-text-primary scroll-mt-20">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-2 text-text-primary scroll-mt-20">{children}</h3>,
                p: ({ children }) => <p className="text-text-secondary leading-relaxed mb-4">{children}</p>,
                a: ({ href, children }) => (
                  <a href={href} className="text-accent-gold hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-text-secondary">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-text-secondary">{children}</ol>,
                li: ({ children }) => <li className="text-text-secondary">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-accent-gold pl-4 italic my-4 text-text-secondary">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-surface px-1.5 py-0.5 rounded text-accent-gold text-sm font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-surface p-4 rounded-lg overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
                img: ({ src, alt }) => (
                  <img 
                    src={src} 
                    alt={alt} 
                    className="rounded-lg my-4 max-w-full h-auto shadow-lg" 
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/800x400/1a1a1a/666?text=Image+Not+Found'
                    }}
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Share Section */}
          <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Share2 size={16} className="text-text-muted" />
              <span className="text-sm text-text-muted">Share this article</span>
            </div>
            <SocialShare title={post.title} url={`/blog/${post.slug}`} />
          </div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-xl font-bold text-text-primary mb-6">You might also like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group p-4 rounded-xl bg-surface/50 border border-border hover:border-accent-gold/30 transition-all"
                >
                  <h4 className="font-semibold text-text-primary group-hover:text-accent-gold transition-colors line-clamp-2 text-sm">
                    {relatedPost.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(relatedPost.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={10} />
                      {relatedPost.views || 0}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} className="text-white" />
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + allMedia.length) % allMedia.length); }}
              className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronLeft size={32} className="text-white" />
            </button>
            
            <div className="max-w-5xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
              {allMedia[lightboxIndex]?.type === 'image' && (
                <img 
                  src={allMedia[lightboxIndex].url} 
                  alt="Full size"
                  className="max-w-full max-h-[90vh] object-contain"
                />
              )}
              {allMedia[lightboxIndex]?.type === 'youtube' && (
                <div className="aspect-video w-full max-w-4xl">
                  <iframe
                    src={allMedia[lightboxIndex].url}
                    title="YouTube video"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}
              {allMedia[lightboxIndex]?.type === 'video' && (
                <video controls className="max-h-[90vh] w-auto" autoPlay>
                  <source src={allMedia[lightboxIndex].url} type="video/mp4" />
                </video>
              )}
            </div>
            
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % allMedia.length); }}
              className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronRight size={32} className="text-white" />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {lightboxIndex + 1} / {allMedia.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}