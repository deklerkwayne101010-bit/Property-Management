'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Calendar, Home, Wrench } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'

export default function ClientMaintenancePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const maintenanceItems = [
    {
      id: '1',
      propertyName: 'Beachfront Villa',
      title: 'Deep Cleaning',
      type: 'cleaning',
      scheduledDate: '2025-01-14',
      status: 'completed',
      completedDate: '2025-01-14'
    },
    {
      id: '2',
      propertyName: 'Mountain Cabin',
      title: 'HVAC Maintenance',
      type: 'maintenance',
      scheduledDate: '2025-01-16',
      status: 'scheduled'
    }
  ]

  const typeVariants = {
    cleaning: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-orange-100 text-orange-800'
  }

  const statusVariants = {
    scheduled: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800'
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance & Cleaning</h1>
          <p className="mt-2 text-gray-600">Track maintenance and cleaning schedules for your properties</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {maintenanceItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-6">
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
                    <p className="text-sm text-gray-600">{item.propertyName}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeVariants[item.type as keyof typeof typeVariants]}`}>
                    {item.type}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusVariants[item.status as keyof typeof statusVariants]}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Scheduled: {new Date(item.scheduledDate).toLocaleDateString()}
                </div>
                {item.completedDate && (
                  <div className="text-sm text-gray-600">
                    Completed: {new Date(item.completedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}