'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { use } from 'react'
import { ArrowLeft, Save, XCircle, Calendar, Users, DollarSign, MapPin, User } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { formatDate, formatCurrency } from '@/lib/utils'

interface BookingWithProperty {
  id: string
  guestName: string
  guestEmail: string
  guestPhone?: string
  checkIn: string
  checkOut: string
  guests: number
  totalAmount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  createdAt: string
  updatedAt: string
  property: {
    id: string
    name: string
    city: string
    address: string
    bedrooms: number
    bathrooms: number
    maxGuests: number
    owner: {
      firstName: string
      lastName: string
      email: string
      phone?: string
    }
  }
}

interface Property {
  id: string
  name: string
  city: string
  maxGuests: number
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
  { value: 'confirmed', label: 'Confirmed', color: 'text-green-600' },
  { value: 'completed', label: 'Completed', color: 'text-blue-600' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' }
]

export default function EditBookingPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [booking, setBooking] = useState<BookingWithProperty | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    propertyId: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    totalAmount: 0,
    status: 'pending',
    notes: ''
  })

  // Unwrap params using use() for Next.js 15.5.6 compatibility
  const resolvedParams = use(params)
  const bookingId = resolvedParams.id

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'admin') {
      router.push('/login')
      return
    }

    loadBooking(bookingId)
    loadProperties()
  }, [session, status, router, bookingId])

  const loadBooking = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/bookings/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Booking not found')
        }
        throw new Error('Failed to load booking')
      }
      
      const data = await response.json()
      const bookingData = data.booking
      
      setBooking(bookingData)
      
      // Populate form data
      setFormData({
        guestName: bookingData.guestName || '',
        guestEmail: bookingData.guestEmail || '',
        guestPhone: bookingData.guestPhone || '',
        propertyId: bookingData.property.id || '',
        checkIn: bookingData.checkIn ? new Date(bookingData.checkIn).toISOString().split('T')[0] : '',
        checkOut: bookingData.checkOut ? new Date(bookingData.checkOut).toISOString().split('T')[0] : '',
        guests: bookingData.guests || 1,
        totalAmount: bookingData.totalAmount || 0,
        status: bookingData.status || 'pending',
        notes: bookingData.notes || ''
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load booking')
    } finally {
      setLoading(false)
    }
  }

  const loadProperties = async () => {
    try {
      const response = await fetch('/api/properties?limit=100')
      
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties || [])
      }
    } catch (error) {
      console.error('Error loading properties:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.guestName || !formData.guestEmail || !formData.checkIn || !formData.checkOut) {
      setError('Please fill in all required fields')
      return
    }

    if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      setError('Check-out date must be after check-in date')
      return
    }

    // Update guest count if property changed
    const selectedProperty = properties.find(p => p.id === formData.propertyId)
    if (selectedProperty && formData.guests > selectedProperty.maxGuests) {
      setError(`Property can accommodate maximum ${selectedProperty.maxGuests} guests`)
      return
    }

    try {
      setSaving(true)
      setError('')

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalAmount: parseFloat(formData.totalAmount.toString()),
          guests: parseInt(formData.guests.toString())
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update booking')
      }

      setSuccess('Booking updated successfully!')
      
      // Reload booking data
      await loadBooking(bookingId)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update booking')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelBooking = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Cancelled by admin' })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to cancel booking')
      }

      // Redirect back to bookings list
      router.push('/admin/bookings')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to cancel booking')
      setSaving(false)
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

  if (error && !booking) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/bookings"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Bookings
            </Link>
          </div>

          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Booking not found</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!booking) return null

  const selectedProperty = properties.find(p => p.id === formData.propertyId)
  const nights = formData.checkIn && formData.checkOut ? 
    Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/bookings"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Bookings
            </Link>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleCancelBooking}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
              Cancel Booking
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Booking</h1>
          <p className="mt-2 text-gray-600">Booking #{booking.id.slice(-8).toUpperCase()}</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="mt-2 text-sm text-green-700">{success}</div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Guest Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Guest Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Guest Name *</label>
                  <input
                    type="text"
                    name="guestName"
                    required
                    value={formData.guestName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="guestEmail"
                    required
                    value={formData.guestEmail}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="guestPhone"
                    value={formData.guestPhone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Property Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Property *</label>
                  <select
                    name="propertyId"
                    required
                    value={formData.propertyId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a property</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.name} - {property.city} (Max {property.maxGuests} guests)
                      </option>
                    ))}
                  </select>
                </div>
                {selectedProperty && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">
                      Max capacity: {selectedProperty.maxGuests} guests
                    </p>
                    <p className="text-sm text-gray-600">
                      Current booking: {formData.guests} guests
                    </p>
                    {formData.guests > selectedProperty.maxGuests && (
                      <p className="text-sm text-red-600 font-medium">
                        Warning: Exceeds property capacity!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Booking Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Check-in Date *</label>
                <input
                  type="date"
                  name="checkIn"
                  required
                  value={formData.checkIn}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Check-out Date *</label>
                <input
                  type="date"
                  name="checkOut"
                  required
                  value={formData.checkOut}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Guests *</label>
                <input
                  type="number"
                  name="guests"
                  min="1"
                  max={selectedProperty?.maxGuests || 20}
                  required
                  value={formData.guests}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount *</label>
                <div className="mt-1 relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="totalAmount"
                    min="0"
                    step="0.01"
                    required
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    className="pl-7 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {nights > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nights</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                    {nights} night{nights !== 1 ? 's' : ''} • {nights > 0 ? formatCurrency(formData.totalAmount / nights) : '$0'} per night
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
            <textarea
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes about this booking..."
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/bookings"
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}