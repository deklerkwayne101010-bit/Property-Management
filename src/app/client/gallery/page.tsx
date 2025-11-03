'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Camera, Plus } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'

const photoGalleries = [
  {
    id: '1',
    title: 'January 2025 Update',
    propertyName: 'Beachfront Villa',
    uploadType: 'monthly_update',
    photos: 5,
    uploadDate: '2025-01-10'
  },
  {
    id: '2',
    title: 'Inspection Report',
    propertyName: 'Mountain Cabin',
    uploadType: 'inspection',
    photos: 8,
    uploadDate: '2025-01-08'
  }
]

export default function ClientGalleryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Photo Gallery</h1>
            <p className="mt-2 text-gray-600">Browse monthly updates and inspection photos</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Request Photos
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photoGalleries.map((gallery) => (
            <div key={gallery.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Camera className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{gallery.title}</h3>
                      <p className="text-sm text-gray-600">{gallery.propertyName}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {gallery.photos} photos
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">
                    Type: {gallery.uploadType.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-gray-500">
                    Uploaded: {new Date(gallery.uploadDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-md text-sm font-medium">
                    View Gallery
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}