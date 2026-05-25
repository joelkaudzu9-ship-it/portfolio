'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  Presentation, 
  Heart, 
  Target, 
  Shield,
  BookOpen,
  Sparkles,
  Calendar,
  Award,
  Globe,
  MessageCircle
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const leadershipRoles = [
  {
    title: "Innovations Coordinator",
    organization: "Science For All — KUHeS",
    period: "Present",
    description: "Coordinating innovation-centered activities, supporting student innovators, facilitating collaboration, and promoting applied problem-solving within the university.",
    responsibilities: [
      "Coordinate innovation-focused initiatives",
      "Support student innovators and projects",
      "Facilitate cross-disciplinary collaboration",
      "Promote applied problem-solving culture"
    ],
    icon: Sparkles
  },
  {
    title: "Graphic Designer",
    organization: "KUHeS Publications Team",
    period: "Present",
    description: "Contributing to visual communication and design for university publications, posters, presentation graphics, and digital media support.",
    responsibilities: [
      "Poster and flyer design",
      "Visual communication",
      "Presentation graphics",
      "Digital media support"
    ],
    icon: Presentation
  },
  {
    title: "Student Teacher",
    organization: "Bright Future Private Academy",
    period: "1 Year",
    description: "Served as a student teacher responsible for lesson delivery, student mentorship, academic support, classroom coordination, and educational communication.",
    responsibilities: [
      "Lesson delivery and planning",
      "Student mentorship",
      "Academic support",
      "Classroom coordination"
    ],
    icon: BookOpen
  }
]

const mentorship = {
  title: "Peer Support & Mentorship",
  description: "Actively involved in mentoring and supporting fellow students academically and personally.",
  areas: [
    { name: "Academic Guidance", icon: Target, description: "Supporting students with study strategies and academic challenges" },
    { name: "Peer Support", icon: Heart, description: "Providing emotional encouragement and personal development support" },
    { name: "Collaborative Learning", icon: Users, description: "Facilitating group study and knowledge sharing" },
    { name: "Growth Culture", icon: Shield, description: "Encouraging a growth-oriented student culture" }
  ]
}

const philosophy = {
  title: "My Leadership Philosophy",
  quote: "Leadership is less about authority and more about responsibility, service, consistency, emotional maturity, and helping others grow.",
  inspirations: [
    "My father — for his work ethic and perseverance",
    "Prof. Kondwani Jambo — for healthcare research and scientific contribution",
    "Dr. Kaso — for discipline and consistency",
    "Sir Julius Chinyama — for integrating faith, business, innovation, and leadership",
    "Sir Alpha Phiri — for navigating business and faith with balance",
    "Apostle Joshua Selman — for spiritual depth and perspective"
  ]
}

const skills = [
  "Communication & Storytelling",
  "Emotional Intelligence",
  "Team Coordination",
  "Public Speaking",
  "Mentorship",
  "Problem Analysis",
  "Organizational Thinking",
  "Innovation Management"
]

export default function LeadershipPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container-custom max-w-4xl">
        
        {/* Header */}
        <motion.div 
          {...fadeInUp}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Leadership & <span className="gradient-text-gold">Community</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Serving through innovation coordination, design, teaching, and mentorship — 
            driven by responsibility, service, and helping others grow.
          </p>
        </motion.div>

        {/* Leadership Roles */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="mb-12 space-y-6"
        >
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Users size={24} className="text-accent-gold" />
            Current & Past Roles
          </h2>
          
          {leadershipRoles.map((role, index) => (
            <div key={role.title} className="p-5 rounded-xl bg-surface/50 border border-border hover:border-accent-gold/30 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <role.icon size={24} className="text-accent-gold" />
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{role.title}</h3>
                    <p className="text-accent-gold text-sm">{role.organization}</p>
                  </div>
                </div>
                <span className="text-text-muted text-sm flex items-center gap-1">
                  <Calendar size={14} /> {role.period}
                </span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-3">{role.description}</p>
              <div className="flex flex-wrap gap-2">
                {role.responsibilities.map((resp) => (
                  <span key={resp} className="text-xs px-2 py-1 rounded-full bg-surface border border-border text-text-muted">
                    {resp}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Mentorship */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-accent-gold/5 to-transparent border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <Heart size={28} className="text-accent-gold" />
            <h2 className="text-2xl font-bold text-text-primary">{mentorship.title}</h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-5">{mentorship.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {mentorship.areas.map((area) => (
              <div key={area.name} className="text-center p-3 rounded-lg bg-surface/80 border border-border">
                <area.icon size={20} className="mx-auto mb-2 text-accent-gold" />
                <h4 className="font-medium text-text-primary text-sm">{area.name}</h4>
                <p className="text-text-muted text-xs mt-1">{area.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Leadership Skills */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2 mb-5">
            <Target size={24} className="text-accent-gold" />
            Leadership Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 rounded-full bg-surface border border-border text-text-secondary text-sm">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Philosophy */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.4 }}
          className="mb-12 p-6 rounded-2xl bg-surface/50 border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield size={28} className="text-accent-gold" />
            <h2 className="text-2xl font-bold text-text-primary">{philosophy.title}</h2>
          </div>
          <p className="text-text-primary text-lg italic leading-relaxed mb-5">
            "{philosophy.quote}"
          </p>
          
          <h3 className="font-semibold text-text-primary mb-3">People Who Inspire Me</h3>
          <ul className="space-y-2">
            {philosophy.inspirations.map((inspiration, idx) => (
              <li key={idx} className="flex items-center gap-2 text-text-secondary text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                {inspiration}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Closing Note */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-accent-gold/10 to-emerald-500/5 border border-border text-center"
        >
          <p className="text-text-primary leading-relaxed italic">
            "I admire leaders capable of combining intellect, humility, execution, and human understanding. 
            Great leadership is not about authority — it's about creating conditions where others can grow."
          </p>
          <p className="text-accent-gold mt-3 font-medium">— Joel George Kaudzu</p>
        </motion.div>

      </div>
    </div>
  )
}