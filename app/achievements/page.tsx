'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Award, 
  Calendar, 
  ExternalLink, 
  Medal,
  ImageIcon,
  Sparkles
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

// Map achievement titles to icons
const getIconForTitle = (title: string) => {
  const lower = title.toLowerCase()
  if (lower.includes('workshop') || lower.includes('conference')) return Award
  if (lower.includes('science fair')) return Medal
  return Sparkles
}

type Achievement = {
  id: number
  title: string
  description: string
  date: string
  image_url: string | null
  link_url: string | null
  is_active: boolean
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/achievements')
      .then(res => res.json())
      .then(data => {
        setAchievements(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container-custom max-w-5xl">
        
        {/* Header */}
        <motion.div {...fadeInUp} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-gold/10 mb-4">
            <Medal size={32} className="text-accent-gold" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Achievements & <span className="gradient-text-gold">Recognition</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Certificates, awards, and milestones along my journey as a healthcare innovator.
          </p>
        </motion.div>

        {/* Achievements Grid */}
        {achievements.length === 0 ? (
          <div className="text-center py-12 glass-card">
            <p className="text-text-secondary">No achievements added yet.</p>
          </div>
        ) : (
          <motion.div 
            {...fadeInUp} 
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {achievements.map((item, index) => {
              const Icon = getIconForTitle(item.title)
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-surface/50 border border-border rounded-xl overflow-hidden hover:border-accent-gold/30 transition-all hover:shadow-lg hover:shadow-accent-gold/5"
                >
                  {/* Image Section */}
                  {item.image_url && (
                    <div 
                      className="relative h-48 overflow-hidden cursor-pointer"
                      onClick={() => setSelectedImage(item.image_url!)}
                    >
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm flex items-center gap-1">
                          <ImageIcon size={16} /> Click to enlarge
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-accent-gold/10 group-hover:bg-accent-gold/20 transition-colors flex-shrink-0">
                        <Icon size={20} className="text-accent-gold" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary group-hover:text-accent-gold transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-text-muted text-sm flex items-center gap-1 mt-1">
                          <Calendar size={12} />
                          {item.date}
                        </p>
                        <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                          {item.description}
                        </p>
                        {item.link_url && (
                          <a
                            href={item.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-accent-gold text-sm mt-3 hover:underline"
                          >
                            View certificate <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Image Lightbox */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-accent-gold transition-colors"
            >
              ✕
            </button>
            <img 
              src={selectedImage} 
              alt="Achievement certificate"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </div>
  )
}