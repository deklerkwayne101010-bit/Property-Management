'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, Users, DollarSign, MapPin, Phone, Mail } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { BookingWithRelations } from '@/types'
import { formatCurrency } from '@/lib/utils'

const statusVariants = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800'
}

export default function ClientBookingDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [booking, setBooking] = useState<BookingWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'client') {
      router.push('/login')
      return
    }

    fetchBookingDetails()
  }, [session, status, router])

  const fetchBookingDetails = async () => {
    try {
      setLoading(true)
      setError('')
      
      const { id } = await params
      
      const response = await fetch(`/api/bookings/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch booking details')
      }

      const data = await response.json()
      setBooking(data.booking)
    } catch (error) {
      console.error('Error fetching booking details:', error)
      setError('Failed to load booking details')
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
    return statusVariants[status as keyof typeof statusVariants] || 'bg-gray-100 text-gray-800'
  }

  const getPropertyName = (booking: BookingWithRelations) => {
    return booking.property?.name || 'Unknown Property'
  }

  const getPropertyLocation = (booking: BookingWithRelations) => {
    if (booking.property) {
      return `${booking.property.city}, ${booking.property.country}`
    }
    return 'Location not available'
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

  if (error || !booking) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
            <Link
              href="/client/bookings"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Back to Bookings
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

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
              href="/client/bookings"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Bookings
            </Link>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
          <p className="mt-2 text-gray-600">Booking #{booking.id.slice(-8).toUpperCase()}</p>
        </div>

        {/* Status and Date */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500">
                Created {formatDate(booking.createdAt)}
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
                <label className="text-sm font-medium text-gray-500">Guest Name</label>
                <div className="flex items-center mt-1">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-gray-900">{booking.guestName}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="flex items-center mt-1">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-gray-900">{booking.guestEmail}</p>
                </div>
              </div>
              {booking.guestPhone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <div className="flex items-center mt-1">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{booking.guestPhone}</p>
                  </div>
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
                  <p className="text-gray-900 font-medium">{getPropertyName(booking)}</p>
                  <p className="text-gray-500 text-sm">{getPropertyLocation(booking)}</p>
                </div>
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
                <p className="text-gray-900">{formatDate(checkInDate.toISOString())}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Check-out</p>
                <p className="text-gray-900">{formatDate(checkOutDate.toISOString())}</p>
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

        {/* Additional Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Booking Duration</label>
              <p className="text-gray-900 mt-1">{nights} night{nights !== 1 ? 's' : ''}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Daily Rate</label>
              <p className="text-gray-900 mt-1">{formatCurrency(Math.round(booking.totalAmount / nights))}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-gray-900 mt-1">{formatDateTime(booking.updatedAt)}</p>
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

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex space-x-4">
            <Link
              href={`/client/properties/${booking.propertyId}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              View Property
            </Link>
            <Link
              href="/client/messages"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Contact Admin
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}