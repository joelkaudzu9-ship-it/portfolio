'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Users, Brain, Target } from 'lucide-react'
import Link from 'next/link'

export default function KuhesBankPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        <Link href="/projects" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-gold mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Projects
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-accent-gold text-sm font-semibold tracking-wide uppercase">Student Academic Infrastructure</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-2 mb-4">
            KUHeS <span className="gradient-text-gold">Knowledge Bank</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mb-8">
            Student-centered digital archive system for organized learning resources and collaboration
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-bold mb-3">Project Vision</h2>
              <p className="text-text-secondary leading-relaxed">
                The KUHeS Knowledge Bank was conceptualized as a student-centered digital archive system aimed at 
                improving academic accessibility through organized learning resources, collaborative learning, 
                structured information access, and educational infrastructure support.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Target className="text-accent-gold" size={20} /> Core Themes</h2>
              <ul className="space-y-2 text-text-secondary">
                <li>• Knowledge accessibility</li>
                <li>• Student collaboration</li>
                <li>• Educational systems</li>
                <li>• Academic infrastructure</li>
                <li>• Information organization</li>
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-accent-gold/10 to-transparent border border-accent-gold/20"
        >
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Brain className="text-accent-gold" size={20} /> Long-Term Possibilities</h2>
          <p className="text-text-secondary">
            Searchable academic repositories, peer collaboration systems, educational AI assistance, 
            and structured institutional knowledge management.
          </p>
        </motion.div>
      </div>
    </div>
  )
}