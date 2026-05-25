'use client'

import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Microscope,
  Stethoscope,
  Code,
  Users,
  Calendar
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const education = {
  institution: "Kamuzu University of Health Sciences (KUHeS)",
  degree: "Bachelor of Dental Surgery (BDS)",
  period: "2024 - Present",
  description: "First-year student exploring the intersection of clinical dentistry, healthcare systems, and digital innovation.",
  courses: [
    "Human Biology",
    "Medical Sciences",
    "Healthcare Systems",
    "Diagnostics",
    "Oral Health",
    "Physiology",
    "Anatomy",
    "Preventive Healthcare",
    "Public Health Concepts"
  ]
}

const selfTaught = {
  title: "Self-Directed Learning",
  description: "Beyond formal education, I actively teach myself software development, systems design, and innovation frameworks.",
  areas: [
    { name: "Python & Flask", icon: Code, description: "Backend development, API design, and system architecture" },
    { name: "Frontend Development", icon: Code, description: "HTML, CSS, JavaScript, React, Next.js, Tailwind CSS" },
    { name: "Database Systems", icon: BookOpen, description: "PostgreSQL, Supabase, data modeling" },
    { name: "Cloud Deployment", icon: Code, description: "Vercel, Render, CI/CD pipelines" },
    { name: "Healthcare Innovation", icon: Stethoscope, description: "Digital health, frugal innovation, infrastructure-aware design" },
    { name: "Systems Thinking", icon: Users, description: "Interdisciplinary problem solving, systems architecture" }
  ]
}

const achievements = [
  {
    title: "MLW Diagnostics Workshop",
    organization: "Malawi Liverpool Wellcome Trust",
    description: "Participated in healthcare innovation workshop featuring Assoc. Prof. Manu Prakash, focusing on frugal innovation and infrastructure-aware healthcare design.",
    icon: Microscope
  },
  {
    title: "Science Fair Participant",
    organization: "Kamuzu National Schools Science Fair (2022)",
    description: "Represented Dedza Secondary School, exploring scientific innovation despite challenging outcomes that shaped my resilience.",
    icon: Award
  },
  {
    title: "Men of Courage Conference",
    organization: "The Powerhouse International Church",
    description: "Leadership and personal development conference focused on purpose, discipline, masculinity, and spiritual growth.",
    icon: Users
  }
]

export default function EducationPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container-custom max-w-4xl">
        
        {/* Header */}
        <motion.div 
          {...fadeInUp}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            My <span className="gradient-text-gold">Education</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Formal training at Kamuzu University of Health Sciences, combined with 
            self-directed learning in software engineering, systems design, and healthcare innovation.
          </p>
        </motion.div>

        {/* Formal Education */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-accent-gold/5 to-transparent border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap size={28} className="text-accent-gold" />
            <h2 className="text-2xl font-bold text-text-primary">Formal Education</h2>
          </div>
          
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-text-primary">{education.institution}</h3>
            <div className="flex flex-wrap items-center gap-3 mt-1 mb-2">
              <span className="text-accent-gold font-medium">{education.degree}</span>
              <span className="flex items-center gap-1 text-text-muted text-sm">
                <Calendar size={14} /> {education.period}
              </span>
            </div>
            <p className="text-text-secondary leading-relaxed">{education.description}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-text-primary mb-3">Current Areas of Study</h4>
            <div className="flex flex-wrap gap-2">
              {education.courses.map((course) => (
                <span key={course} className="px-3 py-1 rounded-full bg-surface border border-border text-text-secondary text-sm">
                  {course}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Self-Taught Learning */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="mb-12 p-6 rounded-2xl bg-surface/50 border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={28} className="text-accent-gold" />
            <h2 className="text-2xl font-bold text-text-primary">{selfTaught.title}</h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-5">{selfTaught.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selfTaught.areas.map((area) => (
              <div key={area.name} className="p-3 rounded-lg bg-surface/80 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <area.icon size={16} className="text-accent-gold" />
                  <h4 className="font-medium text-text-primary">{area.name}</h4>
                </div>
                <p className="text-text-muted text-xs">{area.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements & Conferences */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Award size={28} className="text-accent-gold" />
            <h2 className="text-2xl font-bold text-text-primary">Conferences & Exposure</h2>
          </div>
          
          <div className="space-y-4">
            {achievements.map((item, index) => (
              <div key={item.title} className="p-5 rounded-xl bg-surface/50 border border-border">
                <div className="flex items-start gap-3">
                  <item.icon size={20} className="text-accent-gold mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-text-primary">{item.title}</h3>
                    <p className="text-accent-gold text-sm mb-2">{item.organization}</p>
                    <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Philosophy Note */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-accent-gold/10 to-emerald-500/5 border border-border text-center"
        >
          <p className="text-text-primary leading-relaxed italic">
            "I believe impactful solutions often emerge where different worlds intersect. 
            My educational approach goes beyond examination performance—I actively seek 
            connections between healthcare, innovation, patient systems, technology, 
            communication, and infrastructure."
          </p>
          <p className="text-accent-gold mt-3 font-medium">— Joel George Kaudzu</p>
        </motion.div>

      </div>
    </div>
  )
}