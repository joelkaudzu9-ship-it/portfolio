'use client'

import { motion } from 'framer-motion'
import { Target, Heart, Globe, TrendingUp, Users, Shield, Zap, Coffee } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Innovation',
    description: 'I believe technology and creativity should solve real-world problems rather than merely impress people.',
    color: 'text-amber-500'
  },
  {
    icon: Heart,
    title: 'Accessibility',
    description: 'The best solutions are the ones accessible to ordinary people regardless of language, location, or economic status.',
    color: 'text-red-500'
  },
  {
    icon: Shield,
    title: 'Faith',
    description: 'My faith in Jesus Christ shapes my perspective, resilience, discipline, and desire to serve others meaningfully.',
    color: 'text-blue-500'
  },
  {
    icon: TrendingUp,
    title: 'Impact',
    description: 'I care deeply about creating systems and opportunities that improve lives beyond my own personal success.',
    color: 'text-green-500'
  },
  {
    icon: Zap,
    title: 'Continuous Growth',
    description: 'I believe learning should never stop. If knowledge can help solve a problem, I am willing to learn it.',
    color: 'text-purple-500'
  },
  {
    icon: Coffee,
    title: 'Discipline',
    description: 'Consistency beats intensity. Small, daily actions compound into remarkable results over time.',
    color: 'text-cyan-500'
  }
]

export default function ValuesPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container-custom max-w-4xl px-4 sm:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 mb-4">
            <Target size={28} className="text-amber-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Core Values
          </h1>
          <p className="text-text-muted mt-3 max-w-xl mx-auto">
            Principles that shape every project I build and every problem I solve.
          </p>
        </motion.div>

        <div className="space-y-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <value.icon size={32} className={value.color} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary mb-2 group-hover:text-amber-500 transition-colors">
                    {value.title}
                  </h2>
                  <p className="text-text-secondary leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 p-6 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center"
        >
          <p className="text-text-secondary italic">
            "Technology and knowledge should serve people, not merely impress them."
          </p>
          <p className="text-text-muted text-sm mt-2">— My guiding philosophy</p>
        </motion.div>
      </div>
    </div>
  )
}