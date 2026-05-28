'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, BookOpen, CheckCircle, Shield, Loader2, 
  Mail, Phone, User, Sparkles, Heart, Star, CreditCard,
  Lock, Globe, Smartphone
} from 'lucide-react'

const AirtelIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#E60000" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold" fontFamily="Arial">A</text>
  </svg>
)

const MpambaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#009245" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold" fontFamily="Arial">M</text>
  </svg>
)

export default function BuyPoetryPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [paymentMethod, setPaymentMethod] = useState<'airtel' | 'mpamba' | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Enter a valid email'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!paymentMethod) newErrors.paymentMethod = 'Select a payment method'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/poetry/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, paymentMethod, amount: 400 })
      })
      
      const data = await response.json()
      
      if (response.ok && data.paymentUrl) {
        window.location.href = data.paymentUrl
      } else {
        alert(data.error || 'Payment failed. Please try again.')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-black py-12 sm:py-16">
      <div className="container-custom max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Back Button */}
        <Link href="/poetry" className="inline-flex items-center gap-2 text-amber-500 mb-6 hover:gap-3 transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Poetry
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Product Info - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              {/* Cover Card */}
              <div className="bg-gradient-to-br from-amber-500/15 via-amber-600/10 to-amber-700/5 rounded-3xl p-6 border border-amber-500/20 backdrop-blur-sm">
                <div className="w-24 h-24 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-xl">
                  <BookOpen size={40} className="text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                  Threads of Becoming
                </h2>
                <p className="text-amber-500 text-center text-sm mt-1">Poetry Collection</p>
                
                <div className="mt-5 text-center">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">MK 400</span>
                  <span className="text-sm text-gray-500 ml-1">(~$0.23 USD)</span>
                </div>
                
                <div className="mt-6 space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle size={14} className="text-green-500" />
                    Instant PDF Download
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle size={14} className="text-green-500" />
                    13 Poems · 4 Sections
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle size={14} className="text-green-500" />
                    Secure Payment
                  </div>
                </div>
                
                <div className="mt-5 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl">
                  <Heart size={16} className="text-amber-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic text-center">
                    "Poetry has shaped my emotional intelligence and perspective as a creator."
                  </p>
                  <p className="text-xs text-amber-600 text-center mt-1">— Joel George Kaudzu</p>
                </div>
              </div>
              
              {/* Security Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Lock size={12} />
                <span>SSL Secure Payment</span>
                <Globe size={12} />
                <span>Powered by PayChangu</span>
              </div>
            </div>
          </motion.div>

          {/* Payment Form - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              {/* Form Header */}
              <div className="relative p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complete Your Purchase</h1>
                <p className="text-gray-500 text-sm mt-1">Enter your details to receive the poetry collection</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  <p className="text-xs text-gray-400 mt-1">Download link will be sent here</p>
                </div>
                
                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition`}
                      placeholder="0999123456"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  <p className="text-xs text-gray-400 mt-1">For payment confirmation (Airtel/Mpamba)</p>
                </div>
                
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('airtel')}
                      className={`flex items-center justify-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        paymentMethod === 'airtel'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-md'
                          : 'border-gray-300 dark:border-gray-700 hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <AirtelIcon />
                      <span className="font-medium">Airtel Money</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mpamba')}
                      className={`flex items-center justify-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        paymentMethod === 'mpamba'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-md'
                          : 'border-gray-300 dark:border-gray-700 hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <MpambaIcon />
                      <span className="font-medium">Mpamba</span>
                    </button>
                  </div>
                  {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>}
                </div>
                
                {/* Price Summary */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl p-4 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Threads of Becoming</span>
                    <span className="font-semibold">MK 400</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-2xl text-amber-600">MK 400</span>
                  </div>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Shield size={20} />}
                  {loading ? 'Processing...' : `Pay MK 400 via ${paymentMethod === 'airtel' ? 'Airtel Money' : paymentMethod === 'mpamba' ? 'Mpamba' : 'Selected Method'}`}
                </button>
                
                <p className="text-xs text-center text-gray-400">
                  By completing this purchase, you agree to receive the download link via email.
                  You will not be charged anything extra.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}