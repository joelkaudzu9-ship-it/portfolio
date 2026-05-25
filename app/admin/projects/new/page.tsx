'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Upload, X, Plus, Save, Eye, GripVertical, 
  Loader2, CheckCircle, AlertCircle, Sparkles, FileText,
  Globe, Tag, Layout, ChevronDown, ChevronUp, Code, Link as LinkIcon
} from 'lucide-react'
// Note: Github is removed - use Code icon instead for GitHub repos
// Image is renamed to ImageIcon to avoid conflict
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Project = {
  id: number
  title: string
  slug: string
  subtitle: string
  description: string
  content: string
  technologies: string[]
  image_url: string
  gallery_urls: string[]
  github_url: string
  live_url: string
  status: string
  featured: boolean
  created_at: string
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
            <span className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
              {progress}%
            </span>
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

// Markdown Preview Component
const MarkdownPreview = ({ content }: { content: string }) => {
  const [isPreview, setIsPreview] = useState(false)
  
  if (!isPreview) {
    return (
      <button
        type="button"
        onClick={() => setIsPreview(true)}
        className="mb-3 px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-lg text-sm flex items-center gap-2 hover:bg-amber-500/20 transition-colors"
      >
        <Eye size={14} /> Preview Markdown
      </button>
    )
  }
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-text-secondary">Preview</h4>
        <button
          type="button"
          onClick={() => setIsPreview(false)}
          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Back to Edit
        </button>
      </div>
      <div className="prose prose-invert prose-sm max-w-none p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content || '*No content yet*'}
        </ReactMarkdown>
      </div>
    </div>
  )
}

// Unsaved Changes Warning
const useUnsavedChanges = (hasChanges: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasChanges])
}

