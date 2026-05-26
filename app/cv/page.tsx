'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Printer, Copy, CheckCircle, Mail, Phone, MapPin, Globe, Award, BookOpen, Heart, Target, Sparkles, Code, Briefcase, Users } from 'lucide-react'

export default function CVPage() {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('joelkaudzu9@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPDF = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header Buttons */}
        <div className="flex flex-wrap justify-end gap-3 mb-6 print:hidden">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:scale-105 transition-all font-medium text-sm shadow-lg"
          >
            <Download size={16} /> Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-amber-500/50 hover:text-amber-500 transition-all text-sm font-medium"
          >
            <Printer size={16} /> Print
          </button>
        </div>

        {/* CV Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 print:shadow-none print:border-0"
        >
          {/* Header Section with Photo */}
          <div className="relative bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-700 dark:to-amber-900 px-6 sm:px-8 py-8 print:bg-gray-800">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                  <img 
                    src="https://res.cloudinary.com/dfth3jtai/image/upload/f_auto,q_auto,w_200/v1779548992/portfolio/blog/bzdosudki23egb98s6t6.jpg"
                    alt="Joel George Kaudzu"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
              </div>
              
              {/* Name & Title */}
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">Joel George Kaudzu</h1>
                <p className="text-amber-200 text-lg mt-1">Dental Surgery Student | Health-Tech Builder | Innovation Coordinator</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">Healthcare Innovator</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">Digital Health Builder</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">Poet</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Bar */}
          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 sm:px-8 py-3 border-b border-gray-200 dark:border-gray-700 print:bg-gray-100">
            <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <MapPin size={14} /> Lilongwe, Malawi
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Phone size={14} /> +265 983 142 415
              </div>
              <div className="flex items-center gap-1">
                <Mail size={14} className="text-amber-500" />
                <button onClick={handleCopyEmail} className="text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-colors">
                  joelkaudzu9@gmail.com
                </button>
                {copied && <CheckCircle size={12} className="text-green-500" />}
              </div>
              <div className="flex items-center gap-1">
                <Globe size={14} className="text-amber-500" />
                <a href="https://joelkaudzu-portfolio.vercel.app" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-colors">
                  Portfolio
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase size={14} className="text-amber-500" />
                <a href="https://github.com/joelkaudzu9-ship-it" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-colors">
                  GitHub
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} className="text-amber-500" />
                <a href="https://www.linkedin.com/in/joel-kaudzu-0bba48392" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 sm:px-8 py-6">
            
            {/* Professional Summary */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2 mb-3">
                <Sparkles size={18} /> Professional Summary
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Dental Surgery student at Kamuzu University of Health Sciences with a passion for healthcare innovation, 
                systems thinking, and digital health. Creator of <strong>MoyoWanga</strong> — a multilingual chronic disease 
                support ecosystem for low-resource environments. Experienced in building practical systems that bridge healthcare 
                gaps, with strong foundations in software development, leadership, and community-centered innovation.
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div>
                {/* Education */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2 mb-3">
                    <BookOpen size={16} /> Education
                  </h2>
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Bachelor of Dental Surgery (BDS)</h3>
                    <p className="text-amber-500 text-sm">Kamuzu University of Health Sciences (KUHeS)</p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs">Present · First Year</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                      Medical Sciences | Human Biology | Healthcare Systems | Diagnostics | Oral Health | Research
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Malawi School Certificate of Education</h3>
                    <p className="text-amber-500 text-sm">Dedza Secondary School</p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs">2022</p>
                  </div>
                </div>

                {/* Technical Skills */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2 mb-3">
                    <Code size={16} /> Technical Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'Flask', 'PostgreSQL', 'Supabase', 'HTML/CSS', 'JavaScript', 'Next.js', 'React', 'Tailwind CSS', 'REST APIs', 'Git/GitHub', 'Cloudinary'].map(skill => (
                      <span key={skill} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs text-gray-700 dark:text-gray-300">{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Featured Projects */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2 mb-3">
                    <Target size={16} /> Featured Projects
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">MoyoWanga</h3>
                      <p className="text-amber-500 text-xs">Multilingual Chronic Disease Support Ecosystem</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                        Hybrid digital health platform with SMS infrastructure supporting 6 languages. Deployed and operational.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">CheckMySmile</h3>
                      <p className="text-amber-500 text-xs">AI-Powered Oral Health Screening</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                        Training accuracy: 92.3% | Validation: 94.2% | Smile Assistant chatbot
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">SendMe</h3>
                      <p className="text-amber-500 text-xs">Campus Task Marketplace</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                        PWA for KUHeS students with 4 task types, group buys, ride-sharing, and in-app chat
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Leadership */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2 mb-3">
                    <Award size={16} /> Leadership & Involvement
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Innovations Coordinator</h3>
                      <p className="text-amber-500 text-xs">Science For All — KUHeS</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Coordinating innovation initiatives and supporting student innovators</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Graphic Designer</h3>
                      <p className="text-amber-500 text-xs">KUHeS Publications Team</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Visual communication, poster design, presentation graphics</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Student Teacher</h3>
                      <p className="text-amber-500 text-xs">Bright Future Private Academy</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Lesson delivery, student mentorship, academic support</p>
                    </div>
                  </div>
                </div>

                {/* Soft Skills & Values */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2 mb-3">
                    <Heart size={16} /> Core Values
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {['Innovation', 'Accessibility', 'Faith', 'Impact', 'Continuous Growth', 'Discipline'].map(value => (
                      <span key={value} className="px-2 py-1 bg-amber-50 dark:bg-amber-950/30 rounded-md text-xs text-amber-600 dark:text-amber-400">{value}</span>
                    ))}
                  </div>
                </div>

                {/* Conferences */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2 mb-3">
                    <Globe size={16} /> Conferences & Workshops
                  </h2>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Diagnostics Workshop</h3>
                    <p className="text-amber-500 text-xs">Malawi Liverpool Wellcome Trust · 2026</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">Frugal innovation with Assoc. Prof. Manu Prakash</p>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Men of Courage Conference</h3>
                    <p className="text-amber-500 text-xs">Powerhouse International Church · 2026</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">Leadership, integrity, and personal development</p>
                  </div>
                </div>

                {/* Creative Work */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2 mb-3">
                    <BookOpen size={16} /> Creative Work
                  </h2>
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border-l-4 border-amber-500">
                    <p className="text-gray-700 dark:text-gray-300 text-xs italic">
                      <strong>"Threads of Becoming"</strong> — A poetry collection exploring life, growth, and struggle. 
                      13 poems across 4 sections. Poetry has shaped my emotional intelligence and perspective as a creator.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                "Every problem becomes temporary once you prove to yourself that you can build something real from nothing."
              </p>
              <p className="text-amber-500 text-xs mt-1">— Joel George Kaudzu</p>
            </div>
          </div>
        </motion.div>

        {/* Print CSS for better PDF output */}
        <style jsx global>{`
          @media print {
            body {
              background: white;
              padding: 0;
              margin: 0;
            }
            .print\\:hidden {
              display: none !important;
            }
            .bg-gradient-to-r {
              background: #1a1a1a !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .shadow-2xl {
              box-shadow: none !important;
            }
            a {
              text-decoration: none !important;
            }
            button {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  )
}