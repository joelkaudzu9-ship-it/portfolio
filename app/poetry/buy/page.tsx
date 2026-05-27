'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CheckCircle, Shield, Loader2, Mail, Phone, User } from 'lucide-react'

const AirtelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#E60000" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">A</text>
  </svg>
)

const MpambaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#009245" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">M</text>
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
    if (!formData.name.trim()) newErrors.name = 'Name required'
    if (!formData.email.trim()) newErrors.email = 'Email required'
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number required'
    if (!paymentMethod) newErrors.paymentMethod = 'Select payment method'
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
        body: JSON.stringify({ ...formData, paymentMethod, amount: 200 })
      })
      
      const data = await response.json()
      
      if (response.ok && data.paymentUrl) {
        window.location.href = data.paymentUrl
      } else {
        alert(data.error || 'Payment failed')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black py-8 sm:py-12">
      <div className="container-custom max-w-4xl mx-auto px-4 sm:px-6">
        
        <Link href="/poetry" className="inline-flex items-center gap-2 text-amber-500 mb-6 hover:gap-3 transition-all">
          <ArrowLeft size={16} /> Back to Poetry
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="sticky top-24 bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-2xl p-6 border border-amber-500/20 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <BookOpen size={32} className="text-white" />
              </div>
              <h2 className="text-xl font-bold">Threads of Becoming</h2>
              <p className="text-amber-600 text-sm mt-1">Poetry Collection</p>
              <div className="mt-4"><span className="text-3xl font-bold">MK 200</span><span className="text-sm text-gray-500"> (~$0.23 USD)</span></div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-2 text-sm"><CheckCircle size={14} className="text-green-500" /> Instant PDF Download</div>
                <div className="flex items-center justify-center gap-2 text-sm mt-2"><CheckCircle size={14} className="text-green-500" /> 13 Poems · 4 Sections</div>
              </div>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h1 className="text-2xl font-bold">Complete Your Purchase</h1>
                <p className="text-gray-500 text-sm mt-1">Enter your details to receive the poetry collection</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} bg-white dark:bg-gray-800`} placeholder="John Doe" />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} bg-white dark:bg-gray-800`} placeholder="you@example.com" />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} bg-white dark:bg-gray-800`} placeholder="0999123456" />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Method *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setPaymentMethod('airtel')} className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition ${paymentMethod === 'airtel' ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-300'}`}>
                      <AirtelIcon /> Airtel Money
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('mpamba')} className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition ${paymentMethod === 'mpamba' ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-300'}`}>
                      <MpambaIcon /> Mpamba
                    </button>
                  </div>
                  {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>}
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <div className="flex justify-between"><span>Poetry Collection</span><span>MK 200</span></div>
                  <div className="flex justify-between mt-1 pt-1 border-t font-bold"><span>Total</span><span className="text-amber-600">MK 200</span></div>
                </div>
                
                <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
                  Pay MK 200
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}