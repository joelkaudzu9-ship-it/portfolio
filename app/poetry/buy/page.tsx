'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, BookOpen, Heart, Star, Users, 
  Shield, Download, Mail, Phone, MapPin, CheckCircle,
  AlertCircle, Loader2
} from 'lucide-react'
import { FaMobileAlt, FaMoneyBillWave } from 'react-icons/fa'

export default function BuyPoetryPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [paymentMethod, setPaymentMethod] = useState<'airtel' | 'mpamba' | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!paymentMethod) newErrors.paymentMethod = 'Select payment method'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/poetry/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentMethod,
          amount: 200,
          product: "Threads of Becoming - Poetry Collection"
        }),
      })
      
      const data = await response.json()
      
      if (response.ok && data.paymentUrl) {
        // Redirect to PayChangu payment page
        window.location.href = data.paymentUrl
      } else {
        alert(data.error || 'Payment initiation failed. Please try again.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black py-8 sm:py-12">
      <div className="container-custom max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Back Button */}
        <Link href="/poetry" className="inline-flex items-center gap-2 text-amber-500 mb-6 hover:gap-3 transition-all group no-print">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Poetry
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Product Info - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-2xl p-6 border border-amber-500/20 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <BookOpen size={32} className="text-white" />
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Threads of Becoming</h2>
                <p className="text-amber-600 text-sm mt-1">Poetry Collection</p>
                
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">MK 200</span>
                  <span className="text-sm text-gray-500"> (~$0.23 USD)</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>Instant PDF Download</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>13 Poems · 4 Sections</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>Secure Payment</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                    "Poetry has shaped my communication ability, emotional intelligence, 
                    and perspective as both a creator and problem solver."
                  </p>
                  <p className="text-xs text-amber-600 mt-1">— Joel George Kaudzu</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Form - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complete Your Purchase</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Enter your details to receive the poetry collection
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  <p className="text-xs text-gray-500 mt-1">PDF will be sent to this email</p>
                </div>
                
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition`}
                    placeholder="0999123456"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  <p className="text-xs text-gray-500 mt-1">For payment confirmation (Airtel/Mpamba)</p>
                </div>
                
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('airtel')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition ${
                        paymentMethod === 'airtel'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                          : 'border-gray-300 dark:border-gray-700 hover:border-amber-300'
                      }`}
                    >
                      <FaMobileAlt size={20} className="text-red-500" />
                      <span className="font-medium">Airtel Money</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mpamba')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition ${
                        paymentMethod === 'mpamba'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                          : 'border-gray-300 dark:border-gray-700 hover:border-amber-300'
                      }`}
                    >
                      <FaMoneyBillWave size={20} className="text-green-500" />
                      <span className="font-medium">Mpamba</span>
                    </button>
                  </div>
                  {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>}
                </div>
                
                {/* Price Summary */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Poetry Collection</span>
                    <span className="font-semibold">MK 200</span>
                  </div>
                  <div className="flex justify-between items-center mt-1 pt-1 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-amber-600">MK 200</span>
                  </div>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield size={18} />
                      Pay MK 200 via {paymentMethod === 'airtel' ? 'Airtel Money' : paymentMethod === 'mpamba' ? 'Mpamba' : 'Selected Method'}
                    </>
                  )}
                </button>
                
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Secure payment powered by PayChangu. You'll receive download link after payment.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}