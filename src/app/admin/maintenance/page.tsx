'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Calendar, Home, Wrench, Edit2, CheckCircle, XCircle, Eye } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { formatDate } from '@/lib/utils'

interface MaintenanceWithProperty {
  id: string
  title: string
  description: string
  type: 'cleaning' | 'maintenance'
  scheduledDate: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  assignedTo?: string
  completedDate?: string
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

const typeVariants = {
  cleaning: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-orange-100 text-orange-800'
}

const statusVariants = {
  scheduled: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

export default function AdminMaintenancePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [maintenance, setMaintenance] = useState<MaintenanceWithProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'admin') {
      router.push('/login')
      return
    }

    loadMaintenance()
  }, [session, status, router, page, filterType, filterStatus, searchTerm])

  const loadMaintenance = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      })
      
      if (filterType !== 'all') {
        params.append('type', filterType)
      }
      
      if (filterStatus !== 'all') {
        params.append('status', filterStatus)
      }
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/maintenance?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to load maintenance tasks')
      }
      
      const data = await response.json()
      setMaintenance(data.maintenance)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error('Error loading maintenance:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMaintenance = maintenance.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.property.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.type === filterType
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setPage(1) // Reset to first page when searching
  }

  const handleMarkComplete = async (id: string) => {
    try {
      const response = await fetch(`/api/maintenance/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'completed' })
      })

      if (!response.ok) {
        throw new Error('Failed to mark task as completed')
      }

      // Reload data to show updated status
      await loadMaintenance()
    } catch (error) {
      console.error('Error marking task complete:', error)
      alert('Failed to mark task as completed')
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance & Cleaning</h1>
            <p className="mt-2 text-gray-600">Schedule and track property maintenance activities</p>
          </div>
          <Link href="/admin/maintenance/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Schedule Task
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by task name or property..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="cleaning">Cleaning</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Maintenance Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMaintenance.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${item.type === 'cleaning' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                      {item.type === 'cleaning' ? (
                        <Home className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Wrench className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.property.name} - {item.property.city}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeVariants[item.type]}`}>
                      {item.type}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusVariants[item.status]}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Scheduled: {formatDate(new Date(item.scheduledDate))}</span>
                  </div>
                  {item.completedDate && (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Completed: {formatDate(new Date(item.completedDate))}</span>
                    </div>
                  )}
                  {item.assignedTo && (
                    <div className="text-sm text-gray-600">
                      Assigned to: {item.assignedTo}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Created: {formatDate(new Date(item.createdAt))}
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/maintenance/${item.id}/edit`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                    <Link
                      href={`/admin/maintenance/${item.id}/edit`}
                      className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Link>
                    {item.status !== 'completed' && item.status !== 'cancelled' && (
                      <button
                        onClick={() => handleMarkComplete(item.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, filteredMaintenance.length)} of {filteredMaintenance.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {filteredMaintenance.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No maintenance tasks found</div>
            <p className="text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}