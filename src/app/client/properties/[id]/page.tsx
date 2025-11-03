'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Users, 
  Star, 
  Calendar,
  DollarSign,
  TrendingUp,
  Building2,
  Clock,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { PropertyWithRelations } from '@/types'
import { formatCurrency } from '@/lib/utils'

export default function ClientPropertyDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [property, setProperty] = useState<PropertyWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'client') {
      router.push('/login')
      return
    }

    fetchPropertyDetails()
  }, [session, status, router])

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true)
      setError('')
      
      const { id } = await params
      
      const response = await fetch(`/api/properties/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch property details')
      }

      const data = await response.json()
      setProperty(data.property)
    } catch (error) {
      console.error('Error fetching property details:', error)
      setError('Failed to load property details')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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

  if (error || !property) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Property not found'}</p>
            <Link
              href="/client/properties"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Back to Properties
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/client/properties"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-2 inline-block"
            >
              ← Back to Properties
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin className="h-4 w-4 mr-1" />
              {property.address}, {property.city}, {property.country}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Property ID</div>
            <div className="text-lg font-mono text-gray-900">{property.id.slice(0, 8)}</div>
          </div>
        </div>

        {/* Property Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center">
                <Bed className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                  <div className="font-medium">{property.bedrooms}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Bath className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                  <div className="font-medium">{property.bathrooms}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-600">Max Guests</div>
                  <div className="font-medium">{property.maxGuests}</div>
                </div>
              </div>
            </div>

            {property.description && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{property.description}</p>
              </div>
            )}

            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Total Bookings</span>
                </div>
                <span className="font-medium">{property._count?.bookings || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Maintenance Tasks</span>
                </div>
                <span className="font-medium">{property._count?.maintenance || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-sm text-gray-600">Photo Updates</span>
                </div>
                <span className="font-medium">{property._count?.photoGalleries || 0}</span>
              </div>

              <div className="pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(((property._count?.bookings || 0) * 2 / 30) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Estimated Occupancy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          <div className="p-6">
            {property.bookings && property.bookings.length > 0 ? (
              <div className="space-y-4">
                {property.bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{booking.guestName}</div>
                      <div className="text-sm text-gray-600">
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </div>
                      <div className="text-sm text-gray-600">{booking.guests} guests</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(booking.totalAmount)}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No bookings found for this property.
              </div>
            )}
          </div>
        </div>

        {/* Maintenance History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Maintenance History</h2>
          </div>
          <div className="p-6">
            {property.maintenance && property.maintenance.length > 0 ? (
              <div className="space-y-4">
                {property.maintenance.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      {task.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      ) : task.status === 'in_progress' ? (
                        <Clock className="h-5 w-5 text-blue-500 mr-3" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-600">{task.type}</div>
                        <div className="text-sm text-gray-600">
                          Scheduled: {formatDate(task.scheduledDate)}
                        </div>
                        {task.description && (
                          <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                        )}
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMaintenanceStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No maintenance tasks found for this property.
              </div>
            )}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Photo Updates</h2>
          </div>
          <div className="p-6">
            {property.photoGalleries && property.photoGalleries.length > 0 ? (
              <div className="space-y-6">
                {property.photoGalleries.map((gallery) => (
                  <div key={gallery.id}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{gallery.title}</h3>
                      <div className="text-sm text-gray-600">
                        {gallery.month && gallery.year ? 
                          `${new Date(0, gallery.month - 1).toLocaleString('en-US', { month: 'long' })} ${gallery.year}` :
                          formatDate(gallery.createdAt)
                        }
                      </div>
                    </div>
                    {gallery.description && (
                      <p className="text-sm text-gray-600 mb-3">{gallery.description}</p>
                    )}
                    {gallery.photos && gallery.photos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {gallery.photos.slice(0, 8).map((photo, index) => (
                          <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={photo}
                              alt={`${gallery.title} - Photo ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No photo updates available for this property.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}