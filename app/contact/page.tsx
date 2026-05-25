'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "joelkaudzu9@gmail.com",
    href: "mailto:joelkaudzu9@gmail.com"
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+265 983 142 415",
    href: "tel:+265983142415"
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Lilongwe, Malawi",
    href: null
  }
]

// Social links using custom SVGs (avoiding lucide-react export issues)
const socialLinks = [
  { 
    icon: () => (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
    label: "GitHub", 
    href: "https://github.com/joelkaudzu9-ship-it" 
  },
  { 
    icon: () => (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />
      </svg>
    ),
    label: "LinkedIn", 
    href: "https://www.linkedin.com/in/joel-kaudzu-0bba48392" 
  },
  { 
    icon: () => (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.032 2.016c-5.523 0-10 4.477-10 10 0 1.756.455 3.462 1.318 4.969L1.99 21.837l4.947-1.315c1.468.836 3.13 1.278 4.845 1.278 5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.12c-1.54 0-3.04-.412-4.34-1.18l-.31-.18-2.938.78.79-2.844-.2-.33c-.84-1.36-1.28-2.91-1.28-4.49 0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2zm4.49-6.13c-.25-.12-1.47-.72-1.7-.8-.23-.09-.4-.12-.56.12-.16.24-.64.8-.78.96-.14.16-.29.18-.54.06-.25-.12-1.06-.39-2.01-1.24-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.15.16-.25.24-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43-.14-.01-.3-.01-.46-.01s-.42.06-.64.31c-.22.25-.84.82-.84 2.01 0 1.19.87 2.33.99 2.49.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.21-.57.21-1.05.15-1.15-.06-.1-.22-.16-.47-.28z"/>
      </svg>
    ),
    label: "WhatsApp", 
    href: "https://wa.me/265983142415" 
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Failed to send message')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container-custom max-w-5xl">
        
        {/* Header */}
        <motion.div {...fadeInUp} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Get In <span className="gradient-text-gold">Touch</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Have a project idea, collaboration, research opportunity, or just want to connect?
            <br />
            I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Side - Contact Info */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="space-y-6">
            <div className="glass-card p-6 space-y-4">
              <h2 className="text-xl font-bold text-text-primary mb-4">Reach Out Directly</h2>
              {contactMethods.map((method) => (
                <a
                  key={method.label}
                  href={method.href || '#'}
                  className="flex items-center gap-4 p-3 rounded-xl bg-surface/30 border border-border hover:border-accent-gold/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors">
                    <method.icon size={18} className="text-accent-gold" />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">{method.label}</p>
                    <p className="text-text-primary font-medium">{method.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4">Connect Online</h2>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border hover:border-accent-gold/30 transition-all group"
                  >
                    <social.icon />
                    <span className="text-text-secondary text-sm group-hover:text-accent-gold transition-colors">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4">Send a Message</h2>
              
              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">Message Sent!</h3>
                  <p className="text-text-secondary">Thanks for reaching out. I'll get back to you within 24-48 hours.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-accent-gold hover:underline"
                  >
                    Send another message →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-secondary">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary"
                      placeholder="Joel Kaudzu"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-secondary">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary"
                      placeholder="hello@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-secondary">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary resize-none"
                      placeholder="Tell me about your project, idea, or collaboration..."
                    />
                  </div>
                  
                  {status === 'error' && (
                    <p className="text-red-500 text-sm text-center">{errorMsg}</p>
                  )}
                  
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent-gold text-background font-semibold hover:bg-accent-goldLight transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}