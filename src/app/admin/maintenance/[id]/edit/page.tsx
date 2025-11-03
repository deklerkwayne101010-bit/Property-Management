'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { use } from 'react'
import { ArrowLeft, Save, Calendar, Home, Wrench, MapPin, User, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { formatDate } from '@/lib/utils'

interface MaintenanceWithProperty {
  id: string
  title: string
  description: string
  type: 'cleaning' | 'maintenance'
  scheduledDate: string
  completedDate?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  assignedTo?: string
  notes?: string
  createdAt: string
  updatedAt: string
  property: {
    id: string
    name: string
    city: string
    address: string
    owner: {
      firstName: string
      lastName: string
      email: string
    }
  }
}

interface Property {
  id: string
  name: string
  city: string
}

const statusOptions = [
  { value: 'scheduled', label: 'Scheduled', color: 'text-yellow-600' },
  { value: 'in_progress', label: 'In Progress', color: 'text-blue-600' },
  { value: 'completed', label: 'Completed', color: 'text-green-600' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' }
]

export default function EditMaintenancePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [maintenance, setMaintenance] = useState<MaintenanceWithProperty | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    propertyId: '',
    type: 'cleaning' as 'cleaning' | 'maintenance',
    title: '',
    description: '',
    scheduledDate: '',
    completedDate: '',
    status: 'scheduled' as 'scheduled' | 'in_progress' | 'completed' | 'cancelled',
    assignedTo: '',
    notes: ''
  })

  // Unwrap params using use() for Next.js 15.5.6 compatibility
  const resolvedParams = use(params)
  const maintenanceId = resolvedParams.id

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'admin') {
      router.push('/login')
      return
    }

    loadMaintenance(maintenanceId)
    loadProperties()
  }, [session, status, router, maintenanceId])

  const loadMaintenance = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/maintenance/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Maintenance task not found')
        }
        throw new Error('Failed to load maintenance task')
      }
      
      const data = await response.json()
      const maintenanceData = data.maintenance
      
      setMaintenance(maintenanceData)
      
      // Populate form data
      setFormData({
        propertyId: maintenanceData.property.id || '',
        type: maintenanceData.type || 'cleaning',
        title: maintenanceData.title || '',
        description: maintenanceData.description || '',
        scheduledDate: maintenanceData.scheduledDate ? 
          new Date(maintenanceData.scheduledDate).toISOString().slice(0, 16) : '',
        completedDate: maintenanceData.completedDate ? 
          new Date(maintenanceData.completedDate).toISOString().slice(0, 16) : '',
        status: maintenanceData.status || 'scheduled',
        assignedTo: maintenanceData.assignedTo || '',
        notes: maintenanceData.notes || ''
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load maintenance task')
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
    if (!formData.propertyId || !formData.title || !formData.scheduledDate) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setSaving(true)
      setError('')

      const response = await fetch(`/api/maintenance/${maintenanceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          scheduledDate: new Date(formData.scheduledDate).toISOString(),
          completedDate: formData.completedDate ? new Date(formData.completedDate).toISOString() : null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update maintenance task')
      }

      setSuccess('Maintenance task updated successfully!')
      
      // Reload maintenance data
      await loadMaintenance(maintenanceId)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update maintenance task')
    } finally {
      setSaving(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!confirm('Are you sure you want to mark this task as completed?')) {
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/maintenance/${maintenanceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'completed',
          completedDate: new Date().toISOString()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to mark task as completed')
      }

      setSuccess('Task marked as completed!')
      
      // Reload maintenance data
      await loadMaintenance(maintenanceId)
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to mark task as completed')
      setSaving(false)
    }
  }

  const handleCancel = async () => {
    const reason = prompt('Please provide a reason for cancellation:')
    if (!reason) return

    try {
      setSaving(true)
      const response = await fetch(`/api/maintenance/${maintenanceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to cancel task')
      }

      // Redirect back to maintenance list
      router.push('/admin/maintenance')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to cancel task')
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

  if (error && !maintenance) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/maintenance"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Maintenance
            </Link>
          </div>

          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Maintenance task not found</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!maintenance) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/maintenance"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Maintenance
            </Link>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleMarkComplete}
              disabled={saving || formData.status === 'completed'}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              Mark Complete
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
              Cancel Task
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Maintenance Task</h1>
          <p className="mt-2 text-gray-600">Task #{maintenance.id.slice(-8).toUpperCase()}</p>
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
            {/* Task Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Task Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Task Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    disabled={maintenance.status === 'completed'}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="cleaning">Cleaning</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Task Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={maintenance.status === 'completed'}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={maintenance.status === 'completed'}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
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
              </div>
            </div>

            {/* Property & Scheduling */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Property & Scheduling
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Property</label>
                  <select
                    name="propertyId"
                    value={formData.propertyId}
                    onChange={handleInputChange}
                    disabled={maintenance.status === 'completed'}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select a property</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.name} - {property.city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Scheduled Date & Time</label>
                  <input
                    type="datetime-local"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    disabled={maintenance.status === 'completed'}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Completed Date & Time</label>
                  <input
                    type="datetime-local"
                    name="completedDate"
                    value={formData.completedDate}
                    onChange={handleInputChange}
                    disabled={formData.status !== 'completed'}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    disabled={maintenance.status === 'completed'}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
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
              disabled={maintenance.status === 'completed'}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/maintenance"
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || maintenance.status === 'completed'}
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