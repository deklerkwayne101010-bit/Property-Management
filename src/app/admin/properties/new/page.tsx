'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import Link from 'next/link'

const propertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  description: z.string().optional(),
  bedrooms: z.coerce.number().min(1, 'Must have at least 1 bedroom'),
  bathrooms: z.coerce.number().min(1, 'Must have at least 1 bathroom'),
  maxGuests: z.coerce.number().min(1, 'Must accommodate at least 1 guest'),
  ownerId: z.string().min(1, 'Property owner is required'),
  amenities: z.string().optional(),
})

type PropertyFormData = z.infer<typeof propertySchema>

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      country: 'South Africa'
    }
  })

  const onSubmit = async (data: PropertyFormData) => {
    setLoading(true)
    setError('')

    try {
      const amenitiesArray = data.amenities 
        ? data.amenities.split(',').map(a => a.trim()).filter(Boolean)
        : []

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          amenities: amenitiesArray,
          photos: [] // Will be handled separately with file uploads
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create property')
      }

      const property = await response.json()
      router.push('/admin/properties')
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
          href="/admin/properties"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Properties
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a new rental property for management
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Property Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Property Details
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Property Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Name *
              </label>
              <input
                {...register('name')}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Beachfront Villa"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Owner */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Owner *
              </label>
              <select
                {...register('ownerId')}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Owner</option>
                {/* This would be populated from API */}
                <option value="client_user_123">John Doe</option>
              </select>
              {errors.ownerId && (
                <p className="mt-1 text-sm text-red-600">{errors.ownerId.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Street Address *
              </label>
              <input
                {...register('address')}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="123 Ocean Drive"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City *
              </label>
              <input
                {...register('city')}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Cape Town"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country *
              </label>
              <input
                {...register('country')}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bedrooms *
              </label>
              <input
                {...register('bedrooms')}
                type="number"
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="4"
              />
              {errors.bedrooms && (
                <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>
              )}
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bathrooms *
              </label>
              <input
                {...register('bathrooms')}
                type="number"
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="3"
              />
              {errors.bathrooms && (
                <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>
              )}
            </div>

            {/* Max Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Guests *
              </label>
              <input
                {...register('maxGuests')}
                type="number"
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="8"
              />
              {errors.maxGuests && (
                <p className="mt-1 text-sm text-red-600">{errors.maxGuests.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the property, its features, and what makes it special..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Amenities */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Amenities
            </label>
            <textarea
              {...register('amenities')}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="WiFi, Pool, Beach Access, Parking, Air Conditioning (comma-separated)"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter amenities separated by commas
            </p>
            {errors.amenities && (
              <p className="mt-1 text-sm text-red-600">{errors.amenities.message}</p>
            )}
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Photos
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload property photos
                </span>
                <span className="mt-1 block text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </span>
                <input
                  type="file"
                  className="sr-only"
                  multiple
                  accept="image/*"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Photo upload functionality will be implemented with Cloudinary
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <Link
            href="/admin/properties"
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
            {loading ? 'Creating...' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  )
}