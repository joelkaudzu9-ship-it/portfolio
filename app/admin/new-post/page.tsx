'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Image as ImageIcon, X, Video } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function NewPost() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [featuredImage, setFeaturedImage] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [youtubeId, setYoutubeId] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const generateSlug = () => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setSlug(generated)
  }

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url)
    const id = extractYouTubeId(url)
    setYoutubeId(id || '')
  }

  const uploadImage = async (file: File) => {
    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `posts/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      alert('Failed to upload image')
      setUploading(false)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath)

    setUploading(false)
    return publicUrl
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    const url = await uploadImage(file)
    if (url) {
      setFeaturedImage(url)
      const imageMarkdown = `\n\n![${title}](${url})\n\n`
      setContent(prev => prev + imageMarkdown)
    }
  }

  const insertImageMarkdown = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const postData = {
      title,
      slug,
      excerpt,
      content,
      published,
      image_url: featuredImage,
      video_id: youtubeId,
    }
    
    const res = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    })
    
    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      alert('Failed to create post')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container-custom">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-accent-gold mb-6 hover:gap-3 transition-all">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 gradient-text-gold">New Blog Post</h1>
        
        <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={generateSlug}
              className="w-full px-4 py-3 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary text-lg"
              placeholder="Post title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Slug (URL)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary font-mono text-sm"
              placeholder="post-url-slug"
              required
            />
            <p className="text-xs text-text-muted mt-1">URL: /blog/{slug || '...'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Featured Image</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={insertImageMarkdown}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border hover:border-accent-gold/30 transition-colors"
                disabled={uploading}
              >
                <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {featuredImage && (
                <div className="relative">
                  <img src={featuredImage} alt="Preview" className="h-16 w-24 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage(null)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">YouTube Video URL (Optional)</label>
            <div className="flex gap-4">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => handleVideoUrlChange(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary"
                placeholder="https://youtube.com/watch?v=..."
              />
              {youtubeId && (
                <div className="flex items-center text-accent-gold text-sm">
                  <Video size={20} className="mr-1" /> Video will be embedded
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary"
              placeholder="Brief summary of your post..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Content</label>
            
            <div className="flex gap-2 mb-3 p-2 rounded-lg bg-surface border border-border">
              <button
                type="button"
                onClick={insertImageMarkdown}
                className="p-2 rounded hover:bg-background transition-colors"
                title="Insert Image"
              >
                <ImageIcon size={18} />
              </button>
              <button
                type="button"
                onClick={() => setContent(prev => prev + '\n**bold text**\n')}
                className="p-2 rounded hover:bg-background transition-colors font-bold"
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => setContent(prev => prev + '\n*italic text*\n')}
                className="p-2 rounded hover:bg-background transition-colors italic"
                title="Italic"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => setContent(prev => prev + '\n# Heading\n')}
                className="p-2 rounded hover:bg-background transition-colors"
                title="Heading"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => setContent(prev => prev + '\n## Subheading\n')}
                className="p-2 rounded hover:bg-background transition-colors"
                title="Subheading"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => setContent(prev => prev + '\n- Bullet point\n')}
                className="p-2 rounded hover:bg-background transition-colors"
                title="Bullet List"
              >
                •
              </button>
              <button
                type="button"
                onClick={() => setContent(prev => prev + '\n1. Numbered item\n')}
                className="p-2 rounded hover:bg-background transition-colors"
                title="Numbered List"
              >
                1.
              </button>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="w-full px-4 py-3 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary font-mono text-sm"
              placeholder="Write your post in Markdown..."
              required
            />
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded border-border text-accent-gold focus:ring-accent-gold/50"
              />
              <span className="text-sm text-text-secondary">Publish immediately</span>
            </label>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <Link href="/admin/dashboard" className="px-6 py-3 rounded-lg border border-border text-text-secondary hover:text-accent-gold transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}