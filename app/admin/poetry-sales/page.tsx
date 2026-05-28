'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, DollarSign, Users, ShoppingBag, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react'

type Purchase = {
  id: number
  name: string
  email: string
  phone: string
  amount: number
  status: string
  payment_method: string
  created_at: string
}

export default function PoetrySalesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    completedCount: 0,
    pendingCount: 0
  })

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    try {
      const response = await fetch('/api/admin/poetry-sales')
      const data = await response.json()
      setPurchases(data.purchases || [])
      
      const completed = data.purchases?.filter((p: Purchase) => p.status === 'completed') || []
      const pending = data.purchases?.filter((p: Purchase) => p.status === 'pending') || []
      const totalRevenue = completed.reduce((sum: number, p: Purchase) => sum + p.amount, 0)
      
      setStats({
        totalSales: data.purchases?.length || 0,
        totalRevenue,
        completedCount: completed.length,
        pendingCount: pending.length
      })
    } catch (error) {
      console.error('Error fetching sales:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Amount', 'Status', 'Date']
    const rows = purchases.map(p => [
      p.name,
      p.email,
      p.phone,
      p.amount,
      p.status,
      new Date(p.created_at).toLocaleDateString()
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `poetry-sales-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-500">Loading sales data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-8">
      <div className="container-custom max-w-6xl px-4 sm:px-6 mx-auto">
        
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-amber-500 mb-6 hover:gap-3 transition-all">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text-gold">Poetry Sales</h1>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4 text-center">
            <ShoppingBag className="mx-auto mb-2 text-amber-500" size={24} />
            <div className="text-2xl font-bold">{stats.totalSales}</div>
            <div className="text-xs text-gray-500">Total Sales</div>
          </div>
          <div className="glass-card p-4 text-center">
            <DollarSign className="mx-auto mb-2 text-green-500" size={24} />
            <div className="text-2xl font-bold">MK {stats.totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Revenue</div>
          </div>
          <div className="glass-card p-4 text-center">
            <CheckCircle className="mx-auto mb-2 text-green-500" size={24} />
            <div className="text-2xl font-bold">{stats.completedCount}</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div className="glass-card p-4 text-center">
            <Clock className="mx-auto mb-2 text-yellow-500" size={24} />
            <div className="text-2xl font-bold">{stats.pendingCount}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
        </div>

        {/* Purchases Table */}
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr className="text-left">
                <th className="p-4">Customer</th>
                <th className="p-4">Email</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No purchases yet
                   </td>
                </tr>
              ) : (
                purchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                    <td className="p-4 font-medium">{purchase.name}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{purchase.email}</td>
                    <td className="p-4">MK {purchase.amount}</td>
                    <td className="p-4">
                      {purchase.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-green-500">
                          <CheckCircle size={12} /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-yellow-500">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-500 text-xs">
                      {new Date(purchase.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}