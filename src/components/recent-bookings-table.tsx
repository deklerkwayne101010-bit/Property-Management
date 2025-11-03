'use client'

import { Calendar, MapPin, Users } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Booking {
  id: string
  guestName: string
  propertyName: string
  checkIn: string
  checkOut: string
  guests: number
  status: 'confirmed' | 'pending' | 'cancelled'
  totalAmount: number
}

const mockBookings: Booking[] = [
  {
    id: '1',
    guestName: 'John Smith',
    propertyName: 'Beachfront Villa',
    checkIn: '2025-01-15',
    checkOut: '2025-01-20',
    guests: 4,
    status: 'confirmed',
    totalAmount: 1200
  },
  {
    id: '2',
    guestName: 'Sarah Johnson',
    propertyName: 'Mountain Cabin',
    checkIn: '2025-01-18',
    checkOut: '2025-01-25',
    guests: 2,
    status: 'pending',
    totalAmount: 980
  },
  {
    id: '3',
    guestName: 'Mike Davis',
    propertyName: 'City Apartment',
    checkIn: '2025-01-22',
    checkOut: '2025-01-24',
    guests: 1,
    status: 'confirmed',
    totalAmount: 300
  }
]

const statusVariants = {
  confirmed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800'
}

export function RecentBookingsTable() {
  return (
    <div className="overflow-hidden">
      <div className="divide-y divide-gray-200">
        {mockBookings.map((booking) => (
          <div key={booking.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{booking.guestName}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {booking.propertyName}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {booking.guests} guests
                  </div>
                  <div className="text-gray-900 font-medium">
                    {formatCurrency(booking.totalAmount)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusVariants[booking.status]}`}>
                  {booking.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}