'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Target, Heart, TrendingUp, Users, Globe } from 'lucide-react'

const quotes = [
  "Every problem becomes temporary once you prove to yourself that you can build something real from nothing.",
  "The future of African innovation will belong to those who can combine empathy, systems thinking, and disciplined execution.",
  "Curiosity becomes powerful once discipline gives it direction.",
  "Technology should serve people, not merely impress them.",
]

const values = [
  { icon: Target, title: "Innovation", description: "Solving practical human problems, not chasing trends." },
  { icon: Globe, title: "Accessibility", description: "Technology accessible regardless of economics, language, or location." },
  { icon: Heart, title: "Faith", description: "Resilience and purpose through faith in Jesus Christ." },
  { icon: TrendingUp, title: "Growth", description: "Lifelong learning across disciplines." },
  { icon: Users, title: "Impact", description: "Building systems that empower people and communities." },
]

export default function Home() {
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="blob top-20 -left-20 animate-pulse"></div>
          <div className="blob bottom-20 -right-20 animate-pulse delay-1000"></div>
          <div className="blob top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-gold/10 animate-pulse delay-2000"></div>
        </div>

        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/30 mb-6">
              <span className="text-accent-gold text-sm font-medium tracking-wide">Dental Surgery Student • Healthcare Systems Builder</span>
            </div>
            
            <h1 className="mb-6">
              Joel George <span className="gradient-text-gold">Kaudzu</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-8 leading-relaxed">
              Building scalable healthcare systems for Africa. Creator of <span className="text-accent-gold font-semibold">MoyoWanga</span> — multilingual chronic disease support.
            </p>

            {/* Rotating Quote */}
            <div className="max-w-3xl mx-auto mb-12 p-8 glass-card">
              <p className="text-lg italic text-text-secondary animate-fade-in leading-relaxed">
                "{quotes[currentQuote]}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects" className="btn-primary inline-flex items-center gap-2 group">
                Explore Work <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about" className="btn-outline">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-text-muted flex justify-center">
            <div className="w-1 h-3 bg-accent-gold rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section bg-background/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-accent-gold text-sm font-semibold tracking-wide uppercase">Core Principles</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Values That <span className="gradient-text-gold">Guide Me</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto mt-4">
              Principles that shape every project I build and every problem I solve.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card-hover p-6"
              >
                <value.icon size={40} className="text-accent-gold mb-4" />
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-text-secondary leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-gold/5 via-accent-gold/10 to-transparent p-8 md:p-12 text-center border border-accent-gold/20"
          >
            <div className="relative z-10">
              <span className="text-accent-gold text-sm font-semibold tracking-wide uppercase">Personal Mission</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-6 gradient-text-gold">
                To build systems that improve lives, strengthen communities, and increase human capability across Africa.
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
                Technology becomes meaningful when it solves real problems, respects human realities, and remains accessible to ordinary people.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}