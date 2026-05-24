'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Code, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PageLoader } from '@/components/PageLoader'
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

export default function SingleProjectPage() {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const params = useParams()
  const slug = params?.slug as string

  useEffect(() => {
    if (slug) {
      fetch(`/api/projects/${slug}`)
        .then(res => res.json())
        .then(data => {
          setProject(data)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    }
  }, [slug])

  const nextImage = () => {
    if (project?.gallery_urls && project.gallery_urls.length > 0) {
      setGalleryIndex((prev) => (prev + 1) % project.gallery_urls.length)
    }
  }

  const prevImage = () => {
    if (project?.gallery_urls && project.gallery_urls.length > 0) {
      setGalleryIndex((prev) => (prev - 1 + project.gallery_urls.length) % project.gallery_urls.length)
    }
  }

  if (loading) {
    return <PageLoader />
  }

  if (!project) {
    return (
      <div className="min-h-screen py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link href="/projects" className="text-amber-500 hover:underline">← Back to Projects</Link>
        </div>
      </div>
    )
  }

  const allImages = project.gallery_urls && project.gallery_urls.length > 0 
    ? [project.image_url, ...project.gallery_urls].filter(Boolean)
    : project.image_url ? [project.image_url] : []

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom max-w-5xl">
        <Link href="/projects" className="inline-flex items-center gap-2 text-text-secondary hover:text-amber-500 mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Projects
        </Link>

        <div>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                project.status === 'active' ? 'bg-green-500/20 text-green-500' :
                project.status === 'concept' ? 'bg-amber-500/20 text-amber-500' :
                'bg-gray-500/20 text-gray-500'
              }`}>
                {project.status}
              </span>
              <span className="flex items-center gap-1 text-sm text-text-muted">
                <Calendar size={14} />
                {new Date(project.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text-gold mb-4">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="text-xl text-text-secondary leading-relaxed border-l-4 border-amber-500 pl-4">
                {project.subtitle}
              </p>
            )}
          </div>

          {project.image_url && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img 
                src={project.image_url} 
                alt={project.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {allImages.length > 1 && (
            <div className="mb-8">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={allImages[galleryIndex]} 
                    alt={`${project.title} - Image ${galleryIndex + 1}`}
                    className="w-full h-auto max-h-[500px] object-contain"
                  />
                </div>
                
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <ChevronLeft size={24} className="text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <ChevronRight size={24} className="text-white" />
                    </button>
                  </>
                )}
              </div>
              
              {allImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGalleryIndex(idx)}
                      className={`transition-all ${
                        idx === galleryIndex 
                          ? 'w-6 h-2 bg-amber-500 rounded-full' 
                          : 'w-2 h-2 bg-gray-600 rounded-full hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="px-3 py-1.5 bg-surface border border-border rounded-lg text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.content && (
            <div className="prose prose-invert prose-lg max-w-none mb-8">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.content}
              </ReactMarkdown>
            </div>
          )}

          {(project.github_url || project.live_url) && (
            <div className="flex gap-4 pt-4 border-t border-border">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-lg hover:border-amber-500/30 transition-colors"
                >
                  <span>📂</span> View on GitHub
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  <ExternalLink size={18} /> Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}