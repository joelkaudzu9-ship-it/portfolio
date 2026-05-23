'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Image as ImageIcon, X, Video, Play, FileText, Eye, Save, Trash2, Plus } from 'lucide-react'

type MediaItem = {
  url: string
  type: 'image' | 'video' | 'youtube'
  publicId?: string
  videoId?: string
}

export default function NewPost() {
  // Post data
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Media
  const [featuredImage, setFeaturedImage] = useState<MediaItem | null>(null)
  const [mediaGallery, setMediaGallery] = useState<MediaItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [showYouTubeModal, setShowYouTubeModal] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  // Generate slug from title
  const generateSlug = useCallback(() => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setSlug(generated)
  }, [title])
  
  // Upload to Cloudinary
  const uploadToCloudinary = async (file: File, type: 'image' | 'video') => {
    const formData = new FormData()
    formData.append('file', file)
    
    const endpoint = type === 'image' ? '/api/upload' : '/api/upload/video'
    
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    })
    
    if (!res.ok) throw new Error('Upload failed')
    return res.json()
  }
  
  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }
    
    setUploading(true)
    try {
      const result = await uploadToCloudinary(file, 'image')
      const mediaItem: MediaItem = {
        url: result.url,
        type: 'image',
        publicId: result.public_id,
      }
      
      if (!featuredImage) {
        setFeaturedImage(mediaItem)
      }
      setMediaGallery(prev => [...prev, mediaItem])
      
      // Insert markdown for image
      const imageMarkdown = `\n\n![Image](${result.url})\n\n`
      setContent(prev => prev + imageMarkdown)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }
  
  // Handle video upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('video/')) {
      alert('Please upload a video file')
      return
    }
    
    setUploading(true)
    try {
      const result = await uploadToCloudinary(file, 'video')
      const mediaItem: MediaItem = {
        url: result.url,
        type: 'video',
        publicId: result.public_id,
      }
      setMediaGallery(prev => [...prev, mediaItem])
      
      // Insert video embed
      const videoEmbed = `\n\n<video controls src="${result.url}" class="w-full rounded-lg"></video>\n\n`
      setContent(prev => prev + videoEmbed)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload video')
    } finally {
      setUploading(false)
    }
  }
  
  // Handle YouTube addition
  const addYouTubeVideo = async () => {
    if (!youtubeUrl) return
    
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('isYouTube', 'true')
      formData.append('youtubeUrl', youtubeUrl)
      
      const res = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      })
      
      const result = await res.json()
      
      if (result.type === 'youtube') {
        const mediaItem: MediaItem = {
          url: result.embedUrl,
          type: 'youtube',
          videoId: result.videoId,
        }
        setMediaGallery(prev => [...prev, mediaItem])
        
        // Insert YouTube embed
        const youtubeEmbed = `\n\n<iframe width="100%" height="400" src="${result.embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="rounded-lg"></iframe>\n\n`
        setContent(prev => prev + youtubeEmbed)
      }
      
      setShowYouTubeModal(false)
      setYoutubeUrl('')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to add YouTube video')
    } finally {
      setUploading(false)
    }
  }
  
  // Remove media from gallery
  const removeMedia = (index: number) => {
    setMediaGallery(prev => prev.filter((_, i) => i !== index))
  }
  
  // Set as featured image
  const setAsFeatured = (media: MediaItem) => {
    setFeaturedImage(media)
  }
  
  // Insert markdown helper
  const insertMarkdown = (markdown: string) => {
    setContent(prev => prev + markdown)
  }
  
  // Submit post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const postData = {
      title,
      slug: slug || generateSlug(),
      excerpt,
      content,
      published,
      featured_image: featuredImage?.url || null,
      featured_image_type: featuredImage?.type || null,
      media_gallery: mediaGallery,
    }
    
    const res = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    })
    
    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      const error = await res.json()
      alert(error.error || 'Failed to create post')
    }
    setLoading(false)
  }
  
  return (
    <div className="min-h-screen bg-background py-4 sm:py-8">
      <div className="container-custom px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-accent-gold hover:gap-3 transition-all">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => window.open(`/blog/${slug}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-accent-gold transition-colors"
              disabled={!slug}
            >
              <Eye size={16} /> Preview
            </button>
          </div>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 gradient-text-gold">Create New Post</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Title Section */}
          <div className="glass-card p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2 text-text-secondary">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (!slug) generateSlug()
              }}
              onBlur={generateSlug}
              className="w-full px-4 py-3 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary text-lg sm:text-xl"
              placeholder="Enter post title"
              required
            />
            {slug && (
              <p className="text-xs text-text-muted mt-2">
                URL: <span className="text-accent-gold">/blog/{slug}</span>
              </p>
            )}
          </div>
          
          {/* Featured Image Section */}
          <div className="glass-card p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Featured Image</h3>
            {featuredImage ? (
              <div className="relative">
                {featuredImage.type === 'image' && (
                  <img src={featuredImage.url} alt="Featured" className="w-full h-48 sm:h-64 object-cover rounded-lg" />
                )}
                {featuredImage.type === 'youtube' && (
                  <iframe src={featuredImage.url} className="w-full h-48 sm:h-64 rounded-lg" allowFullScreen />
                )}
                <button
                  type="button"
                  onClick={() => setFeaturedImage(null)}
                  className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 sm:h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-accent-gold/50 transition-colors"
              >
                <ImageIcon size={28} className="text-text-muted" />
                <span className="text-text-secondary text-sm">Click to upload featured image</span>
              </button>
            )}
          </div>
          
          {/* Media Gallery Section */}
          <div className="glass-card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-lg font-semibold">Media Gallery</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-accent-gold/30 transition-colors text-xs sm:text-sm"
                >
                  <Upload size={14} /> Upload Image
                </button>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-accent-gold/30 transition-colors text-xs sm:text-sm"
                >
                  <Video size={14} /> Upload Video
                </button>
                <button
                  type="button"
                  onClick={() => setShowYouTubeModal(true)}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-accent-gold/30 transition-colors text-xs sm:text-sm"
                >
                  <Play size={14} /> Add YouTube
                </button>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            
            {uploading && (
              <div className="text-center py-6 sm:py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold mx-auto"></div>
                <p className="text-text-secondary mt-2 text-sm">Uploading to Cloudinary...</p>
              </div>
            )}
            
            {mediaGallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
                {mediaGallery.map((media, index) => (
                  <div key={index} className="relative group">
                    {media.type === 'image' && (
                      <img src={media.url} alt="Media" className="w-full h-24 sm:h-32 object-cover rounded-lg" />
                    )}
                    {media.type === 'video' && (
                      <video src={media.url} className="w-full h-24 sm:h-32 object-cover rounded-lg" />
                    )}
                    {media.type === 'youtube' && (
                      <img src={`https://img.youtube.com/vi/${media.videoId}/mqdefault.jpg`} alt="YouTube" className="w-full h-24 sm:h-32 object-cover rounded-lg" />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAsFeatured(media)}
                        className="p-1.5 bg-accent-gold rounded hover:bg-accent-goldLight transition-colors"
                        title="Set as featured"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="p-1.5 bg-red-500 rounded hover:bg-red-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Excerpt */}
          <div className="glass-card p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2 text-text-secondary">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary"
              placeholder="A brief summary of your post..."
            />
          </div>
          
          {/* Content Editor */}
          <div className="glass-card p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2 text-text-secondary">Content</label>
            
            {/* Toolbar - Mobile responsive */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 p-2 rounded-lg bg-surface border border-border overflow-x-auto">
              <button type="button" onClick={() => insertMarkdown('\n# Heading\n')} className="px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-background transition-colors font-bold text-sm sm:text-base">H1</button>
              <button type="button" onClick={() => insertMarkdown('\n## Heading\n')} className="px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-background transition-colors font-bold text-sm sm:text-base">H2</button>
              <button type="button" onClick={() => insertMarkdown('\n### Heading\n')} className="px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-background transition-colors font-bold text-sm sm:text-base">H3</button>
              <div className="w-px h-6 bg-border mx-0 sm:mx-1 hidden sm:block"></div>
              <button type="button" onClick={() => insertMarkdown('**bold text**')} className="px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-background transition-colors font-bold text-sm sm:text-base">B</button>
              <button type="button" onClick={() => insertMarkdown('*italic text*')} className="px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-background transition-colors italic text-sm sm:text-base">I</button>
              <button type="button" onClick={() => insertMarkdown('[link text](url)')} className="px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-background transition-colors text-sm sm:text-base">🔗</button>
              <div className="w-px h-6 bg-border mx-0 sm:mx-1 hidden sm:block"></div>
              <button type="button" onClick={() => insertMarkdown('\n- Bullet point\n')} className="px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-background transition-colors text-sm sm:text-base">• List</button>
              <button type="button" onClick={() => insertMarkdown('\n1. Numbered item\n')} className="px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-background transition-colors text-sm sm:text-base">1. List</button>
              <button type="button" onClick={() => insertMarkdown('\n> Blockquote\n')} className="px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-background transition-colors text-sm sm:text-base">" Quote</button>
              <div className="w-px h-6 bg-border mx-0 sm:mx-1 hidden sm:block"></div>
              <button type="button" onClick={() => insertMarkdown('\n```\ncode block\n```\n')} className="px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-background transition-colors text-sm sm:text-base">{`<>`}</button>
              <button type="button" onClick={() => insertMarkdown('\n---\n')} className="px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-background transition-colors text-sm sm:text-base">—</button>
            </div>
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full px-4 py-3 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary font-mono text-sm"
              placeholder="Write your post in Markdown..."
              required
            />
            
            <div className="mt-3 text-xs text-text-muted flex justify-between">
              <span>Supports Markdown formatting</span>
              <span>{content.length} characters</span>
            </div>
          </div>
          
          {/* Publish Section - Mobile responsive */}
          <div className="glass-card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-accent-gold focus:ring-accent-gold/50"
                />
                <span className="text-sm text-text-secondary">Publish immediately</span>
              </label>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-accent-gold text-background rounded-lg font-semibold hover:bg-accent-goldLight transition-colors disabled:opacity-50"
              >
                {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background"></div> : <Save size={16} />}
                {loading ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* YouTube Modal */}
      {showYouTubeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-4 sm:p-6 w-full max-w-md">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Add YouTube Video</h3>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={addYouTubeVideo}
                className="flex-1 px-4 py-2 bg-accent-gold text-background rounded-lg hover:bg-accent-goldLight transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowYouTubeModal(false)
                  setYoutubeUrl('')
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-surface transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}