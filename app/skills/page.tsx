'use client'

import { motion } from 'framer-motion'
import { Code, Database, Layout, Cloud, GitBranch, PenTool, Brain, Users, TrendingUp } from 'lucide-react'

const skillCategories = [
  {
    title: 'Programming & Development',
    icon: Code,
    color: 'text-blue-500',
    skills: ['Python', 'Flask', 'HTML', 'CSS', 'JavaScript (Foundational)', 'MIT App Inventor', 'Front-End Development']
  },
  {
    title: 'Infrastructure & Tools',
    icon: Cloud,
    color: 'text-cyan-500',
    skills: ['GitHub', 'VS Code', 'Supabase', 'Render', 'Cloud Deployment Concepts', 'API Integration']
  },
  {
    title: 'Database',
    icon: Database,
    color: 'text-green-500',
    skills: ['PostgreSQL', 'Supabase', 'Data Modeling']
  },
  {
    title: 'Version Control',
    icon: GitBranch,
    color: 'text-orange-500',
    skills: ['Git', 'GitHub', 'Collaborative Workflows']
  },
  {
    title: 'Design & Creative',
    icon: PenTool,
    color: 'text-purple-500',
    skills: ['Graphic Design', 'Presentation Design', 'Visual Communication', 'Canva', 'CapCut']
  },
  {
    title: 'Productivity',
    icon: Layout,
    color: 'text-amber-500',
    skills: ['Microsoft Office', 'Google Workspace', 'Project Management']
  },
  {
    title: 'Soft Skills',
    icon: Users,
    color: 'text-pink-500',
    skills: ['Leadership', 'Communication', 'Team Collaboration', 'Problem Solving', 'Systems Thinking']
  },
  {
    title: 'Research & Innovation',
    icon: Brain,
    color: 'text-indigo-500',
    skills: ['Problem Analysis', 'Systems Thinking', 'Healthcare Technology', 'Innovation Frameworks']
  }
]

export default function SkillsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container-custom max-w-5xl px-4 sm:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 mb-4">
            <Code size={28} className="text-amber-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Skills & Expertise
          </h1>
          <p className="text-text-muted mt-3 max-w-xl mx-auto">
            What I bring to the table — technical, creative, and interpersonal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-800">
                <category.icon size={20} className={category.color} />
                <h2 className="font-semibold text-text-primary">{category.title}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-text-secondary">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 rounded-xl bg-amber-500/5 border border-amber-500/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-amber-500" />
            <h2 className="text-lg font-semibold text-text-primary">Personal Strengths</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'Strong self-learning ability', 'Interdisciplinary thinking', 'Deep curiosity',
              'Adaptability across fields', 'Long-focus work capacity', 'Strong communication',
              'Emotional intelligence', 'Creativity', 'Mission-driven mindset', 'Systems thinking'
            ].map((strength) => (
              <span key={strength} className="px-2.5 py-1 text-xs rounded-full bg-amber-500/10 text-amber-500">
                {strength}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}