'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, Share2, BookOpen, Eye } from 'lucide-react'
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
  views: number
}

interface BlogPostClientProps {
  initialPost: Post | null
  readingTime?: string
  allPosts?: any[]
}

export default function BlogPostClient({ initialPost, readingTime, allPosts = [] }: BlogPostClientProps) {
  const [post] = useState(initialPost)
  const [showShare, setShowShare] = useState(false)

  // Increment view count
  useEffect(() => {
    if (post?.slug) {
      fetch(`/api/blog/${post.slug}/views`, { method: 'POST' }).catch(console.error)
    }
  }, [post?.slug])

  // Add IDs to headings for table of contents
  useEffect(() => {
    if (!post?.content) return
    
    // Small delay to ensure DOM is ready
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

  if (!post) {
    return (
      <div className="min-h-screen py-20 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link href="/blog" className="text-accent-gold mt-4 inline-block">← Back to blog</Link>
      </div>
    )
  }

  // Get related posts (exclude current, take first 3)
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id)
    .slice(0, 3)

  return (
    <div className="relative min-h-screen py-16">
      <div className="container-custom max-w-3xl">
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

          {/* Featured Media */}
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
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/1200x600/1a1a1a/666?text=Image+Not+Found'
                }}
              />
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
    </div>
  )
}