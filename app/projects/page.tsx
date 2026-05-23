'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Code, ExternalLink, Github as GitHubIcon } from 'lucide-react'

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

export default function ProjectsPage() {
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
      case 'active': return 'bg-green-500/20 text-green-500'
      case 'concept': return 'bg-amber-500/20 text-amber-500'
      case 'planning': return 'bg-blue-500/20 text-blue-500'
      case 'experiment': return 'bg-purple-500/20 text-purple-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-500">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-amber-500 text-sm font-semibold tracking-wide uppercase">My Work</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-2">
            Featured <span className="gradient-text-gold">Projects</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto mt-4">
            Building systems that solve real problems in healthcare, education, and communication
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['all', 'active', 'concept', 'planning', 'experiment'].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full capitalize transition-all duration-300 text-sm ${
                filter === category
                  ? 'bg-amber-500 text-white'
                  : 'bg-surface border border-border text-text-secondary hover:border-amber-500/30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/projects/${project.slug}`}>
                <div className="glass-card-hover overflow-hidden h-full flex flex-col">
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-amber-500/20 to-amber-500/5">
                    {project.image_url ? (
                      <>
                        <img 
                          src={project.image_url} 
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Code size={48} className="text-text-muted" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold mb-2 group-hover:text-amber-500 transition-colors">
                      {project.title}
                    </h2>
                    
                    {project.subtitle && (
                      <p className="text-amber-500 text-sm mb-3">
                        {project.subtitle}
                      </p>
                    )}
                    
                    <p className="text-text-secondary mb-4 leading-relaxed flex-1">
                      {project.description}
                    </p>
                    
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 4).map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-surface border border-border rounded-md text-xs text-text-muted">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="px-2 py-1 text-xs text-text-muted">
                            +{project.technologies.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3">
                        {project.github_url && (
                          <a 
                            href={project.github_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-text-muted hover:text-amber-500 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <GitHubIcon size={18} />
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
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                      <div className="text-amber-500 text-sm font-medium group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                        View Project <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Code size={48} className="mx-auto mb-4 text-text-muted" />
            <p className="text-text-secondary">No projects found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}