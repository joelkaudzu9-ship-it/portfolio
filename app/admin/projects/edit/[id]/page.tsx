'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, X, Plus, Save } from 'lucide-react'

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

// Upload Progress Component
const UploadProgress = ({ progress, isVisible }: { progress: number; isVisible: boolean }) => {
  if (!isVisible) return null
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="glass-card p-8 w-80 text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-700"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-amber-500"
              strokeDasharray={`${2 * Math.PI * 58}`}
              strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold gradient-text-gold">{progress}%</span>
          </div>
        </div>
        <p className="text-text-secondary mt-2">Uploading to Cloudinary...</p>
        <p className="text-text-muted text-sm mt-1">Please wait</p>
      </div>
    </div>
  )
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
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [newGalleryUrl, setNewGalleryUrl] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`)
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
    } catch (error) {
      console.error('Error fetching project:', error)
      alert('Project not found')
      router.push('/admin/projects')
    } finally {
      setLoading(false)
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
      
      // Track progress
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
      alert('Please upload an image file')
      return
    }
    
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      const compressedFile = await compressImage(file)
      const url = await uploadDirectToCloudinary(compressedFile, 'portfolio/projects')
      setImageUrl(url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }
    
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      const compressedFile = await compressImage(file)
      const url = await uploadDirectToCloudinary(compressedFile, 'portfolio/projects/gallery')
      if (!galleryUrls.includes(url)) {
        setGalleryUrls([...galleryUrls, url])
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    
    const projectData = {
      id: parseInt(id),
      title,
      slug,
      subtitle,
      description,
      content,
      technologies,
      image_url: imageUrl,
      gallery_urls: galleryUrls,
      github_url: githubUrl,
      live_url: liveUrl,
      status,
      featured,
    }
    
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    })
    
    if (res.ok) {
      router.push('/admin/projects')
    } else {
      const error = await res.json()
      alert(error.error || 'Failed to update project')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-500">Loading project...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-4 sm:py-8">
      {/* Upload Progress Modal */}
      <UploadProgress progress={uploadProgress} isVisible={isUploading} />
      
      <div className="container-custom max-w-4xl px-4 sm:px-6">
        <Link href="/admin/projects" className="inline-flex items-center gap-2 text-amber-500 mb-6 hover:gap-3 transition-all">
          <ArrowLeft size={18} /> Back to Projects
        </Link>
        
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 gradient-text-gold">Edit Project: {title}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2 text-text-secondary">Project Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary"
              required
            />
          </div>
          
          <div className="glass-card p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2 text-text-secondary">Subtitle / Tagline</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary"
              placeholder="e.g., Multilingual Chronic Disease Support Ecosystem"
            />
          </div>
          
          <div className="glass-card p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2 text-text-secondary">Featured Image</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary text-sm"
                placeholder="Image URL"
              />
              <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 text-center">
                <Upload size={16} className="inline mr-1" /> Upload
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {isUploading && <p className="text-sm text-text-muted mt-2">Uploading... {uploadProgress}%</p>}
            {imageUrl && (
              <div className="relative mt-2 inline-block">
                <img src={imageUrl} alt="Preview" className="h-32 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
          
          <div className="glass-card p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2 text-text-secondary">Technologies Used</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                className="flex-1 px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary"
                placeholder="e.g., Python, Flask, PostgreSQL"
              />
              <button type="button" onClick={addTechnology} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span key={tech} className="px-2 py-1 bg-accent-gold/20 text-accent-gold rounded-full text-sm flex items-center gap-1">
                  {tech}
                  <button type="button" onClick={() => removeTechnology(tech)} className="hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2 text-text-secondary">Short Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary"
              placeholder="Brief description of the project"
            />
          </div>
          
          <div className="glass-card p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2 text-text-secondary">Full Content (Markdown supported)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary font-mono text-sm"
              placeholder="## Project Overview&#10;&#10;Write your project description in Markdown here..."
              required
            />
            <p className="text-xs text-text-muted mt-2">
              Supports Markdown: # headings, **bold**, *italic*, - lists, [links](url), ![images](url)
            </p>
          </div>
          
          <div className="glass-card p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2 text-text-secondary">Image Gallery</label>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary text-sm"
                placeholder="Image URL"
              />
              <button type="button" onClick={addToGallery} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                <Plus size={16} /> Add URL
              </button>
              <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 text-center">
                <Upload size={16} className="inline mr-1" /> Upload
                <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} />
              </label>
            </div>
            {galleryUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                {galleryUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt={`Gallery ${index + 1}`} className="h-24 w-full object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeFromGallery(url)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="glass-card p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2 text-text-secondary">GitHub Repository URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary"
              placeholder="https://github.com/username/repo"
            />
          </div>
          
          <div className="glass-card p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2 text-text-secondary">Live Demo URL</label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary"
              placeholder="https://project-demo.com"
            />
          </div>
          
          <div className="glass-card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary">Project Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary"
                >
                  <option value="active">Active - Currently maintained</option>
                  <option value="concept">Concept - Idea stage</option>
                  <option value="planning">Planning - In development</option>
                  <option value="experiment">Experiment - Research/Test</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-accent-gold focus:ring-accent-gold/50"
                  id="featured"
                />
                <label htmlFor="featured" className="text-sm cursor-pointer text-text-secondary">
                  Feature this project on homepage
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pb-8">
            <button
              type="submit"
              disabled={saving || isUploading}
              className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={16} /> {saving ? 'Saving...' : isUploading ? 'Uploading...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/projects"
              className="px-6 py-3 border border-border rounded-lg hover:bg-surface transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}