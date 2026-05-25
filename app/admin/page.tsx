'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Key, Shield, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Auto-focus on input
  useEffect(() => {
    const input = document.querySelector('input[type="password"]') as HTMLInputElement
    if (input) input.focus()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password.trim()) {
      setError('Please enter your password')
      setTimeout(() => setError(''), 3000)
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      
      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        setError('Invalid password. Please try again.')
        setTimeout(() => setError(''), 3000)
        setPassword('')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setTimeout(() => setError(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md px-4 sm:px-0">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <p className="text-text-secondary text-sm mt-2">
            Secure access to content management
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-white dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary flex items-center gap-2">
                  <Key size={14} className="text-amber-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all text-text-primary"
                    required
                    disabled={loading}
                  />
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-amber-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Login to Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Security Note */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
                <Shield size={12} />
                <span>Secure area • Unauthorized access prohibited</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-text-muted mt-6">
          This area is restricted to authorized personnel only
        </p>
      </div>
    </div>
  )
}