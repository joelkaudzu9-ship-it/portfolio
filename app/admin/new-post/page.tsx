'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Upload, Image as ImageIcon, X, Video, Play, FileText, 
  Eye, Save, Trash2, Plus, Loader2, CheckCircle, AlertCircle,
  Bold, Italic, Link as LinkIcon, List, ListOrdered, Quote, Code, Minus
} from 'lucide-react'

type MediaItem = {
  url: string
  type: 'image' | 'video' | 'youtube'
  publicId?: string
  videoId?: string
}

// Image compression utility
const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        const maxWidth = 1920
        const maxHeight = 1080
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              reject(new Error('Compression failed'))
            }
          },
          'image/jpeg',
          0.8
        )
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}

// Upload Progress Modal Component
const UploadProgressModal = ({ progress, isVisible, fileName }: { progress: number; isVisible: boolean; fileName?: string }) => {
  if (!isVisible) return null
  
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 w-80 text-center shadow-2xl border border-gray-200 dark:border-gray-800">
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-amber-500"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                {progress}%
              </span>
            </div>
          </div>
        </div>
        <p className="font-semibold text-text-primary mb-1">Uploading to Cloudinary</p>
        <p className="text-sm text-text-muted">{fileName || 'Please wait...'}</p>
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div 
            className="bg-gradient-to-r from-amber-500 to-amber-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// Toolbar Button Component
const ToolbarButton = ({ onClick, children, title }: { onClick: () => void; children: React.ReactNode; title?: string }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="px-2 sm:px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
  >
    {children}
  </button>
)

export default function NewPost() {
  // Post data
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // Media
  const [featuredImage, setFeaturedImage] = useState<MediaItem | null>(null)
  const [mediaGallery, setMediaGallery] = useState<MediaItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadFileName, setUploadFileName] = useState('')
  const [showYouTubeModal, setShowYouTubeModal] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  // Auto-save draft
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (title || content) {
        localStorage.setItem('blog_draft', JSON.stringify({ title, slug, excerpt, content, published }))
      }
    }, 3000)
    return () => clearTimeout(autoSave)
  }, [title, slug, excerpt, content, published])
  
  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('blog_draft')
    if (draft) {
      const data = JSON.parse(draft)
      if (data.title && !title) {
        if (confirm('Found a saved draft. Load it?')) {
          setTitle(data.title)
          setSlug(data.slug)
          setExcerpt(data.excerpt)
          setContent(data.content)
          setPublished(data.published)
        }
      }
    }
  }, [])
  
  // Generate slug from title
  const generateSlug = useCallback(() => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setSlug(generated)
  }, [title])
  
  // Direct upload to Cloudinary with progress tracking
  const uploadDirectToCloudinary = async (file: File, type: 'image' | 'video' = 'image'): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'portfolio_unsigned')
      formData.append('folder', type === 'image' ? 'portfolio/blog' : 'portfolio/videos')
      
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const uploadUrl = type === 'image' 
        ? `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
        : `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
      
      const xhr = new XMLHttpRequest()
      
      xhr.open('POST', uploadUrl, true)
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(percent)
        }
      })
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText)
          resolve(result.secure_url)
        } else {
          reject(new Error('Upload failed'))
        }
      }
      
      xhr.onerror = () => reject(new Error('Network error'))
      
      xhr.send(formData)
    })
  }
  
  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    setUploading(true)
    setUploadProgress(0)
    setUploadFileName(file.name)
    
    try {
      const compressedFile = await compressImage(file)
      const url = await uploadDirectToCloudinary(compressedFile, 'image')
      
      const mediaItem: MediaItem = { url, type: 'image' }
      
      if (!featuredImage) {
        setFeaturedImage(mediaItem)
      }
      setMediaGallery(prev => [...prev, mediaItem])
      
      const imageMarkdown = `\n\n![Image](${url})\n\n`
      setContent(prev => prev + imageMarkdown)
      
      setMessage({ type: 'success', text: 'Image uploaded successfully!' })
      setTimeout(() => setMessage(null), 2000)
    } catch (error) {
      console.error('Upload error:', error)
      setMessage({ type: 'error', text: 'Failed to upload image' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setUploading(false)
      setUploadProgress(0)
      setUploadFileName('')
    }
  }
  
  // Handle video upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('video/')) {
      setMessage({ type: 'error', text: 'Please upload a video file' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    setUploading(true)
    setUploadProgress(0)
    setUploadFileName(file.name)
    
    try {
      const url = await uploadDirectToCloudinary(file, 'video')
      
      const mediaItem: MediaItem = { url, type: 'video' }
      setMediaGallery(prev => [...prev, mediaItem])
      
      const videoEmbed = `\n\n<video controls src="${url}" class="w-full rounded-lg"></video>\n\n`
      setContent(prev => prev + videoEmbed)
      
      setMessage({ type: 'success', text: 'Video uploaded successfully!' })
      setTimeout(() => setMessage(null), 2000)
    } catch (error) {
      console.error('Upload error:', error)
      setMessage({ type: 'error', text: 'Failed to upload video' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setUploading(false)
      setUploadProgress(0)
      setUploadFileName('')
    }
  }
  
  // Handle YouTube addition
  const addYouTubeVideo = async () => {
    if (!youtubeUrl) return
    
    setUploading(true)
    try {
      // Extract video ID from YouTube URL
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
      const match = youtubeUrl.match(regExp)
      const videoId = match && match[2].length === 11 ? match[2] : null
      
      if (!videoId) {
        setMessage({ type: 'error', text: 'Invalid YouTube URL' })
        setTimeout(() => setMessage(null), 3000)
        return
      }
      
      const embedUrl = `https://www.youtube.com/embed/${videoId}`
      
      const mediaItem: MediaItem = {
        url: embedUrl,
        type: 'youtube',
        videoId: videoId,
      }
      
      if (!featuredImage) {
        setFeaturedImage(mediaItem)
      }
      
      setMediaGallery(prev => [...prev, mediaItem])
      
      const youtubeEmbed = `\n\n<iframe width="100%" height="400" src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="rounded-lg"></iframe>\n\n`
      setContent(prev => prev + youtubeEmbed)
      
      setShowYouTubeModal(false)
      setYoutubeUrl('')
      setMessage({ type: 'success', text: 'YouTube video added!' })
      setTimeout(() => setMessage(null), 2000)
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: 'Failed to add YouTube video' })
      setTimeout(() => setMessage(null), 3000)
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
    setMessage({ type: 'success', text: 'Featured image updated!' })
    setTimeout(() => setMessage(null), 2000)
  }
  
  // Insert markdown helper
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = content.substring(start, end)
      const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)
      setContent(newText)
      
      // Set cursor position after insertion
      setTimeout(() => {
        textarea.focus()
        const newCursorPos = start + before.length + selectedText.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    } else {
      setContent(prev => prev + before + after)
    }
  }
  
  // Submit post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Please enter a title' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    if (!content.trim()) {
      setMessage({ type: 'error', text: 'Please enter content' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    setLoading(true)
    
    const postData = {
      title: title.trim(),
      slug: slug.trim() || generateSlug(),
      excerpt: excerpt.trim(),
      content,
      published,
      featured_image: featuredImage?.url || null,
      featured_image_type: featuredImage?.type || null,
      video_id: featuredImage?.type === 'youtube' ? featuredImage.videoId : null,
      media_gallery: mediaGallery,
    }
    
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })
      
      if (res.ok) {
        localStorage.removeItem('blog_draft')
        setMessage({ type: 'success', text: 'Post created successfully!' })
        setTimeout(() => router.push('/admin/dashboard'), 1500)
      } else {
        const error = await res.json()
        setMessage({ type: 'error', text: error.error || 'Failed to create post' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-white dark:bg-black py-4 sm:py-8">
      {/* Upload Progress Modal */}
      <UploadProgressModal progress={uploadProgress} isVisible={uploading} fileName={uploadFileName} />
      
      <div className="container-custom px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Link 
            href="/admin/dashboard" 
            className="inline-flex items-center gap-2 text-amber-500 hover:gap-3 transition-all text-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          
          <div className="flex gap-3">
            {slug && (
              <button
                type="button"
                onClick={() => window.open(`/blog/${slug}`, '_blank')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-text-secondary hover:text-amber-500 transition-colors text-sm"
              >
                <Eye size={14} /> Preview
              </button>
            )}
          </div>
        </div>
        
        {/* Message Alert */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/20 text-green-500' 
              : 'bg-red-500/10 border border-red-500/20 text-red-500'
          }`}>
            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}
        
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
          Create New Post
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Section */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <label className="block text-sm font-medium mb-2 text-text-secondary">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (!slug) generateSlug()
              }}
              onBlur={generateSlug}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-text-primary text-lg"
              placeholder="Enter post title"
              required
            />
            {slug && (
              <p className="text-xs text-text-muted mt-2">
                URL: <span className="text-amber-500">/blog/{slug}</span>
              </p>
            )}
          </div>
          
          {/* Featured Image Section */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <ImageIcon size={16} className="text-amber-500" />
              Featured Image
            </h3>
            {featuredImage ? (
              <div className="relative rounded-lg overflow-hidden">
                {featuredImage.type === 'image' && (
                  <img src={featuredImage.url} alt="Featured" className="w-full h-48 object-cover" />
                )}
                {featuredImage.type === 'youtube' && (
                  <img 
                    src={`https://img.youtube.com/vi/${featuredImage.videoId}/maxresdefault.jpg`} 
                    alt="YouTube thumbnail"
                    className="w-full h-48 object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => setFeaturedImage(null)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-amber-500/50 transition-colors"
              >
                <ImageIcon size={28} className="text-text-muted" />
                <span className="text-text-secondary text-sm">Click to upload featured image</span>
              </button>
            )}
          </div>
          
          {/* Media Gallery Section */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Video size={16} className="text-amber-500" />
                Media Gallery
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <Upload size={12} /> Image
                </button>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <Video size={12} /> Video
                </button>
                <button
                  type="button"
                  onClick={() => setShowYouTubeModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <Play size={12} /> YouTube
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
            
            {mediaGallery.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                {mediaGallery.map((media, index) => (
                  <div key={index} className="relative group">
                    {media.type === 'image' && (
                      <img src={media.url} alt="Media" className="w-full h-20 object-cover rounded-lg" />
                    )}
                    {media.type === 'video' && (
                      <video src={media.url} className="w-full h-20 object-cover rounded-lg" />
                    )}
                    {media.type === 'youtube' && (
                      <img src={`https://img.youtube.com/vi/${media.videoId}/mqdefault.jpg`} alt="YouTube" className="w-full h-20 object-cover rounded-lg" />
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => setAsFeatured(media)}
                        className="p-1 bg-amber-500 rounded hover:bg-amber-600 transition-colors"
                        title="Set as featured"
                      >
                        <Plus size={10} className="text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="p-1 bg-red-500 rounded hover:bg-red-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={10} className="text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Excerpt */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <label className="block text-sm font-medium mb-2 text-text-secondary">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-text-primary text-sm"
              placeholder="A brief summary of your post..."
            />
          </div>
          
          {/* Content Editor */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <label className="block text-sm font-medium mb-2 text-text-secondary">Content *</label>
            
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 mb-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <ToolbarButton onClick={() => insertMarkdown('# ', '')} title="Heading 1">H1</ToolbarButton>
              <ToolbarButton onClick={() => insertMarkdown('## ', '')} title="Heading 2">H2</ToolbarButton>
              <ToolbarButton onClick={() => insertMarkdown('### ', '')} title="Heading 3">H3</ToolbarButton>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
              <ToolbarButton onClick={() => insertMarkdown('**', '**')} title="Bold"><Bold size={14} /></ToolbarButton>
              <ToolbarButton onClick={() => insertMarkdown('*', '*')} title="Italic"><Italic size={14} /></ToolbarButton>
              <ToolbarButton onClick={() => insertMarkdown('[', '](url)')} title="Link"><LinkIcon size={14} /></ToolbarButton>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
              <ToolbarButton onClick={() => insertMarkdown('- ', '')} title="Bullet List"><List size={14} /></ToolbarButton>
              <ToolbarButton onClick={() => insertMarkdown('1. ', '')} title="Numbered List"><ListOrdered size={14} /></ToolbarButton>
              <ToolbarButton onClick={() => insertMarkdown('> ', '')} title="Quote"><Quote size={14} /></ToolbarButton>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
              <ToolbarButton onClick={() => insertMarkdown('```\n', '\n```')} title="Code Block"><Code size={14} /></ToolbarButton>
              <ToolbarButton onClick={() => insertMarkdown('\n---\n', '')} title="Divider"><Minus size={14} /></ToolbarButton>
            </div>
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-text-primary font-mono text-sm"
              placeholder="Write your post in Markdown..."
              required
            />
            
            <div className="mt-3 text-xs text-text-muted flex justify-between">
              <span>Supports Markdown formatting</span>
              <span>{content.length.toLocaleString()} characters</span>
            </div>
          </div>
          
          {/* Publish Section */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500/50"
                />
                <span className="text-sm text-text-secondary">Publish immediately</span>
              </label>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {loading ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* YouTube Modal */}
      {showYouTubeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Play size={18} className="text-red-500" />
              Add YouTube Video
            </h3>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none mb-4 text-sm"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={addYouTubeVideo}
                className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowYouTubeModal(false)
                  setYoutubeUrl('')
                }}
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
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