'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Download, Calendar, DollarSign } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'

export default function AdminReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'admin') {
      router.push('/login')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="mt-2 text-gray-600">Generate comprehensive reports and view analytics</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Occupancy Report */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupancy Rates</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Beachfront Villa</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mountain Cabin</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm font-medium">60%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">City Apartment</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <span className="text-sm font-medium">80%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Report */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">This Month</span>
                <span className="text-lg font-semibold text-green-600">$18,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Month</span>
                <span className="text-lg font-semibold">$16,200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Year to Date</span>
                <span className="text-lg font-semibold text-blue-600">$198,500</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance Chart</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Interactive chart would be displayed here</p>
              <p className="text-sm text-gray-400">Revenue and occupancy trends over time</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}