'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect, use } from 'react'
import { ArrowLeft, Edit, Trash2, Calendar, Users, DollarSign, MapPin } from 'lucide-react'
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
    owner: {
      firstName: string
      lastName: string
      email: string
    }
  }
}

const statusVariants = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800'
}

export default function BookingDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [booking, setBooking] = useState<BookingWithProperty | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

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
      setBooking(data.booking)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load booking')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation')
      return
    }

    try {
      setCancelling(true)
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: cancelReason }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to cancel booking')
      }

      // Refresh the booking data
      await loadBooking(bookingId)
      setShowCancelModal(false)
      setCancelReason('')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to cancel booking')
    } finally {
      setCancelling(false)
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

  const checkInDate = new Date(booking.checkIn)
  const checkOutDate = new Date(booking.checkOut)
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

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
            <Link
              href={`/admin/bookings/${bookingId}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Booking
            </Link>
            <button
              onClick={() => setShowCancelModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Cancel Booking
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
          <p className="mt-2 text-gray-600">Booking #{booking.id.slice(-8).toUpperCase()}</p>
        </div>

        {/* Status and Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusVariants[booking.status]}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500">
                Created {formatDate(new Date(booking.createdAt))}
              </span>
            </div>
          </div>
        </div>

        {/* Main Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Guest Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Guest Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{booking.guestName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{booking.guestEmail}</p>
              </div>
              {booking.guestPhone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{booking.guestPhone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Property Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Property Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-gray-900 font-medium">{booking.property.name}</p>
                  <p className="text-gray-500 text-sm">{booking.property.city}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Property Owner</label>
                <p className="text-gray-900">
                  {booking.property.owner.firstName} {booking.property.owner.lastName}
                </p>
                <p className="text-gray-500 text-sm">{booking.property.owner.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Check-in</p>
                <p className="text-gray-900">{formatDate(checkInDate)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Check-out</p>
                <p className="text-gray-900">{formatDate(checkOutDate)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Guests</p>
                <p className="text-gray-900">{booking.guests} guests</p>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="text-gray-900">{formatCurrency(booking.totalAmount)}</p>
                <p className="text-gray-500 text-sm">{nights} nights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{booking.notes}</p>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cancel Booking
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to cancel this booking? Please provide a reason.
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setCancelReason('')
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}