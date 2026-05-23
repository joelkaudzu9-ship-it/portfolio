'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, Video, Image as ImageIcon, Play } from 'lucide-react'

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
  published: boolean
  created_at: string
  featured_image: string | null
  featured_image_type: string | null
  video_id: string | null
  media_gallery: MediaItem[]
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        const publishedPosts = data.filter((p: Post) => p.published)
        setPosts(publishedPosts)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching posts:', err)
        setLoading(false)
      })
  }, [])

  const getSortedPosts = () => {
    return [...posts].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })
  }

  const getFeaturedImage = (post: Post) => {
    if (post.featured_image) return post.featured_image
    if (post.video_id) return `https://img.youtube.com/vi/${post.video_id}/maxresdefault.jpg`
    if (post.media_gallery?.[0]) return post.media_gallery[0].url
    return null
  }

  const getMediaType = (post: Post) => {
    if (post.video_id) return 'youtube'
    if (post.featured_image_type) return post.featured_image_type
    if (post.media_gallery?.[0]) return post.media_gallery[0].type
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-500">Loading...</div>
      </div>
    )
  }

  const sortedPosts = getSortedPosts()

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-amber-500 text-sm font-semibold tracking-wide uppercase">Insights</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-2">
            My <span className="gradient-text-gold">Blog</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto mt-4">
            Thoughts on healthcare, technology, innovation, and African systems
          </p>
          
          {/* Sort Controls */}
          <div className="flex justify-end mt-6">
            <div className="flex gap-2 text-sm">
              <button
                onClick={() => setSortOrder('newest')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  sortOrder === 'newest' 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-surface border border-border hover:border-amber-500/30'
                }`}
              >
                Newest First
              </button>
              <button
                onClick={() => setSortOrder('oldest')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  sortOrder === 'oldest' 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-surface border border-border hover:border-amber-500/30'
                }`}
              >
                Oldest First
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sortedPosts.map((post, index) => {
            const featuredImage = getFeaturedImage(post)
            const mediaType = getMediaType(post)
            
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card-hover overflow-hidden relative group"
              >
                <Link href={`/blog/${post.slug}`}>
                  {/* Featured Image / Thumbnail */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-amber-500/20 to-amber-500/5">
                    {featuredImage ? (
                      <>
                        <img 
                          src={featuredImage} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={48} className="text-text-muted" />
                      </div>
                    )}
                    
                    {/* Media Type Badge */}
                    {mediaType === 'youtube' && (
                      <div className="absolute top-4 right-4 bg-red-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm z-10">
                        <Play size={14} /> YouTube
                      </div>
                    )}
                    {mediaType === 'video' && (
                      <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm z-10">
                        <Video size={14} /> Video
                      </div>
                    )}
                    
                    {/* Play button overlay for YouTube/video */}
                    {(mediaType === 'youtube' || mediaType === 'video') && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                          <Play size={28} className="text-black ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    {/* Date and Author */}
                    <div className="flex items-center gap-4 text-sm text-text-muted mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> 
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={14} /> Joel Kaudzu
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-xl font-bold mb-3 group-hover:text-amber-500 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    
                    {/* Excerpt */}
                    <p className="text-text-secondary line-clamp-3 leading-relaxed">
                      {post.excerpt || (post.content ? post.content.substring(0, 150).replace(/[#*`]/g, '') + '...' : '')}
                    </p>
                    
                    {/* Read More */}
                    <div className="mt-4 text-amber-500 font-medium group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                      Read more <span>→</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            )
          })}
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