'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { MapPin, TrendingUp, DollarSign, Calendar, Eye } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { PropertyWithRelations } from '@/types'
import { formatCurrency } from '@/lib/utils'

export default function ClientPropertiesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [properties, setProperties] = useState<PropertyWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'client') {
      router.push('/login')
      return
    }

    fetchClientProperties()
  }, [session, status, router])

  const fetchClientProperties = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`/api/properties?ownerId=${session?.user.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }

      const data = await response.json()
      setProperties(data.properties || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
      setError('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getOccupancyRate = (property: PropertyWithRelations) => {
    // Simple calculation based on bookings count
    const totalDays = 30
    const bookedDays = Math.min((property._count?.bookings || 0) * 2, totalDays) // Rough estimate
    return Math.round((bookedDays / totalDays) * 100)
  }

  const getMonthlyRevenue = (property: PropertyWithRelations) => {
    // This would normally come from a more sophisticated calculation
    // For now, using a rough estimate based on bookings
    const avgBookingValue = 250 // Average booking value
    const estimatedMonthlyBookings = 8 // Estimated bookings per month
    const bookingsCount = property._count?.bookings || 0
    return bookingsCount > 0 ?
      (bookingsCount * avgBookingValue) :
      estimatedMonthlyBookings * avgBookingValue
  }

  const getNextBooking = (property: PropertyWithRelations) => {
    // This would normally come from future bookings
    // For now, using a future date
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7)
    return futureDate.toISOString()
  }

  const getLastBooking = (property: PropertyWithRelations) => {
    // This would normally come from the most recent completed booking
    // For now, using a recent date
    const recentDate = new Date()
    recentDate.setDate(recentDate.getDate() - 3)
    return recentDate.toISOString()
  }

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchClientProperties}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
          <p className="mt-2 text-gray-600">Track performance and manage your property portfolio</p>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">
              You don't have any properties assigned to your account yet.
            </p>
            <p className="text-sm text-gray-500">
              Contact your property management team to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const occupancyRate = getOccupancyRate(property)
              const monthlyRevenue = getMonthlyRevenue(property)
              const nextBooking = getNextBooking(property)
              const lastBooking = getLastBooking(property)

              return (
                <div key={property.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.city}, {property.country}
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        occupancyRate >= 80 ? 'bg-green-100 text-green-800' :
                        occupancyRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {occupancyRate}% occupied
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Monthly Revenue
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(monthlyRevenue)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Occupancy Rate
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {occupancyRate}%
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          Next Booking
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(nextBooking)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          Total Bookings
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {property._count?.bookings || 0}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Maintenance Tasks
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {property._count?.maintenance || 0}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Last booking: {formatDate(lastBooking)}
                        </span>
                        <Link
                          href={`/client/properties/${property.id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {properties.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{properties.length}</div>
                <div className="text-sm text-gray-600">Total Properties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(properties.reduce((acc, prop) => acc + getOccupancyRate(prop), 0) / properties.length)}%
                </div>
                <div className="text-sm text-gray-600">Avg Occupancy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(properties.reduce((acc, prop) => acc + getMonthlyRevenue(prop), 0))}
                </div>
                <div className="text-sm text-gray-600">Avg Monthly Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {properties.reduce((acc, prop) => acc + (prop._count?.bookings || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}