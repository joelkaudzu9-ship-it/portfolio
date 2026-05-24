'use client'

import { GraduationCap, BookOpen, Code, Database, Cloud, PenTool, Brain } from 'lucide-react'

export default function EducationPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Education & <span className="gradient-text-gold">Skills</span>
          </h1>
        </div>

        {/* Education */}
        <div className="mb-12 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap size={32} className="text-amber-500" />
            <div>
              <h2 className="text-2xl font-bold">Kamuzu University of Health Sciences (KUHeS)</h2>
              <p className="text-amber-500">Bachelor of Dental Surgery (BDS)</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {['Human Biology', 'Medical Sciences', 'Healthcare Systems', 'Oral Health', 'Diagnostics', 'Physiology', 'Anatomy', 'Preventive Healthcare', 'Clinical Foundations', 'Public Health Concepts'].map((subject) => (
              <div key={subject} className="p-2 text-center bg-white dark:bg-gray-800 rounded-lg text-sm">
                {subject}
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skills */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Code className="text-amber-500" /> Programming & Software Development</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Python', 'Flask', 'HTML', 'CSS', 'JavaScript', 'MIT App Inventor', 'Front-End Dev', 'API Integration'].map((skill) => (
              <div key={skill} className="p-3 text-center bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-800">
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure & Tools */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Database className="text-amber-500" /> Infrastructure & Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['GitHub', 'VS Code', 'Supabase', 'Render', 'Cloud Deployment', 'API Concepts'].map((tool) => (
              <div key={tool} className="p-3 text-center bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-800">
                {tool}
              </div>
            ))}
          </div>
        </div>

        {/* Design & Creative */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><PenTool className="text-amber-500" /> Design & Creative</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Canva', 'CapCut', 'Graphic Design', 'Presentation Design', 'Visual Communication', 'Storytelling'].map((skill) => (
              <div key={skill} className="p-3 text-center bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-800">
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Personal Strengths */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-teal-500/10 to-amber-500/10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Brain className="text-amber-500" /> Personal Strengths</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Strong self-learning ability', 'Interdisciplinary thinking', 'Deep curiosity',
              'Adaptability across fields', 'Long-focus work capacity', 'Strong communication',
              'Emotional intelligence', 'Creativity & storytelling', 'Mission-driven mindset',
              'Leadership orientation', 'Persistence under uncertainty', 'Systems-oriented thinking'
            ].map((strength) => (
              <div key={strength} className="flex items-center gap-2 text-sm">
                <span className="text-amber-500">✓</span> {strength}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}