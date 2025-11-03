'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import React from 'react'

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
  isActive: z.boolean(),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface Owner {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface Property {
  id: string
  name: string
  address: string
  city: string
  country: string
  description: string | null
  bedrooms: number
  bathrooms: number
  maxGuests: number
  amenities: string | null
  photos: string | null
  isActive: boolean
  ownerId: string
  createdAt: string
  updatedAt: string
}

export default function EditPropertyPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [owners, setOwners] = useState<Owner[]>([])
  const [property, setProperty] = useState<Property | null>(null)
  const [propertyId, setPropertyId] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  })

  // Unwrap params using React.use() for Next.js 15.5.6 compatibility
  const resolvedParams = React.use(params)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'admin') {
      router.push('/login')
      return
    }

    const id = resolvedParams.id
    setPropertyId(id)
    loadProperty(id)
    loadOwners()
  }, [session, status, router, resolvedParams.id])

  const loadProperty = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/properties/${id}`)
      
      if (!response.ok) {
        throw new Error('Property not found')
      }
      
      const data = await response.json()
      const prop = data.property
      
      // Parse amenities from JSON string to comma-separated string for form
      let amenitiesString = ''
      if (prop.amenities) {
        try {
          const amenitiesArray = JSON.parse(prop.amenities)
          amenitiesString = Array.isArray(amenitiesArray) ? amenitiesArray.join(', ') : ''
        } catch {
          amenitiesString = ''
        }
      }

      setProperty(prop)
      
      // Set form values
      setValue('name', prop.name)
      setValue('address', prop.address)
      setValue('city', prop.city)
      setValue('country', prop.country)
      setValue('description', prop.description || '')
      setValue('bedrooms', prop.bedrooms)
      setValue('bathrooms', prop.bathrooms)
      setValue('maxGuests', prop.maxGuests)
      setValue('ownerId', prop.ownerId)
      setValue('amenities', amenitiesString)
      setValue('isActive', prop.isActive)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load property')
    } finally {
      setLoading(false)
    }
  }

  const loadOwners = async () => {
    try {
      const response = await fetch('/api/users?role=client')
      if (response.ok) {
        const data = await response.json()
        setOwners(data.users || [])
      }
    } catch (error) {
      console.error('Failed to load owners:', error)
    }
  }

  const onSubmit = async (data: PropertyFormData) => {
    if (!propertyId) return
    
    setSaving(true)
    setError('')

    try {
      const amenitiesArray = data.amenities
        ? data.amenities.split(',').map(a => a.trim()).filter(Boolean)
        : []

      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          amenities: amenitiesArray,
          photos: property?.photos ? JSON.parse(property.photos) : []
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update property')
      }

      router.push(`/admin/properties/${propertyId}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
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

  if (error && !property) {
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
            <p className="mt-1 text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link
            href={`/admin/properties/${propertyId}`}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Property Details
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update property information and details
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
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.firstName} {owner.lastName} ({owner.email})
                    </option>
                  ))}
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

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    {...register('isActive')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Property is active
                  </label>
                </div>
                {errors.isActive && (
                  <p className="mt-1 text-sm text-red-600">{errors.isActive.message}</p>
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

          {/* Photo Section (Read-only for now) */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Photos
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Photo management will be implemented separately with Cloudinary integration.
            </p>
            {property?.photos && (
              <div className="text-sm text-gray-600">
                Property currently has photos attached.
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <Link
              href={`/admin/properties/${propertyId}`}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}