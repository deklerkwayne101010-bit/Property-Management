'use client'

import { Calendar, MapPin, Wrench, Home } from 'lucide-react'

interface Maintenance {
  id: string
  propertyName: string
  title: string
  type: 'cleaning' | 'maintenance'
  scheduledDate: string
  assignedTo?: string
  status: 'scheduled' | 'in_progress' | 'completed'
}

const mockMaintenance: Maintenance[] = [
  {
    id: '1',
    propertyName: 'Beachfront Villa',
    title: 'Deep Cleaning',
    type: 'cleaning',
    scheduledDate: '2025-01-14',
    assignedTo: 'Clean Team A',
    status: 'scheduled'
  },
  {
    id: '2',
    propertyName: 'Mountain Cabin',
    title: 'HVAC Maintenance',
    type: 'maintenance',
    scheduledDate: '2025-01-16',
    assignedTo: 'Tech Services',
    status: 'scheduled'
  },
  {
    id: '3',
    propertyName: 'City Apartment',
    title: 'Window Cleaning',
    type: 'cleaning',
    scheduledDate: '2025-01-18',
    status: 'scheduled'
  }
]

const typeVariants = {
  cleaning: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-orange-100 text-orange-800'
}

const statusVariants = {
  scheduled: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800'
}

export function UpcomingMaintenanceList() {
  return (
    <div className="overflow-hidden">
      <div className="divide-y divide-gray-200">
        {mockMaintenance.map((item) => (
          <div key={item.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded ${item.type === 'cleaning' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                    {item.type === 'cleaning' ? (
                      <Home className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Wrench className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {item.propertyName}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(item.scheduledDate).toLocaleDateString()}
                  </div>
                  {item.assignedTo && (
                    <div className="text-gray-900">
                      Assigned to: {item.assignedTo}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeVariants[item.type]}`}>
                  {item.type}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusVariants[item.status]}`}>
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}