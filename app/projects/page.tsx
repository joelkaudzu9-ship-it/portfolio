'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, Code, ExternalLink, Sparkles, GitBranch, Rocket, Lightbulb, Wrench } from 'lucide-react'
import { ProjectsGridSkeleton } from '@/components/skeletons/ProjectsGridSkeleton'

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

function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching projects:', err)
        setLoading(false)
      })
  }, [])

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.status === filter)

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'concept': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'planning': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'experiment': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <Rocket size={12} />
      case 'concept': return <Lightbulb size={12} />
      case 'planning': return <Wrench size={12} />
      case 'experiment': return <GitBranch size={12} />
      default: return null
    }
  }

  if (loading) {
    return <ProjectsGridSkeleton />
  }

  return (
    <>
      {/* Premium Header */}
      <div className="mb-12 sm:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            {/* Badge */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <span className="text-amber-500 text-sm">🚀</span>
              </div>
              <span className="text-xs text-text-muted uppercase tracking-wider">
                Building in Public
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                Projects
              </span>
              <span className="text-text-primary"> & Systems</span>
            </h1>
            
            {/* Description */}
            <p className="text-text-secondary text-sm mt-3 max-w-xl leading-relaxed">
              Building practical solutions for healthcare, education, and communication — 
              designed for real-world African environments.
            </p>
          </div>
          
          {/* Stats badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/50 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-text-muted">{projects.length} project{projects.length !== 1 ? 's' : ''} • {filteredProjects.length} showing</span>
          </div>
        </div>
        
        {/* Elegant divider */}
        <div className="relative mt-5 pt-1">
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="text-amber-500 text-lg leading-none">●</span>
            <span className="text-text-muted/70 text-xs tracking-wide">Healthcare systems • Digital health • African innovation • Open source</span>
            <span className="flex-1 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
          </div>
        </div>
      </div>

      {/* Filter Buttons - Premium */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800/50 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
            filter === 'active'
              ? 'bg-green-500 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800/50 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Rocket size={12} /> Active
        </button>
        <button
          onClick={() => setFilter('concept')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
            filter === 'concept'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800/50 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Lightbulb size={12} /> Concept
        </button>
        <button
          onClick={() => setFilter('planning')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
            filter === 'planning'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800/50 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Wrench size={12} /> Planning
        </button>
        <button
          onClick={() => setFilter('experiment')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
            filter === 'experiment'
              ? 'bg-purple-500 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800/50 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <GitBranch size={12} /> Experiment
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
        {filteredProjects.map((project) => (
          <div key={project.id} className="group">
            <Link href={`/projects/${project.slug}`}>
              <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 transition-all h-full flex flex-col">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-amber-500/10 to-amber-500/5">
                  {project.image_url ? (
                    <>
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/600x400/1a1a1a/666?text=Project'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Code size={48} className="text-text-muted/30" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)} backdrop-blur-sm`}>
                      {getStatusIcon(project.status)}
                      {project.status}
                    </span>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="text-lg sm:text-xl font-bold mb-1 group-hover:text-amber-500 transition-colors line-clamp-1">
                    {project.title}
                  </h2>
                  
                  {project.subtitle && (
                    <p className="text-amber-500 text-xs sm:text-sm mb-3">
                      {project.subtitle}
                    </p>
                  )}
                  
                  <p className="text-text-secondary text-sm mb-4 leading-relaxed flex-1 line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-xs text-text-muted">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-0.5 text-xs text-text-muted">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Footer Links */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      {project.github_url && (
                        <a 
                          href={project.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-text-muted hover:text-amber-500 transition-colors flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Code size={12} /> GitHub
                        </a>
                      )}
                      {project.live_url && (
                        <a 
                          href={project.live_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-text-muted hover:text-amber-500 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <div className="text-amber-500 text-sm font-medium group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                      View <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-12 text-center">
          <Code size={48} className="mx-auto mb-4 text-text-muted/40" />
          <p className="text-text-secondary">No projects found in this category.</p>
          <button
            onClick={() => setFilter('all')}
            className="mt-4 text-amber-500 text-sm hover:underline"
          >
            View all projects
          </button>
        </div>
      )}
    </>
  )
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20">
      <div className="container-custom px-4 sm:px-6">
        <Suspense fallback={<ProjectsGridSkeleton />}>
          <ProjectsContent />
        </Suspense>
      </div>
    </div>
  )
}