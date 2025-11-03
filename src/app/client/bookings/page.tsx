'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Calendar, Users, DollarSign, Eye } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { BookingWithRelations } from '@/types'
import { formatCurrency } from '@/lib/utils'

const statusVariants = {
  confirmed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800'
}

export default function ClientBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'client') {
      router.push('/login')
      return
    }

    fetchClientBookings()
  }, [session, status, router])

  const fetchClientBookings = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/bookings')
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }

      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    return statusVariants[status as keyof typeof statusVariants] || 'bg-gray-100 text-gray-800'
  }

  const getPropertyName = (booking: BookingWithRelations) => {
    return booking.property?.name || 'Unknown Property'
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
              onClick={fetchClientBookings}
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
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="mt-2 text-gray-600">View and manage bookings for your properties</p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-4">
              You don't have any bookings for your properties yet.
            </p>
            <p className="text-sm text-gray-500">
              Bookings will appear here once guests make reservations.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property & Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates & Guests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{getPropertyName(booking)}</div>
                        <div className="text-sm text-gray-500">{booking.guestName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </div>
                      <div className="flex items-center text-gray-500 mt-1">
                        <Users className="h-4 w-4 mr-1" />
                        {booking.guests} guests
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatCurrency(booking.totalAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <Link
                        href={`/client/bookings/${booking.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary Stats */}
        {bookings.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(bookings.reduce((sum, b) => sum + b.totalAmount, 0))}
                </div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}