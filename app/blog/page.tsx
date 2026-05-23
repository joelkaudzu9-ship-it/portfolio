'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, Youtube } from 'lucide-react'

type Post = {
  id: number
  title: string
  slug: string
  excerpt: string
  published: boolean
  created_at: string
  image_url: string | null
  video_id: string | null
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        setPosts(data.filter((p: Post) => p.published))
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-accent-gold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-accent-gold text-sm font-semibold tracking-wide uppercase">Insights</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-2">
            My <span className="gradient-text-gold">Blog</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto mt-4">
            Thoughts on healthcare, technology, innovation, and African systems
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card-hover overflow-hidden"
            >
              <Link href={`/blog/${post.slug}`}>
                {/* Featured Image */}
                {post.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                
                {/* Video Badge */}
                {post.video_id && (
                  <div className="absolute top-4 right-4 bg-accent-gold/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                    <Youtube size={14} /> Video
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-text-muted mb-3">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><User size={14} /> Joel Kaudzu</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 group-hover:text-accent-gold transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-text-secondary line-clamp-3">{post.excerpt}</p>
                  <div className="mt-4 text-accent-gold font-medium group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                    Read more <span>→</span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-text-secondary">No posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}