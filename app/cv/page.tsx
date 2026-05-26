'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Printer, Copy, CheckCircle, Mail, Phone, MapPin, Globe, Award, BookOpen, Heart, Target, Sparkles, FileText, Calendar, Briefcase, Code, Users, MessageCircle, Activity, PenTool } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import Link from 'next/link'

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
      <div className="container-custom max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header Buttons */}
        <div className="flex flex-wrap justify-end gap-3 mb-6 no-print">
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
          className="bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:bg-white"
        >
          {/* Header Section with Photo */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 print:bg-gray-800 px-6 sm:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
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
              
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">Joel George Kaudzu</h1>
                <p className="text-amber-200 text-lg mt-1">Dental Surgery Student | Health-Tech Builder | Innovation Coordinator | Poet</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">Healthcare Innovator</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">Digital Health Builder</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">AI Enthusiast</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">Published Poet</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Bar */}
          <div className="bg-gray-50 print:bg-gray-100 px-6 sm:px-8 py-3 border-b border-gray-200">
            <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin size={14} className="text-amber-500" /> Blantyre, Malawi
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Phone size={14} className="text-amber-500" /> +265 983 142 415
              </div>
              <div className="flex items-center gap-1">
                <Mail size={14} className="text-amber-500" />
                <button onClick={handleCopyEmail} className="text-gray-600 hover:text-amber-500 transition-colors">
                  joelkaudzu9@gmail.com
                </button>
                {copied && <CheckCircle size={12} className="text-green-500" />}
              </div>
              <div className="flex items-center gap-1">
                <Globe size={14} className="text-amber-500" />
                <a href="https://joelkaudzu-portfolio.vercel.app" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-500 transition-colors">
                  joelkaudzu-portfolio.vercel.app
                </a>
              </div>
              <div className="flex items-center gap-1">
                <FaGithub size={14} className="text-amber-500" />
                <a href="https://github.com/joelkaudzu9-ship-it" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-500 transition-colors">
                  github.com/joelkaudzu9-ship-it
                </a>
              </div>
              <div className="flex items-center gap-1">
                <FaLinkedin size={14} className="text-amber-500" />
                <a href="https://www.linkedin.com/in/joel-kaudzu-0bba48392" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-500 transition-colors">
                  linkedin.com/in/joel-kaudzu
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 sm:px-8 py-6">
            
            {/* Professional Summary */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-amber-600 flex items-center gap-2 mb-3">
                <Sparkles size={18} /> Professional Summary
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                Dental Surgery student at Kamuzu University of Health Sciences with a passion for healthcare innovation, 
                systems thinking, and digital health. Creator of <strong>MoyoWanga</strong> — a multilingual chronic disease 
                support ecosystem for low-resource environments. Experienced in building practical systems that bridge healthcare 
                gaps, with strong foundations in software development, leadership, and community-centered innovation. 
                Published poet with deep emotional intelligence and communication skills.
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div>
                {/* Education */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-600 flex items-center gap-2 mb-3">
                    <BookOpen size={16} /> Education
                  </h2>
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900">Bachelor of Dental Surgery (BDS)</h3>
                    <p className="text-amber-600 text-sm">Kamuzu University of Health Sciences (KUHeS)</p>
                    <p className="text-gray-500 text-xs">Present · First Year</p>
                    <p className="text-gray-600 text-xs mt-1">
                      Medical Sciences | Human Biology | Healthcare Systems | Diagnostics | Oral Health | Research
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Malawi School Certificate of Education (MSCE)</h3>
                    <p className="text-amber-600 text-sm">Dedza Secondary School</p>
                    <p className="text-gray-500 text-xs">2022</p>
                  </div>
                </div>

                {/* Technical Skills */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-600 flex items-center gap-2 mb-3">
                    <Code size={16} /> Technical Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'Flask', 'PostgreSQL', 'Supabase', 'HTML/CSS', 'JavaScript', 'Next.js', 'React', 'Tailwind CSS', 'REST APIs', 'Git/GitHub', 'Cloudinary', "Africa's Talking API"].map(skill => (
                      <span key={skill} className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Featured Projects */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-600 flex items-center gap-2 mb-3">
                    <Target size={16} /> Featured Projects
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">MoyoWanga</h3>
                      <p className="text-amber-600 text-xs">Multilingual Chronic Disease Support Ecosystem</p>
                      <p className="text-gray-600 text-xs mt-1">
                        Hybrid digital health platform with SMS infrastructure supporting 6 languages (Chichewa, Tumbuka, Yao, Chisena, Chilomwe, English). 
                        Features daily medication reminders, two-way SMS, CHW dashboard, and adherence tracking.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-xs text-gray-500">Tech: Python, Flask, PostgreSQL, Africa's Talking API</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">CheckMySmile</h3>
                      <p className="text-amber-600 text-xs">AI-Powered Oral Health Screening System</p>
                      <p className="text-gray-600 text-xs mt-1">
                        AI system analyzing oral images for gingivitis, cavities, plaque, and bleeding gums.
                      </p>
                      <p className="text-gray-600 text-xs">Training accuracy: 92.3% | Validation: 94.2%</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">SendMe</h3>
                      <p className="text-amber-600 text-xs">Campus Task Marketplace for KUHeS</p>
                      <p className="text-gray-600 text-xs mt-1">
                        PWA enabling students to post tasks (Help Me, Send Me, Deliver, Group Buy), coordinate via chat, and build reputation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Certifications & Achievements */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-600 flex items-center gap-2 mb-3">
                    <Award size={16} /> Certifications & Achievements
                  </h2>
                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-700 text-sm">✓ Own Your Path Mentorship Program - Girl Up Elevate (2025)</p>
                      <p className="text-gray-500 text-xs ml-4">Team Everest - Eco Bag Initiative for plastic waste reduction</p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-sm">✓ Men of Courage Conference - Powerhouse International Church (2026)</p>
                      <p className="text-gray-500 text-xs ml-4">Leadership, integrity, and personal development</p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-sm">✓ Diagnostics Workshop - Malawi Liverpool Wellcome Trust (2026)</p>
                      <p className="text-gray-500 text-xs ml-4">Frugal innovation with Assoc. Prof. Manu Prakash</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Leadership & Involvement */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-600 flex items-center gap-2 mb-3">
                    <Users size={16} /> Leadership & Involvement
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">Innovations Coordinator</h3>
                      <p className="text-amber-600 text-sm">Science For All — KUHeS</p>
                      <p className="text-gray-600 text-xs">Coordinating innovation initiatives, supporting student innovators, facilitating collaboration</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Graphic Designer</h3>
                      <p className="text-amber-600 text-sm">KUHeS Publications Team</p>
                      <p className="text-gray-600 text-xs">Visual communication, poster design, presentation graphics, digital media support</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Student Teacher</h3>
                      <p className="text-amber-600 text-sm">Bright Future Private Academy</p>
                      <p className="text-gray-600 text-xs">Lesson delivery, student mentorship, academic support, classroom coordination</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Peer Mentor</h3>
                      <p className="text-amber-600 text-sm">KUHeS Student Community</p>
                      <p className="text-gray-600 text-xs">Academic guidance, peer support, collaborative learning, growth-oriented culture</p>
                    </div>
                  </div>
                </div>

                {/* Soft Skills */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-600 flex items-center gap-2 mb-3">
                    <Heart size={16} /> Soft Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {['Leadership', 'Communication', 'Systems Thinking', 'Problem Solving', 'Team Collaboration', 'Emotional Intelligence', 'Creative Writing', 'Public Speaking', 'Adaptability', 'Resilience'].map(skill => (
                      <span key={skill} className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Core Values */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-600 flex items-center gap-2 mb-3">
                    <Target size={16} /> Core Values
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {['Innovation', 'Accessibility', 'Faith', 'Impact', 'Continuous Growth', 'Discipline', 'Integrity', 'Excellence'].map(value => (
                      <span key={value} className="px-2 py-1 bg-amber-50 rounded-md text-xs text-amber-700">{value}</span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-600 flex items-center gap-2 mb-3">
                    <MessageCircle size={16} /> Languages
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">English (Fluent)</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">Chichewa (Native)</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">Tumbuka (Conversational)</span>
                  </div>
                </div>

                {/* Creative Work - Poetry */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-600 flex items-center gap-2 mb-3">
                    <PenTool size={16} /> Creative Work
                  </h2>
                  <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-500">
                    <p className="text-gray-700 text-xs italic">
                      <strong>"Threads of Becoming"</strong> — A poetry collection exploring life, growth, and struggle. 
                      13 poems across 4 sections: Broken and Becoming, Light Through the Storm, Infinite Thoughts, 
                      and Society and Reality Check.
                    </p>
                    <p className="text-gray-600 text-xs mt-2">
                      Poetry has shaped my communication ability, emotional intelligence, and perspective as a creator.
                    </p>
                  </div>
                </div>

                {/* Conferences & Workshops */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-amber-600 flex items-center gap-2 mb-3">
                    <Calendar size={16} /> Conferences & Workshops
                  </h2>
                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-700 text-sm">CEOs, Founders & Builders Summit</p>
                      <p className="text-gray-500 text-xs">VERY LIFE FOUNDATION Launch - KUHeS (2026)</p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-sm">Men of Courage Conference</p>
                      <p className="text-gray-500 text-xs">Powerhouse International Church - Golden Peacock Hotel (2026)</p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-sm">Diagnostics Workshop</p>
                      <p className="text-gray-500 text-xs">Malawi Liverpool Wellcome Trust with Assoc. Prof. Manu Prakash (2026)</p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-sm">Own Your Path Mentorship Program</p>
                      <p className="text-gray-500 text-xs">Girl Up Elevate - Team Everest (2025)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <h2 className="text-lg font-bold text-amber-600 flex items-center gap-2 mb-2">
                <Heart size={16} /> Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {['Healthcare Innovation', 'Digital Health', 'AI in Medicine', 'Systems Thinking', 'Creative Writing', 'Poetry', 'Graphic Design', 'Mentorship', 'Leadership Development'].map(interest => (
                  <span key={interest} className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">{interest}</span>
                ))}
              </div>
            </div>

            {/* Quote Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-sm italic">
                "Every problem becomes temporary once you prove to yourself that you can build something real from nothing."
              </p>
              <p className="text-amber-600 text-xs mt-1">— Joel George Kaudzu</p>
            </div>
          </div>
        </motion.div>

        <style jsx global>{`
          @media print {
            body {
              background: white;
              padding: 0;
              margin: 0;
            }
            .no-print {
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
              color: #000 !important;
            }
            .text-amber-600 {
              color: #b45309 !important;
            }
            .bg-amber-50 {
              background-color: #fffbeb !important;
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

//eee