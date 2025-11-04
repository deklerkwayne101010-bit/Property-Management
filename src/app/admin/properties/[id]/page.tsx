'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, Edit, Trash2, MapPin, Users, Calendar, Wrench, Camera } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'

interface PropertyDetails {
  id: string
  name: string
  address: string
  city: string
  country: string
  description: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  amenities: string | null
  photos: string | null
  isActive: boolean
  createdAt: string
  owner: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  bookings: Array<{
    id: string
    guestName: string
    guestEmail: string
    checkIn: string
    checkOut: string
    guests: number
    totalAmount: number
    status: string
  }>
  maintenance: Array<{
    id: string
    type: string
    title: string
    scheduledDate: string
    status: string
  }>
  photoGalleries: Array<{
    id: string
    title: string
    description: string
    photos: string
    createdAt: string
  }>
  _count: {
    bookings: number
    maintenance: number
    photoGalleries: number
  }
}

export default function PropertyDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [property, setProperty] = useState<PropertyDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [propertyId, setPropertyId] = useState<string>('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'admin') {
      router.push('/login')
      return
    }

    const initializeProperty = async () => {
      const resolvedParams = await params
      setPropertyId(resolvedParams.id)
      loadProperty(resolvedParams.id)
    }

    initializeProperty()
  }, [session, status, router])

  const loadProperty = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/properties/${id}`)
      
      if (!response.ok) {
        throw new Error('Property not found')
      }
      
      const data = await response.json()
      setProperty(data.property)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load property')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete property')
      }

      router.push('/admin/properties')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete property')
    }
  }

  const parseJsonArray = (jsonString: string | null) => {
    if (!jsonString) return []
    try {
      return JSON.parse(jsonString)
    } catch {
      return []
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
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/properties"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Properties
            </Link>
          </div>

          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Property not found</h3>
            <p className="mt-1 text-sm text-gray-500">{error || 'The property you are looking for does not exist.'}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const amenities = parseJsonArray(property.amenities)
  const photos = parseJsonArray(property.photos)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/properties"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Properties
            </Link>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/admin/properties/${property.id}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Property
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Property
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Property Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin className="h-5 w-5 mr-2" />
                {property.address}, {property.city}, {property.country}
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              property.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {property.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2" />
              {property.bedrooms} bed • {property.bathrooms} bath • Max {property.maxGuests} guests
            </div>
            <div className="text-gray-600">
              Owner: {property.owner.firstName} {property.owner.lastName}
            </div>
            <div className="text-gray-600">
              Created: {new Date(property.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {property.description && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-2">
                  {amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <div className="h-2 w-2 bg-blue-600 rounded-full mr-2"></div>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photos */}
            {photos.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Photos ({photos.length})
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {photos.map((photo: string, index: number) => (
                    <div key={index} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                      <span className="ml-2 text-sm text-gray-500">Photo {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Bookings */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Recent Bookings ({property.bookings.length})
              </h2>
              {property.bookings.length > 0 ? (
                <div className="space-y-4">
                  {property.bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{booking.guestName}</h3>
                          <p className="text-sm text-gray-600">{booking.guestEmail}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">R{booking.totalAmount.toLocaleString()}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No bookings yet</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-medium">{property._count.bookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maintenance Records</span>
                  <span className="font-medium">{property._count.maintenance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Photo Galleries</span>
                  <span className="font-medium">{property._count.photoGalleries}</span>
                </div>
              </div>
            </div>

            {/* Owner Contact */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Owner</h2>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">{property.owner.firstName} {property.owner.lastName}</p>
                  <p className="text-sm text-gray-600">{property.owner.email}</p>
                  {property.owner.phone && (
                    <p className="text-sm text-gray-600">{property.owner.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Maintenance */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Wrench className="h-5 w-5 mr-2" />
                Recent Maintenance
              </h2>
              {property.maintenance.length > 0 ? (
                <div className="space-y-3">
                  {property.maintenance.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded p-3">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(item.scheduledDate).toLocaleDateString()}
                      </p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No maintenance records</p>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg font-medium text-gray-900">Delete Property</h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete "{property.name}"? This action cannot be undone.
                    Properties with existing bookings cannot be deleted.
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <div className="flex space-x-3 justify-center">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}