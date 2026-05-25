'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Compass, 
  Brain, 
  Heart, 
  Sparkles, 
  TrendingUp, 
  Lightbulb,
  ChevronRight,
  Quote
} from 'lucide-react'

const journeyStages = [
  {
    year: "Early Years",
    title: "The Curious Builder",
    icon: Compass,
    description: "Growing up in Malawi, I was naturally drawn to practical, hands-on disciplines—technical drawing, woodwork, metalwork, small circuits, and scientific experiments. Engineering felt like my destined path.",
    color: "from-amber-500/20 to-transparent"
  },
  {
    year: "Secondary School",
    title: "Science Fair & Setbacks",
    icon: Brain,
    description: "At Dedza Secondary School, I participated in the Kamuzu National Schools Science Fair in 2022. Despite my passion, I didn't achieve the recognition I hoped for. Combined with academic pressure and personal struggles, this period forced me into deep reflection about identity and purpose.",
    color: "from-blue-500/20 to-transparent"
  },
  {
    year: "The Wilderness",
    title: "Uncertainty & Rebuilding",
    icon: Heart,
    description: "After MSCE examinations, I faced disappointment, comparison, and emotional struggles that shook my confidence. I questioned my potential, my direction, and even my relationship with science. Through mentorship, spiritual growth, and exposure to innovation communities, the spark slowly returned.",
    color: "from-purple-500/20 to-transparent"
  },
  {
    year: "Current Chapter",
    title: "Interdisciplinary Builder",
    icon: Sparkles,
    description: "Now studying Dental Surgery at KUHeS while simultaneously teaching myself software development, systems design, and innovation frameworks. I've realized my true passion isn't confined to one field—it's solving meaningful problems at the intersection of healthcare, technology, and human systems.",
    color: "from-emerald-500/20 to-transparent"
  }
]

const turningPoints = [
  {
    title: "MLW Diagnostics Workshop",
    description: "Participating in the Malawi Liverpool Wellcome Trust workshop featuring Assoc. Prof. Manu Prakash transformed my understanding of frugal innovation and infrastructure-aware healthcare design.",
    icon: Lightbulb
  },
  {
    title: "Building MoyoWanga",
    description: "Creating a multilingual SMS-based chronic disease support platform taught me that real impact comes from solving practical problems for real people in real environments.",
    icon: TrendingUp
  },
  {
    title: "Faith & Mentorship",
    description: "Through spiritual growth and guidance from mentors who integrate faith, leadership, and innovation, I've developed resilience, discipline, and a long-term perspective on building systems that matter.",
    icon: Heart
  }
]

export default function JourneyPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen py-16">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            My <span className="gradient-text-gold">Journey</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            A non-linear path of curiosity, setbacks, rebuilding, and discovering purpose 
            at the intersection of healthcare, technology, and human systems
          </p>
        </motion.div>

        {/* Personal Quote */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-accent-gold/10 to-transparent border border-accent-gold/20"
        >
          <Quote size={32} className="text-accent-gold mb-3" />
          <p className="text-text-primary text-lg italic leading-relaxed">
            "Every problem becomes temporary once you prove to yourself that you can build something real from nothing."
          </p>
          <p className="text-accent-gold mt-2 font-medium">— Joel George Kaudzu</p>
        </motion.div>

        {/* Journey Timeline */}
        <div className="space-y-8 mb-16">
          {journeyStages.map((stage, index) => (
            <motion.div
              key={stage.year}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 border-l-2 border-accent-gold/30"
            >
              <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-accent-gold flex items-center justify-center">
                <stage.icon size={12} className="text-background" />
              </div>
              
              <div className="mb-2">
                <span className="text-accent-gold text-sm font-semibold">{stage.year}</span>
                <h2 className="text-xl font-bold text-text-primary mt-1">{stage.title}</h2>
              </div>
              
              <p className="text-text-secondary leading-relaxed">
                {stage.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Turning Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-center mb-8 gradient-text-gold">
            Defining Moments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {turningPoints.map((point, idx) => (
              <div
                key={point.title}
                className="p-5 rounded-xl bg-surface border border-border hover:border-accent-gold/30 transition-all cursor-pointer"
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
              >
                <point.icon size={28} className="text-accent-gold mb-3" />
                <h3 className="font-semibold text-text-primary mb-2">{point.title}</h3>
                <p className={`text-text-secondary text-sm transition-all duration-300 ${expandedIndex === idx ? '' : 'line-clamp-2'}`}>
                  {point.description}
                </p>
                <button className="mt-2 text-accent-gold text-xs flex items-center gap-1">
                  {expandedIndex === idx ? 'Show less' : 'Read more'} <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-surface/50 border border-border text-center"
        >
          <h3 className="text-lg font-semibold text-accent-gold mb-3">My Philosophy</h3>
          <p className="text-text-primary leading-relaxed">
            I don't see medicine, software, leadership, research, and creativity as separate identities.
            <br /><br />
            They are interconnected capabilities. The future of African innovation will belong to those who can combine empathy, systems thinking, and disciplined execution.
            <br /><br />
            My mission: <strong className="text-accent-gold">Build systems that increase human capability and improve lives.</strong>
          </p>
        </motion.div>
      </div>
    </div>
  )
}