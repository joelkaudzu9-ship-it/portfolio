'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, Video } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

type Post = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  created_at: string
  image_url: string | null
  video_id: string | null
}

export default function BlogPostPage() {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const slug = params?.slug as string

  useEffect(() => {
    if (slug) {
      fetch(`/api/blog/${slug}`)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-accent-gold">Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-accent-gold hover:underline">← Back to Blog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-gold mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Blog
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 text-sm text-text-muted mb-4">
              <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><User size={14} /> Joel George Kaudzu</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text-gold mb-4">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-text-secondary leading-relaxed border-l-4 border-accent-gold pl-4 italic">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Featured Image */}
          {post.image_url && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img 
                src={post.image_url} 
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* YouTube Embed */}
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

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 gradient-text-gold">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3 text-text-primary">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2 text-text-primary">{children}</h3>,
                p: ({ children }) => <p className="text-text-secondary leading-relaxed mb-4">{children}</p>,
                a: ({ href, children }) => <a href={href} className="text-accent-gold hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-text-secondary">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-text-secondary">{children}</ol>,
                li: ({ children }) => <li className="text-text-secondary">{children}</li>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-accent-gold pl-4 italic my-4 text-text-secondary">{children}</blockquote>,
                code: ({ children }) => <code className="bg-surface px-1 py-0.5 rounded text-accent-gold text-sm">{children}</code>,
                pre: ({ children }) => <pre className="bg-surface p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                img: ({ src, alt }) => <img src={src} alt={alt} className="rounded-lg my-4 max-w-full h-auto" />,
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