'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Plus, Search, Users, Mail, Phone, Building2, Edit, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'

interface Owner {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  isActive: boolean
  createdAt: string
  _count: {
    properties: number
    sentMessages: number
    receivedMessages: number
  }
}

export default function AdminOwnersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'admin') {
      router.push('/login')
      return
    }

    loadOwners()
  }, [session, status, router])

  const loadOwners = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users?role=client')
      
      if (!response.ok) {
        throw new Error('Failed to load owners')
      }
      
      const data = await response.json()
      setOwners(data.users || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load owners')
    } finally {
      setLoading(false)
    }
  }

  const filteredOwners = owners.filter(owner =>
    owner.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleOwnerStatus = async (ownerId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/users/${ownerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        // Update local state
        setOwners(prev => prev.map(owner => 
          owner.id === ownerId ? { ...owner, isActive: !isActive } : owner
        ))
      }
    } catch (error) {
      console.error('Failed to update owner status:', error)
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
            <h1 className="text-3xl font-bold text-gray-900">Property Owners</h1>
            <p className="mt-2 text-gray-600">Manage property owner accounts and relationships</p>
          </div>
          <Link
            href="/admin/owners/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Owner
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredOwners.length} of {owners.length} owners
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Owners Grid */}
        {filteredOwners.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No property owners found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first property owner.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Link
                  href="/admin/owners/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Owner
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOwners.map((owner) => (
              <div key={owner.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {owner.firstName} {owner.lastName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-500">Property Owner</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          owner.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {owner.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {owner.email}
                    </div>
                    {owner.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {owner.phone}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="h-4 w-4 mr-2" />
                      {owner._count.properties} properties
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Joined: {new Date(owner.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => toggleOwnerStatus(owner.id, owner.isActive)}
                          className={`text-sm font-medium ${
                            owner.isActive 
                              ? 'text-red-600 hover:text-red-700' 
                              : 'text-green-600 hover:text-green-700'
                          }`}
                        >
                          {owner.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}