'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Smartphone, BookOpen, MessageCircle, ChevronRight } from 'lucide-react'

const projects = [
  {
    id: 'moyowanga',
    title: 'MoyoWanga',
    subtitle: 'Multilingual Chronic Disease Support Ecosystem',
    tags: ['Python', 'Flask', 'PostgreSQL', 'SMS API', 'Healthcare'],
    description: 'SMS-based patient support system for chronic disease management in low-resource environments.',
    status: 'active',
  },
  {
    id: 'checkmysmile',
    title: 'CheckMySmile',
    subtitle: 'Mobile Dental Health Application',
    tags: ['MIT App Inventor', 'Mobile Health', 'Dentistry'],
    description: 'Mobile health concept focused on oral healthcare awareness and preventive dentistry.',
    status: 'concept',
  },
  {
    id: 'kuhes-bank',
    title: 'KUHeS Knowledge Bank',
    subtitle: 'Student Academic Infrastructure',
    tags: ['Digital Archive', 'Education', 'Collaboration'],
    description: 'Student-centered digital archive system for organized learning resources.',
    status: 'planning',
  },
  {
    id: 'sendme',
    title: 'SendMe',
    subtitle: 'Digital Communication Platform',
    tags: ['Communication', 'UX Design', 'Web App'],
    description: 'Exploring digital communication, system usability, and workflow simplification.',
    status: 'experiment',
  },
]

export default function ProjectsPage() {
  const [filter, setFilter] = useState('all')

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.status === filter)

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Building systems that solve real problems in healthcare, education, and communication
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['all', 'active', 'concept', 'planning', 'experiment'].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full capitalize transition-all duration-300 ${
                filter === category
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-teal-500/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/projects/${project.id}`}>
                <div className="group h-full p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 card-hover cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <project.icon size={40} className="text-teal-500" />
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      project.status === 'active' ? 'bg-green-500/20 text-green-500' :
                      project.status === 'concept' ? 'bg-amber-500/20 text-amber-500' :
                      'bg-gray-500/20 text-gray-500'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-1 group-hover:text-teal-500 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-teal-500 text-sm mb-3">{project.subtitle}</p>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2 text-teal-500 font-medium group-hover:gap-3 transition-all">
                    Learn more <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}