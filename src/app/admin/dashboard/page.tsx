'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Home, 
  Users, 
  Calendar, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { StatsCard } from '@/components/stats-card'
import { RecentBookingsTable } from '@/components/recent-bookings-table'
import { UpcomingMaintenanceList } from '@/components/upcoming-maintenance-list'
import { formatCurrency } from '@/lib/utils'

interface DashboardStats {
  totalProperties: number
  currentOccupancy: number
  upcomingCleanings: number
  pendingReports: number
  monthlyRevenue: number
  yearlyRevenue: number
  totalBookings: number
  activeOwners: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'admin') {
      router.push('/login')
      return
    }

    // Fetch dashboard stats
    fetchDashboardStats()
  }, [session, status, router])

  const fetchDashboardStats = async () => {
    try {
      // This would be replaced with actual API call
      const mockStats: DashboardStats = {
        totalProperties: 24,
        currentOccupancy: 68,
        upcomingCleanings: 3,
        pendingReports: 2,
        monthlyRevenue: 18500,
        yearlyRevenue: 198500,
        totalBookings: 156,
        activeOwners: 12
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'admin') {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user.firstName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your properties today.
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Properties"
              value={stats.totalProperties}
              icon={Building2}
              color="blue"
              change="+2 this month"
            />
            <StatsCard
              title="Current Occupancy"
              value={`${stats.currentOccupancy}%`}
              icon={TrendingUp}
              color="green"
              change="+5% from last month"
            />
            <StatsCard
              title="Monthly Revenue"
              value={formatCurrency(stats.monthlyRevenue)}
              icon={DollarSign}
              color="purple"
              change="+12% from last month"
            />
            <StatsCard
              title="Active Owners"
              value={stats.activeOwners}
              icon={Users}
              color="orange"
              change="2 new this month"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/properties/new"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Building2 className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Add Property</div>
                <div className="text-sm text-gray-600">Create new listing</div>
              </div>
            </Link>
            
            <Link
              href="/admin/bookings/new"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Calendar className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">New Booking</div>
                <div className="text-sm text-gray-600">Add booking</div>
              </div>
            </Link>
            
            <Link
              href="/admin/maintenance/new"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Clock className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Schedule</div>
                <div className="text-sm text-gray-600">Maintenance/Cleaning</div>
              </div>
            </Link>
            
            <Link
              href="/admin/messages"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <AlertCircle className="h-6 w-6 text-orange-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Send Message</div>
                <div className="text-sm text-gray-600">Notify owners</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                <Link
                  href="/admin/bookings"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <RecentBookingsTable />
          </div>

          {/* Upcoming Maintenance */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Maintenance</h2>
                <Link
                  href="/admin/maintenance"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <UpcomingMaintenanceList />
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Attention Required</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>3 cleanings scheduled for tomorrow</li>
                  <li>2 inspection reports pending upload</li>
                  <li>Property #15 has no bookings for next 2 weeks</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}