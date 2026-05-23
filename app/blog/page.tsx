'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User } from 'lucide-react'

type Post = {
  id: number
  title: string
  slug: string
  excerpt: string
  published: boolean
  created_at: string
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            My <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden card-hover"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 hover:text-teal-500 transition-colors">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><User size={14} /> Joel Kaudzu</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{post.excerpt}</p>
                  <div className="mt-4 text-teal-500 font-medium">Read more →</div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-gray-500 py-12">No posts yet. Check back soon!</p>
        )}
      </div>
    </div>
  )
}