'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Home, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Camera,
  Wrench,
  MessageSquare,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { StatsCard } from '@/components/stats-card'
import { ClientPropertyCard } from '@/components/client-property-card'
import { UpcomingMaintenanceList } from '@/components/upcoming-maintenance-list'
import { formatCurrency } from '@/lib/utils'

interface ClientDashboardStats {
  totalProperties: number
  currentOccupancy: number
  monthlyRevenue: number
  totalBookings: number
  avgRating: number
  upcomingCleanings: number
}

export default function ClientDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<ClientDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'client') {
      router.push('/login')
      return
    }

    // Fetch dashboard stats
    fetchDashboardStats()
  }, [session, status, router])

  const fetchDashboardStats = async () => {
    try {
      // Mock data for client dashboard
      const mockStats: ClientDashboardStats = {
        totalProperties: 3,
        currentOccupancy: 75,
        monthlyRevenue: 8500,
        totalBookings: 24,
        avgRating: 4.8,
        upcomingCleanings: 1
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

  if (!session || session.user.role !== 'client') {
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
            Here's how your properties are performing this month.
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Properties"
              value={stats.totalProperties}
              icon={Home}
              color="blue"
              change="All active"
            />
            <StatsCard
              title="Current Occupancy"
              value={`${stats.currentOccupancy}%`}
              icon={TrendingUp}
              color="green"
              change="+8% from last month"
            />
            <StatsCard
              title="Monthly Revenue"
              value={formatCurrency(stats.monthlyRevenue)}
              icon={DollarSign}
              color="purple"
              change="+15% from last month"
            />
          </div>
        )}

        {/* Property Performance Summary */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Properties</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ClientPropertyCard
                name="Beachfront Villa"
                location="Miami, FL"
                occupancy={85}
                monthlyRevenue={4200}
                lastInspection="2025-01-05"
                nextMaintenance="2025-01-20"
                photos={12}
              />
              <ClientPropertyCard
                name="Mountain Cabin"
                location="Aspen, CO"
                occupancy={60}
                monthlyRevenue={3100}
                lastInspection="2025-01-08"
                nextMaintenance="2025-01-25"
                photos={8}
              />
              <ClientPropertyCard
                name="City Apartment"
                location="New York, NY"
                occupancy={80}
                monthlyRevenue={1200}
                lastInspection="2025-01-10"
                nextMaintenance="2025-01-30"
                photos={15}
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                <span className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer">
                  View all
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">John Smith</p>
                    <p className="text-sm text-gray-500">Beachfront Villa • Jan 15-20</p>
                    <p className="text-sm text-gray-500">4 guests • {formatCurrency(1200)}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Confirmed
                  </span>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Mountain Cabin • Jan 18-25</p>
                    <p className="text-sm text-gray-500">2 guests • {formatCurrency(980)}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mike Davis</p>
                    <p className="text-sm text-gray-500">City Apartment • Jan 22-24</p>
                    <p className="text-sm text-gray-500">1 guest • {formatCurrency(300)}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Maintenance */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Maintenance</h2>
                <span className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer">
                  View all
                </span>
              </div>
            </div>
            <UpcomingMaintenanceList />
          </div>
        </div>

        {/* Photo Updates & Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Photo Updates */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Photo Updates</h2>
                <span className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer">
                  View gallery
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Camera className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Monthly Update - January</p>
                    <p className="text-sm text-gray-500">Beachfront Villa • 5 photos uploaded</p>
                    <p className="text-xs text-gray-400">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Inspection Complete</p>
                    <p className="text-sm text-gray-500">Mountain Cabin • All systems checked</p>
                    <p className="text-xs text-gray-400">5 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Messages & Notifications */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Messages & Notifications</h2>
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New Booking Alert</p>
                    <p className="text-sm text-gray-500">Your Beachfront Villa has a new booking request</p>
                    <p className="text-xs text-gray-400">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Maintenance Completed</p>
                    <p className="text-sm text-gray-500">City Apartment HVAC service completed successfully</p>
                    <p className="text-xs text-gray-400">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}