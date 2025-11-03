'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save, Calendar, Users } from 'lucide-react'
import Link from 'next/link'

const bookingSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  guestName: z.string().min(1, 'Guest name is required'),
  guestEmail: z.string().email('Valid email is required'),
  guestPhone: z.string().optional(),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.coerce.number().min(1, 'Must have at least 1 guest'),
  totalAmount: z.coerce.number().min(0, 'Amount must be positive'),
  notes: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

export default function NewBookingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [properties, setProperties] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema)
  })

  const selectedPropertyId = watch('propertyId')

  // Load properties
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await fetch('/api/properties')
        const data = await response.json()
        setProperties(data.properties || [])
      } catch (error) {
        console.error('Failed to load properties:', error)
      }
    }
    loadProperties()
  }, [])

  // Calculate total amount when dates change
  useEffect(() => {
    if (selectedPropertyId && watch('checkIn') && watch('checkOut')) {
      const checkIn = new Date(watch('checkIn'))
      const checkOut = new Date(watch('checkOut'))
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      
      // Simple pricing calculation - would be more sophisticated in real app
      const basePrice = 2000 // R2000 per night base
      const total = nights * basePrice
      setValue('totalAmount', total)
    }
  }, [selectedPropertyId, watch('checkIn'), watch('checkOut'), setValue])

  const onSubmit = async (data: BookingFormData) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          status: 'pending'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create booking')
      }

      const booking = await response.json()
      router.push('/admin/bookings')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/bookings"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Bookings
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Booking</h1>
        <p className="mt-1 text-sm text-gray-600">
          Add a new booking for a property
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Booking Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Guest Information
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Guest Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Guest Name *
              </label>
              <input
                {...register('guestName')}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Smith"
              />
              {errors.guestName && (
                <p className="mt-1 text-sm text-red-600">{errors.guestName.message}</p>
              )}
            </div>

            {/* Guest Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Guest Email *
              </label>
              <input
                {...register('guestEmail')}
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="guest@example.com"
              />
              {errors.guestEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.guestEmail.message}</p>
              )}
            </div>

            {/* Guest Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Guest Phone
              </label>
              <input
                {...register('guestPhone')}
                type="tel"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+27 12 345 6789"
              />
              {errors.guestPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.guestPhone.message}</p>
              )}
            </div>

            {/* Number of Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Guests *
              </label>
              <input
                {...register('guests')}
                type="number"
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="4"
              />
              {errors.guests && (
                <p className="mt-1 text-sm text-red-600">{errors.guests.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Property and Dates */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Property & Dates
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Property */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Property *
              </label>
              <select
                {...register('propertyId')}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name} - {property.city}
                  </option>
                ))}
              </select>
              {errors.propertyId && (
                <p className="mt-1 text-sm text-red-600">{errors.propertyId.message}</p>
              )}
            </div>

            {/* Check-in Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Check-in Date *
              </label>
              <input
                {...register('checkIn')}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.checkIn && (
                <p className="mt-1 text-sm text-red-600">{errors.checkIn.message}</p>
              )}
            </div>

            {/* Check-out Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Check-out Date *
              </label>
              <input
                {...register('checkOut')}
                type="date"
                min={watch('checkIn') || new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.checkOut && (
                <p className="mt-1 text-sm text-red-600">{errors.checkOut.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Payment Information
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Total Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Amount (ZAR) *
              </label>
              <input
                {...register('totalAmount')}
                type="number"
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="5000.00"
              />
              {errors.totalAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.totalAmount.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Total cost for the stay
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Additional Notes
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Special requests, preferences, or additional information..."
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <Link
            href="/admin/bookings"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  )
}