export default function EditProjectPage() {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [technologies, setTechnologies] = useState<string[]>([])
  const [currentTech, setCurrentTech] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [galleryUrls, setGalleryUrls] = useState<string[]>([])
  const [githubUrl, setGithubUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [status, setStatus] = useState('active')
  const [featured, setFeatured] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadFileName, setUploadFileName] = useState('')
  const [newGalleryUrl, setNewGalleryUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [originalSlug, setOriginalSlug] = useState('')
  const [checkingSlug, setCheckingSlug] = useState(false)
  const [slugError, setSlugError] = useState('')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const params = useParams()
  const slugParam = params?.slug as string

  // Check if there are unsaved changes
  const hasUnsavedChanges = title !== '' || content !== '' || description !== '' || technologies.length > 0
  useUnsavedChanges(hasUnsavedChanges && !loading)

  useEffect(() => {
    if (slugParam) {
      fetchProject()
    }
  }, [slugParam])

  // Check slug uniqueness when title changes
  useEffect(() => {
    if (title && originalSlug) {
      const generated = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      setSlug(generated)
      if (generated !== originalSlug) {
        checkSlugUniqueness(generated, originalSlug)
      } else {
        setSlugError('')
      }
    }
  }, [title, originalSlug])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${slugParam}`)
      if (!res.ok) throw new Error('Project not found')
      const data: Project = await res.json()
      
      setTitle(data.title || '')
      setSubtitle(data.subtitle || '')
      setDescription(data.description || '')
      setContent(data.content || '')
      setTechnologies(data.technologies || [])
      setImageUrl(data.image_url || '')
      setGalleryUrls(data.gallery_urls || [])
      setGithubUrl(data.github_url || '')
      setLiveUrl(data.live_url || '')
      setStatus(data.status || 'active')
      setFeatured(data.featured || false)
      setSlug(data.slug || '')
      setOriginalSlug(data.slug || '')
    } catch (error) {
      console.error('Error fetching project:', error)
      setMessage({ type: 'error', text: 'Project not found' })
      setTimeout(() => router.push('/admin/projects'), 1500)
    } finally {
      setLoading(false)
    }
  }

  const checkSlugUniqueness = async (slugToCheck: string, currentSlug: string) => {
    if (!slugToCheck || slugToCheck === currentSlug) return
    
    setCheckingSlug(true)
    try {
      const res = await fetch(`/api/projects/check-slug?slug=${slugToCheck}&exclude=${currentSlug}`)
      const data = await res.json()
      if (data.exists) {
        setSlugError(`Slug "${slugToCheck}" already exists. Consider changing the title.`)
      } else {
        setSlugError('')
      }
    } catch (error) {
      console.error('Error checking slug:', error)
    } finally {
      setCheckingSlug(false)
    }
  }

  // Direct upload to Cloudinary with progress tracking
  const uploadDirectToCloudinary = async (file: File, folder: string = 'portfolio/projects'): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'portfolio_unsigned')
      formData.append('folder', folder)
      
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const xhr = new XMLHttpRequest()
      
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, true)
      
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    setIsUploading(true)
    setUploadProgress(0)
    setUploadFileName(file.name)
    
    try {
      const compressedFile = await compressImage(file)
      const url = await uploadDirectToCloudinary(compressedFile, 'portfolio/projects')
      setImageUrl(url)
      setMessage({ type: 'success', text: 'Image uploaded successfully!' })
      setTimeout(() => setMessage(null), 2000)
    } catch (error) {
      console.error('Upload error:', error)
      setMessage({ type: 'error', text: 'Failed to upload image' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      setUploadFileName('')
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    setIsUploading(true)
    setUploadProgress(0)
    setUploadFileName(file.name)
    
    try {
      const compressedFile = await compressImage(file)
      const url = await uploadDirectToCloudinary(compressedFile, 'portfolio/projects/gallery')
      if (!galleryUrls.includes(url)) {
        setGalleryUrls([...galleryUrls, url])
        setMessage({ type: 'success', text: 'Gallery image added!' })
        setTimeout(() => setMessage(null), 2000)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setMessage({ type: 'error', text: 'Failed to upload image' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      setUploadFileName('')
    }
  }

  const addTechnology = () => {
    if (currentTech.trim() && !technologies.includes(currentTech.trim())) {
      setTechnologies([...technologies, currentTech.trim()])
      setCurrentTech('')
    }
  }

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech))
  }

  const addToGallery = () => {
    if (newGalleryUrl.trim() && !galleryUrls.includes(newGalleryUrl.trim())) {
      setGalleryUrls([...galleryUrls, newGalleryUrl.trim()])
      setNewGalleryUrl('')
    }
  }

  const removeFromGallery = (url: string) => {
    setGalleryUrls(galleryUrls.filter(u => u !== url))
  }

  // Drag and drop reordering for gallery
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    
    const newGallery = [...galleryUrls]
    const draggedItem = newGallery[draggedIndex]
    newGallery.splice(draggedIndex, 1)
    newGallery.splice(index, 0, draggedItem)
    setGalleryUrls(newGallery)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Project title is required' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    if (slugError) {
      setMessage({ type: 'error', text: 'Please fix the slug issue before saving' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    if (!confirm('Save changes to this project?')) return
    
    setSaving(true)
    
    const projectData = {
      title: title.trim(),
      slug,
      subtitle: subtitle.trim(),
      description: description.trim(),
      content,
      technologies,
      image_url: imageUrl,
      gallery_urls: galleryUrls,
      github_url: githubUrl,
      live_url: liveUrl,
      status,
      featured,
    }
    
    try {
      const res = await fetch(`/api/projects/${slugParam}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      })
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Project updated successfully!' })
        setTimeout(() => router.push('/admin/projects'), 1500)
      } else {
        const error = await res.json()
        setMessage({ type: 'error', text: error.error || 'Failed to update project' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (statusValue: string) => {
    switch(statusValue) {
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'concept': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'planning': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'experiment': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-amber-500 text-sm">Loading project...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-4 sm:py-8">
      <UploadProgressModal progress={uploadProgress} isVisible={isUploading} fileName={uploadFileName} />
      
      <div className="container-custom max-w-4xl px-4 sm:px-6 mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Link 
            href="/admin/projects" 
            className="inline-flex items-center gap-2 text-amber-500 hover:gap-3 transition-all text-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
        </div>

        {/* Title Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Layout size={16} className="text-amber-500" />
            </div>
            <span className="text-xs text-text-muted uppercase tracking-wider">Edit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Edit Project
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Update your project details
          </p>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              Project Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-text-primary"
              placeholder="e.g., MoyoWanga"
              required
            />
            {slug && (
              <div className="mt-2">
                <p className="text-xs text-text-muted flex items-center gap-1">
                  <Tag size={10} />
                  URL: <span className="text-amber-500">/projects/{slug}</span>
                  {originalSlug !== slug && <span className="text-yellow-500 ml-1">(will update)</span>}
                </p>
                {checkingSlug && <p className="text-xs text-text-muted mt-1">Checking availability...</p>}
                {slugError && <p className="text-xs text-red-500 mt-1">{slugError}</p>}
              </div>
            )}
          </div>
          
          {/* Subtitle */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              Subtitle / Tagline
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none text-sm"
              placeholder="e.g., Multilingual Chronic Disease Support Ecosystem"
            />
          </div>
          
          {/* Featured Image */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              Featured Image
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none text-sm"
                placeholder="Image URL"
              />
              <label className="px-4 py-2.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg cursor-pointer hover:bg-blue-500/20 transition-colors text-sm text-center inline-flex items-center justify-center gap-2 whitespace-nowrap">
                <Upload size={14} /> Upload
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {imageUrl && (
              <div className="relative inline-block mt-3">
                <img src={imageUrl} alt="Preview" className="h-24 rounded-lg object-cover border border-gray-200 dark:border-gray-700" />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <X size={10} />
                </button>
              </div>
            )}
          </div>
          
          {/* Technologies */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              Technologies Used
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none text-sm"
                placeholder="e.g., Python, Flask, PostgreSQL"
              />
              <button 
                type="button" 
                onClick={addTechnology} 
                className="px-4 py-2.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span key={tech} className="px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs flex items-center gap-1">
                    {tech}
                    <button type="button" onClick={() => removeTechnology(tech)} className="hover:text-red-500 transition-colors">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Short Description */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              Short Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none text-sm resize-none"
              placeholder="Brief description of the project for cards and previews"
            />
            <p className="text-xs text-text-muted mt-1">
              {description.length}/200 characters (recommended)
            </p>
          </div>
          
          {/* Full Content */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              Full Content (Markdown supported)
            </label>
            <MarkdownPreview content={content} />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none font-mono text-sm"
              placeholder="## Project Overview&#10;&#10;Write your project description in Markdown here..."
            />
            <p className="text-xs text-text-muted mt-2">
              Supports Markdown: # headings, **bold**, *italic*, - lists, [links](url), ![images](url)
            </p>
          </div>
          
          {/* Image Gallery */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              Image Gallery <span className="text-xs text-text-muted">(Drag to reorder)</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none text-sm"
                placeholder="Image URL"
              />
              <button 
                type="button" 
                onClick={addToGallery} 
                className="px-4 py-2.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors"
              >
                <Plus size={16} /> Add URL
              </button>
              <label className="px-4 py-2.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg cursor-pointer hover:bg-blue-500/20 transition-colors text-center inline-flex items-center justify-center gap-2 whitespace-nowrap">
                <Upload size={14} /> Upload
                <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} />
              </label>
            </div>
            {galleryUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                {galleryUrls.map((url, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className="relative cursor-move group"
                  >
                    <img src={url} alt={`Gallery ${index + 1}`} className="h-20 w-full object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <GripVertical size={20} className="text-white" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromGallery(url)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* GitHub URL - using Code icon instead of Github */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <label className="block text-sm font-medium mb-2 text-text-secondary flex items-center gap-2">
              <Code size={14} /> GitHub Repository URL
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none text-sm"
              placeholder="https://github.com/username/repo"
            />
          </div>
          
          {/* Live URL */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <label className="block text-sm font-medium mb-2 text-text-secondary flex items-center gap-2">
              <Globe size={14} /> Live Demo URL
            </label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none text-sm"
              placeholder="https://project-demo.com"
            />
          </div>
          
          {/* Status & Featured */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-text-secondary">Project Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none text-sm"
                >
                  <option value="active">🚀 Active - Currently maintained</option>
                  <option value="concept">💡 Concept - Idea stage</option>
                  <option value="planning">🔧 Planning - In development</option>
                  <option value="experiment">🧪 Experiment - Research/Test</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500/50"
                  id="featured"
                />
                <label htmlFor="featured" className="text-sm cursor-pointer text-text-secondary">
                  ⭐ Featured on homepage
                </label>
              </div>
            </div>
            <div className="mt-3">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getStatusColor(status)}`}>
                Current status: {status}
              </span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pb-8">
            <button
              type="submit"
              disabled={saving || isUploading || !!slugError}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : isUploading ? 'Uploading...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/projects"
              className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center text-sm font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Tips Section */}
        <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <Sparkles size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-500 mb-1">Tips for a Great Project</h4>
              <ul className="text-xs text-text-muted space-y-1">
                <li>• Use clear, descriptive titles that reflect the project's purpose</li>
                <li>• Add screenshots to showcase your work visually</li>
                <li>• List technologies to help recruiters understand your stack</li>
                <li>• Include both GitHub and live demo links when available</li>
                <li>• Write compelling descriptions that explain the problem you solved</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}