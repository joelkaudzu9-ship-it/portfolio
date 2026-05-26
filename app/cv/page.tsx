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
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 print:bg-gray-800 px-6 sm:px-8 py-6 print:py-3">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                  <img 
                    src="https://res.cloudinary.com/dfth3jtai/image/upload/f_auto,q_auto,w_200/v1779548992/portfolio/blog/bzdosudki23egb98s6t6.jpg"
                    alt="Joel George Kaudzu"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Joel George Kaudzu</h1>
                <p className="text-amber-200 text-base sm:text-lg mt-1">Dental Surgery Student | Health-Tech Builder | Innovation Coordinator | Poet</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">Healthcare Innovator</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">Digital Health Builder</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">AI Enthusiast</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">Published Poet</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Bar */}
          <div className="bg-gray-50 print:bg-gray-100 px-6 sm:px-8 py-2 border-b border-gray-200">
            <div className="flex flex-wrap justify-center gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin size={12} className="text-amber-500" /> Blantyre, Malawi
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Phone size={12} className="text-amber-500" /> +265 983 142 415
              </div>
              <div className="flex items-center gap-1">
                <Mail size={12} className="text-amber-500" />
                <button onClick={handleCopyEmail} className="text-gray-600 hover:text-amber-500 transition-colors">
                  joelkaudzu9@gmail.com
                </button>
                {copied && <CheckCircle size={10} className="text-green-500" />}
              </div>
              <div className="flex items-center gap-1">
                <Globe size={12} className="text-amber-500" />
                <a href="https://joelkaudzu-portfolio.vercel.app" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-500 transition-colors">
                  Portfolio
                </a>
              </div>
              <div className="flex items-center gap-1">
                <FaGithub size={12} className="text-amber-500" />
                <a href="https://github.com/joelkaudzu9-ship-it" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-500 transition-colors">
                  GitHub
                </a>
              </div>
              <div className="flex items-center gap-1">
                <FaLinkedin size={12} className="text-amber-500" />
                <a href="https://www.linkedin.com/in/joel-kaudzu-0bba48392" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-500 transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 sm:px-8 py-4 print:py-2">
            
            {/* Professional Summary */}
            <div className="mb-4 print:mb-2">
              <h2 className="text-base font-bold text-amber-600 flex items-center gap-2 mb-2 print:mb-1">
                <Sparkles size={14} /> Professional Summary
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
              
              {/* Left Column */}
              <div>
                {/* Education */}
                <div className="mb-4 print:mb-2">
                  <h2 className="text-base font-bold text-amber-600 flex items-center gap-2 mb-2 print:mb-1">
                    <BookOpen size={14} /> Education
                  </h2>
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">Bachelor of Dental Surgery (BDS)</h3>
                    <p className="text-amber-600 text-xs">Kamuzu University of Health Sciences (KUHeS)</p>
                    <p className="text-gray-500 text-xs">Present · First Year</p>
                    <p className="text-gray-600 text-xs mt-1">
                      Medical Sciences | Human Biology | Healthcare Systems | Diagnostics | Oral Health | Research
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Malawi School Certificate of Education (MSCE)</h3>
                    <p className="text-amber-600 text-xs">Dedza Secondary School</p>
                    <p className="text-gray-500 text-xs">2022</p>
                  </div>
                </div>

                {/* Technical Skills */}
                <div className="mb-4 print:mb-2">
                  <h2 className="text-base font-bold text-amber-600 flex items-center gap-2 mb-2 print:mb-1">
                    <Code size={14} /> Technical Skills
                  </h2>
                  <div className="flex flex-wrap gap-1">
                    {['Python', 'Flask', 'PostgreSQL', 'Supabase', 'HTML/CSS', 'JavaScript', 'Next.js', 'React', 'Tailwind CSS', 'REST APIs', 'Git/GitHub', 'Cloudinary', "Africa's Talking API"].map(skill => (
                      <span key={skill} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-700">{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Featured Projects */}
                <div className="mb-4 print:mb-2">
                  <h2 className="text-base font-bold text-amber-600 flex items-center gap-2 mb-2 print:mb-1">
                    <Target size={14} /> Featured Projects
                  </h2>
                  <div className="space-y-3 print:space-y-1">
                    {/* MoyoWanga */}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">MoyoWanga</h3>
                      <p className="text-amber-600 text-xs">Multilingual Chronic Disease Support Ecosystem</p>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                        Hybrid digital health platform with SMS infrastructure supporting 6 languages (Chichewa, Tumbuka, Yao, Chisena, Chilomwe, English). 
                        Features daily medication reminders, two-way SMS, CHW dashboard, and adherence tracking.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Python</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Flask</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">PostgreSQL</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Africa's Talking API</span>
                      </div>
                    </div>

                    <hr className="border-gray-200 my-2 print:my-1" />

                    {/* CheckMySmile */}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">CheckMySmile</h3>
                      <p className="text-amber-600 text-xs">AI-Powered Oral Health Screening System</p>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                        AI system analyzing oral images for gingivitis, cavities, plaque, and bleeding gums.
                      </p>
                      <p className="text-gray-600 text-xs">Training accuracy: 92.3% | Validation: 94.2%</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Python</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">TensorFlow</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Computer Vision</span>
                      </div>
                    </div>

                    <hr className="border-gray-200 my-2 print:my-1" />

                    {/* SendMe */}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">SendMe</h3>
                      <p className="text-amber-600 text-xs">Campus Task Marketplace for KUHeS</p>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                        PWA enabling students to post tasks (Help Me, Send Me, Deliver, Group Buy), coordinate via chat, and build reputation.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Python</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Flask</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Supabase</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Firebase</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certifications & Achievements */}
                <div className="mb-4 print:mb-2">
                  <h2 className="text-base font-bold text-amber-600 flex items-center gap-2 mb-2 print:mb-1">
                    <Award size={14} /> Certifications & Achievements
                  </h2>
                  <div className="space-y-1">
                    <div>
                      <p className="text-gray-700 text-xs">✓ Own Your Path Mentorship Program - Girl Up Elevate (2025)</p>
                      <p className="text-gray-500 text-xs ml-4">Team Everest - Eco Bag Initiative</p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-xs">✓ Men of Courage Conference - Powerhouse International Church (2026)</p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-xs">✓ Diagnostics Workshop - Malawi Liverpool Wellcome Trust (2026)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Leadership & Involvement */}
                <div className="mb-4 print:mb-2">
                  <h2 className="text-base font-bold text-amber-600 flex items-center gap-2 mb-2 print:mb-1">
                    <Users size={14} /> Leadership & Involvement
                  </h2>
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Innovations Coordinator</h3>
                      <p className="text-amber-600 text-xs">Science For All — KUHeS</p>
                      <p className="text-gray-600 text-xs">Coordinating innovation initiatives, supporting student innovators</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Graphic Designer</h3>
                      <p className="text-amber-600 text-xs">KUHeS Publications Team</p>
                      <p className="text-gray-600 text-xs">Visual communication, poster design, presentation graphics</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Student Teacher</h3>
                      <p className="text-amber-600 text-xs">Bright Future Private Academy</p>
                      <p className="text-gray-600 text-xs">Lesson delivery, student mentorship, academic support</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Peer Mentor</h3>
                      <p className="text-amber-600 text-xs">KUHeS Student Community</p>
                      <p className="text-gray-600 text-xs">Academic guidance, peer support, collaborative learning</p>
                    </div>
                  </div>
                </div>

                {/* Soft Skills */}
                <div className="mb-4 print:mb-2">
                  <h2 className="text-base font-bold text-amber-600 flex items-center gap-2 mb-2 print:mb-1">
                    <Heart size={14} /> Soft Skills
                  </h2>
                  <div className="flex flex-wrap gap-1">
                    {['Leadership', 'Communication', 'Systems Thinking', 'Problem Solving', 'Team Collaboration', 'Emotional Intelligence', 'Creative Writing', 'Public Speaking', 'Adaptability', 'Resilience'].map(skill => (
                      <span key={skill} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-700">{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Core Values */}
                <div className="mb-4 print:mb-2">
                  <h2 className="text-base font-bold text-amber-600 flex items-center gap-2 mb-2 print:mb-1">
                    <Target size={14} /> Core Values
                  </h2>
                  <div className="flex flex-wrap gap-1">
                    {['Innovation', 'Accessibility', 'Faith', 'Impact', 'Continuous Growth', 'Discipline', 'Integrity', 'Excellence'].map(value => (
                      <span key={value} className="px-1.5 py-0.5 bg-amber-50 rounded text-xs text-amber-700">{value}</span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-4 print:mb-2">
                  <h2 className="text-base font-bold text-amber-600 flex items-center gap-2 mb-2 print:mb-1">
                    <MessageCircle size={14} /> Languages
                  </h2>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-700">English (Fluent)</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-700">Chichewa (Native)</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-700">Tumbuka (Conversational)</span>
                  </div>
                </div>

                {/* Creative Work */}
                <div className="mb-4 print:mb-2">
                  <h2 className="text-base font-bold text-amber-600 flex items-center gap-2 mb-2 print:mb-1">
                    <PenTool size={14} /> Creative Work
                  </h2>
                  <div className="bg-amber-50 p-2 rounded-lg border-l-4 border-amber-500">
                    <p className="text-gray-700 text-xs italic">
                      <strong>"Threads of Becoming"</strong> — A poetry collection exploring life, growth, and struggle. 
                      13 poems across 4 sections.
                    </p>
                  </div>
                </div>

                {/* Conferences & Workshops */}
                <div className="mb-4 print:mb-2">
                  <h2 className="text-base font-bold text-amber-600 flex items-center gap-2 mb-2 print:mb-1">
                    <Calendar size={14} /> Conferences & Workshops
                  </h2>
                  <div className="space-y-1">
                    <p className="text-gray-700 text-xs">✓ CEOs, Founders & Builders Summit - KUHeS (2026)</p>
                    <p className="text-gray-700 text-xs">✓ Men of Courage Conference - Golden Peacock Hotel (2026)</p>
                    <p className="text-gray-700 text-xs">✓ Diagnostics Workshop - MLW with Prof. Manu Prakash (2026)</p>
                    <p className="text-gray-700 text-xs">✓ Own Your Path Mentorship Program - Girl Up Elevate (2025)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="mt-3 pt-2 border-t border-gray-200">
              <h2 className="text-base font-bold text-amber-600 flex items-center gap-2 mb-1">
                <Heart size={14} /> Interests
              </h2>
              <div className="flex flex-wrap gap-1">
                {['Healthcare Innovation', 'Digital Health', 'AI in Medicine', 'Systems Thinking', 'Creative Writing', 'Poetry', 'Graphic Design', 'Mentorship', 'Leadership Development'].map(interest => (
                  <span key={interest} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-700">{interest}</span>
                ))}
              </div>
            </div>

            {/* Quote Footer */}
            <div className="mt-3 pt-2 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-xs italic">
                "Every problem becomes temporary once you prove to yourself that you can build something real from nothing."
              </p>
              <p className="text-amber-600 text-xs mt-0.5">— Joel George Kaudzu</p>
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
            
            /* Keep everything together */
            .bg-gradient-to-r {
              background: #1a1a1a !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            /* Prevent page breaks inside sections */
            .mb-4, .space-y-3 > div, .grid > div {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            /* Reduce spacing for print */
            .py-4 {
              padding-top: 0.25rem !important;
              padding-bottom: 0.25rem !important;
            }
            
            .mb-4 {
              margin-bottom: 0.35rem !important;
            }
            
            .gap-1, .gap-2, .gap-3, .gap-4 {
              gap: 0.15rem !important;
            }
            
            /* No shadows */
            .shadow-2xl, .shadow-lg {
              box-shadow: none !important;
            }
            
            /* Links visible */
            a {
              text-decoration: none !important;
              color: #1a1a1a !important;
            }
            
            /* Hide buttons */
            button {
              display: none !important;
            }
            
            /* Colors */
            .text-amber-600, .text-amber-500 {
              color: #b45309 !important;
            }
            
            .bg-amber-50 {
              background-color: #fffbeb !important;
            }
            
            .border-t, .border-b {
              border-color: #e5e7eb !important;
            }
            
            /* Compact header */
            .py-6 {
              padding-top: 0.5rem !important;
              padding-bottom: 0.5rem !important;
            }
            
            /* Smaller text for print */
            body, p, span, li, .text-sm {
              font-size: 10pt !important;
              line-height: 1.3 !important;
            }
            
            h1 {
              font-size: 18pt !important;
            }
            
            h2 {
              font-size: 12pt !important;
            }
            
            h3 {
              font-size: 11pt !important;
            }
          }
        `}</style>
      </div>
    </div>
  )
}