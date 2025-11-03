'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'

interface Property {
  id: string
  name: string
  address: string
  city: string
  country: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  isActive: boolean
  createdAt: string
  owner: {
    firstName: string
    lastName: string
  }
  _count: {
    bookings: number
    maintenance: number
  }
}

export default function AdminPropertiesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'admin') {
      router.push('/login')
      return
    }

    loadProperties()
  }, [session, status, router])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/properties')
      
      if (!response.ok) {
        throw new Error('Failed to load properties')
      }
      
      const data = await response.json()
      setProperties(data.properties || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (propertyId: string, propertyName: string) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete property')
      }

      // Refresh properties list
      loadProperties()
      setDeleteConfirm(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete property')
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && property.isActive) ||
                         (filterStatus === 'inactive' && !property.isActive)
    
    return matchesSearch && matchesFilter
  })

  if (status === 'loading' || loading) {
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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
            <p className="mt-2 text-gray-600">Manage all properties in your portfolio</p>
          </div>
          <Link
            href="/admin/properties/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Properties</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Properties Grid */}
        {filteredProperties.length === 0 && !error ? (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first property.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Link
                  href="/admin/properties/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
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
                      property.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {property.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {property.bedrooms} bed, {property.bathrooms} bath • Max {property.maxGuests} guests
                    </div>
                    <div className="text-sm text-gray-600">
                      Owner: {property.owner.firstName} {property.owner.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Address: {property.address}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>{property._count.bookings} bookings</span>
                      <span>{property._count.maintenance} maintenance</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        title="Edit Property"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(property.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                        title="Delete Property"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <Link
                      href={`/admin/properties/${property.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg font-medium text-gray-900">Delete Property</h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this property? This action cannot be undone.
                    Properties with existing bookings cannot be deleted.
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <div className="flex space-x-3 justify-center">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(deleteConfirm, 'Property')}
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