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
  const [newGalleryUrl, setNewGalleryUrl] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string

  useEffect(() => {
    if (slug) {
      fetchProject()
    }
  }, [slug])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${slug}`)
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

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })
    const result = await res.json()
    return result.secure_url
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setImageUrl(url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
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
    
    const newSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    
    const projectData = {
      title,
      slug: newSlug,
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
    
    try {
      const res = await fetch(`/api/projects/${slug}`, {
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
    } catch (error) {
      alert('Error updating project')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-500">Loading project...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-8">
      <div className="container-custom max-w-4xl">
        <Link href="/admin/projects" className="inline-flex items-center gap-2 text-amber-500 mb-6">
          <ArrowLeft size={18} /> Back to Projects
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 gradient-text-gold">Edit Project: {title}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">Project Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              required
            />
          </div>
          
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">Subtitle / Tagline</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            />
          </div>
          
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">Featured Image</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                placeholder="Image URL"
              />
              <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
                <Upload size={16} />
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
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
          
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">Technologies Used</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                placeholder="e.g., Python, Flask, PostgreSQL"
              />
              <button type="button" onClick={addTechnology} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span key={tech} className="px-2 py-1 bg-amber-500/20 text-amber-500 rounded-full text-sm flex items-center gap-1">
                  {tech}
                  <button type="button" onClick={() => removeTechnology(tech)} className="hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">Short Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            />
          </div>
          
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">Full Content (Markdown)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 font-mono text-sm"
              placeholder="## Project Overview&#10;&#10;Write your project description in Markdown..."
            />
          </div>
          
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">Image Gallery (one URL per line)</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                placeholder="Image URL"
              />
              <button type="button" onClick={addToGallery} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                <Plus size={16} />
              </button>
            </div>
            {galleryUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
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
          
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">GitHub URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              placeholder="https://github.com/..."
            />
          </div>
          
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">Live Demo URL</label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              placeholder="https://..."
            />
          </div>
          
          <div className="glass-card p-6">
            <div className="flex flex-wrap gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                >
                  <option value="active">Active</option>
                  <option value="concept">Concept</option>
                  <option value="planning">Planning</option>
                  <option value="experiment">Experiment</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded"
                  id="featured"
                />
                <label htmlFor="featured" className="text-sm">Featured on homepage</label>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/admin/projects" className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}