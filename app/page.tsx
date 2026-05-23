'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Code, Lightbulb, Users, Globe, BookOpen, Cpu, TrendingUp } from 'lucide-react'

const quotes = [
  "Every problem becomes temporary once you prove to yourself that you can build something real from nothing.",
  "The future of African innovation will belong to those who can combine empathy, systems thinking, and disciplined execution.",
  "Curiosity becomes powerful once discipline gives it direction.",
  "Technology should serve people, not merely impress them.",
]

const values = [
  { icon: Lightbulb, title: "Innovation", description: "Solving practical human problems, not chasing trends." },
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="blob-bg top-20 left-10 animate-blob"></div>
          <div className="blob-bg bottom-20 right-10 animate-blob animation-delay-2000"></div>
          <div className="blob-bg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
              <span className="text-teal-500 text-sm font-medium">Dental Surgery Student • Healthcare Systems Builder</span>
            </div>
            
            <h1 className="mb-6">
              <span className="gradient-text">Joel George Kaudzu</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              Building scalable healthcare systems for Africa. Creator of <span className="text-teal-500 font-semibold">MoyoWanga</span> — multilingual chronic disease support.
            </p>

            {/* Rotating Quote */}
            <div className="max-w-2xl mx-auto mb-12 p-6 bg-gray-100/50 dark:bg-gray-900/30 rounded-2xl border border-gray-200 dark:border-gray-800">
              <p className="text-lg italic text-gray-700 dark:text-gray-300 animate-fade-in">
                "{quotes[currentQuote]}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects" className="group inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-all duration-300 hover:gap-3">
                Explore Projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/journey" className="inline-flex items-center gap-2 px-6 py-3 border border-teal-500 text-teal-500 hover:bg-teal-500/10 rounded-lg font-medium transition-all duration-300">
                Read My Journey
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Core <span className="gradient-text">Values</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Principles that guide every project I build and every problem I solve.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 card-hover"
              >
                <value.icon size={40} className="text-teal-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500/20 via-teal-600/10 to-amber-500/20 p-8 md:p-12 text-center"
          >
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Personal Mission
              </h2>
              <p className="text-xl md:text-2xl font-bold gradient-text mb-6">
                To build systems that improve lives, strengthen communities, and increase human capability across Africa.
              </p>
              <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Technology becomes meaningful when it solves real problems, respects human realities, and remains accessible to ordinary people.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Project: MoyoWanga */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-teal-500 font-semibold">Featured Project</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">
              Moyo<span className="text-teal-500">Wanga</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4">
              Multilingual Chronic Disease Support Ecosystem for low-resource healthcare environments
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-teal-500/10 text-teal-500 rounded-full text-sm">Python</span>
                  <span className="px-3 py-1 bg-teal-500/10 text-teal-500 rounded-full text-sm">Flask</span>
                  <span className="px-3 py-1 bg-teal-500/10 text-teal-500 rounded-full text-sm">PostgreSQL</span>
                  <span className="px-3 py-1 bg-teal-500/10 text-teal-500 rounded-full text-sm">Africa's Talking API</span>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  MoyoWanga improves continuity of care for patients with hypertension, diabetes, and other chronic conditions. 
                  The system uses SMS as its foundational layer, ensuring accessibility even where internet is inconsistent and smartphone 
                  ownership is limited.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="text-2xl font-bold text-teal-500">6+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Languages Supported</div>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="text-2xl font-bold text-teal-500">2-way</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">SMS Communication</div>
                  </div>
                </div>
                
                <Link href="/projects/moyowanga" className="inline-flex items-center gap-2 text-teal-500 font-medium hover:gap-3 transition-all">
                  Learn more about MoyoWanga <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-teal-500/20 to-amber-500/20 rounded-2xl p-8 backdrop-blur-sm border border-teal-500/30">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Cpu size={16} className="text-teal-500" />
                    <span className="text-sm">SMS Infrastructure Active</span>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-teal-500">Demo Message:</div>
                    <div className="p-3 bg-white dark:bg-gray-900 rounded-lg font-mono text-sm">
                      "MoyoWanga: Kumbukilani kumwa mankhwala anu a shuga. Yankhani ndi 'NDI' kutsimikizira. (Diabetes reminder)"
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}