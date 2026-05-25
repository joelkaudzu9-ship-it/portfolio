'use client'

import { motion } from 'framer-motion'
import { 
  User, 
  Brain, 
  Heart, 
  Target, 
  BookOpen, 
  Lightbulb,
  Quote,
  GraduationCap,
  Code,
  Users,
  Feather
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const stats = [
  { value: "BDS", label: "Dental Surgery", icon: GraduationCap },
  { value: "MoyoWanga", label: "Health-Tech Builder", icon: Code },
  { value: "Innovation", label: "Coordinator", icon: Users },
  { value: "Poetry", label: "Creative Writer", icon: Feather },
]

const values = [
  {
    title: "Innovation",
    description: "Technology and creativity should solve real-world problems rather than merely impress people.",
    icon: Lightbulb
  },
  {
    title: "Accessibility",
    description: "The best solutions are the ones accessible to ordinary people regardless of language, location, or economic status.",
    icon: Target
  },
  {
    title: "Faith & Growth",
    description: "My faith shapes my resilience, discipline, and desire to serve others. I believe learning should never stop.",
    icon: Heart
  },
  {
    title: "Impact",
    description: "I care deeply about creating systems and opportunities that improve lives beyond my own personal success.",
    icon: Brain
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container-custom max-w-4xl">
        
        {/* Header */}
        <motion.div 
          {...fadeInUp}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            About <span className="gradient-text-gold">Me</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Dental surgery student, health-tech builder, innovation coordinator, 
            and creative technologist at the intersection of medicine, engineering, 
            leadership, and community-centered design.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-surface/50 border border-border">
              <stat.icon size={24} className="mx-auto mb-2 text-accent-gold" />
              <div className="font-bold text-text-primary">{stat.value}</div>
              <div className="text-xs text-text-muted">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Who I Am */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-accent-gold/5 to-transparent border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <User size={28} className="text-accent-gold" />
            <h2 className="text-2xl font-bold text-text-primary">Who I Am</h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            My journey into healthcare and innovation was not straightforward. Growing up, I was deeply drawn to 
            technical and hands-on disciplines—woodwork, metalwork, small circuits, and scientific experiments. 
            I initially believed civil engineering was my destined path.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            After completing my MSCE examinations, life shifted unexpectedly. Results, comparisons, and personal setbacks 
            deeply affected my confidence. Around the same period, I also failed to secure a strong position at the 
            Kamuzu National Schools Science Fair in 2022.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Those moments forced me into a difficult season of self-reflection. Through mentorship, exposure to innovation 
            communities, and faith, the spark slowly returned. Today, I operate as an interdisciplinary learner and builder—studying 
            dentistry while simultaneously teaching myself software development, systems design, and innovation frameworks.
          </p>
        </motion.div>

        {/* Quote */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.3 }}
          className="mb-12 p-6 rounded-2xl bg-accent-gold/5 border border-accent-gold/20 text-center"
        >
          <Quote size={32} className="mx-auto mb-3 text-accent-gold" />
          <p className="text-text-primary text-lg italic leading-relaxed">
            "The future of African innovation will belong to those who can combine empathy, 
            systems thinking, and disciplined execution."
          </p>
          <p className="text-accent-gold mt-2 font-medium">— Joel George Kaudzu</p>
        </motion.div>

        {/* Core Values */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Heart size={28} className="text-accent-gold" />
            <h2 className="text-2xl font-bold text-text-primary">Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {values.map((value) => (
              <div key={value.title} className="p-5 rounded-xl bg-surface/50 border border-border hover:border-accent-gold/30 transition-all">
                <value.icon size={24} className="text-accent-gold mb-3" />
                <h3 className="font-semibold text-text-primary mb-2">{value.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What Drives Me */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.5 }}
          className="mb-12 p-6 rounded-2xl bg-surface/50 border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <Target size={28} className="text-accent-gold" />
            <h2 className="text-2xl font-bold text-text-primary">What Drives Me</h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            I am naturally drawn toward solving meaningful problems, building systems, understanding people, 
            integrating technology with human needs, and creating things that can genuinely improve lives.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            I believe impactful solutions are built when innovation meets empathy, intellect meets service, 
            and vision meets disciplined execution. I do not strive only for mastery—I strive for capacity, 
            wisdom, and lasting impact.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Whether through medicine, technology, leadership, research, or creativity, my goal remains the same: 
            <strong className="text-accent-gold ml-1">Build systems that increase human capability and improve lives.</strong>
          </p>
        </motion.div>

        {/* Vision Statement */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-accent-gold/10 to-emerald-500/5 border border-border text-center"
        >
          <BookOpen size={32} className="mx-auto mb-3 text-accent-gold" />
          <h3 className="text-lg font-semibold text-accent-gold mb-2">My Long-Term Vision</h3>
          <p className="text-text-primary leading-relaxed">
            To help build scalable African systems that improve healthcare accessibility, 
            knowledge distribution, innovation culture, and community empowerment—especially 
            in low-resource settings where thoughtful design and accessibility matter most.
          </p>
        </motion.div>

      </div>
    </div>
  )
}