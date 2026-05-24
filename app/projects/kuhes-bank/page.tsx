'use client'

import { ArrowLeft, BookOpen, Users, Brain, Target } from 'lucide-react'
import Link from 'next/link'

export default function KuhesBankPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        <Link href="/projects" className="inline-flex items-center gap-2 text-text-secondary hover:text-amber-500 mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Projects
        </Link>

        <div>
          <span className="text-amber-500 text-sm font-semibold tracking-wide uppercase">Student Academic Infrastructure</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-2 mb-4">
            KUHeS <span className="gradient-text-gold">Knowledge Bank</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mb-8">
            Student-centered digital archive system for organized learning resources and collaboration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-bold mb-3">Project Vision</h2>
              <p className="text-text-secondary leading-relaxed">
                The KUHeS Knowledge Bank was conceptualized as a student-centered digital archive system aimed at 
                improving academic accessibility through organized learning resources, collaborative learning, 
                structured information access, and educational infrastructure support.
              </p>
            </div>
          </div>

          <div>
            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Target className="text-amber-500" size={20} /> Core Themes</h2>
              <ul className="space-y-2 text-text-secondary">
                <li>• Knowledge accessibility</li>
                <li>• Student collaboration</li>
                <li>• Educational systems</li>
                <li>• Academic infrastructure</li>
                <li>• Information organization</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Brain className="text-amber-500" size={20} /> Long-Term Possibilities</h2>
          <p className="text-text-secondary">
            Searchable academic repositories, peer collaboration systems, educational AI assistance, 
            and structured institutional knowledge management.
          </p>
        </div>
      </div>
    </div>
  )
}