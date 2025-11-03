'use client'

import { MapPin, TrendingUp, DollarSign, Camera, Calendar, CheckCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ClientPropertyCardProps {
  name: string
  location: string
  occupancy: number
  monthlyRevenue: number
  lastInspection: string
  nextMaintenance: string
  photos: number
}

export function ClientPropertyCard({ 
  name, 
  location, 
  occupancy, 
  monthlyRevenue, 
  lastInspection, 
  nextMaintenance, 
  photos 
}: ClientPropertyCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {location}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {occupancy}%
          </div>
          <div className="text-xs text-gray-500">Occupancy</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            Monthly Revenue
          </div>
          <div className="text-sm font-medium text-gray-900">
            {formatCurrency(monthlyRevenue)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Camera className="h-4 w-4 mr-2" />
            Photos
          </div>
          <div className="text-sm font-medium text-gray-900">
            {photos} photos
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-2" />
            Last Inspection
          </div>
          <div className="text-sm font-medium text-gray-900">
            {new Date(lastInspection).toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Next Maintenance
          </div>
          <div className="text-sm font-medium text-gray-900">
            {new Date(nextMaintenance).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            occupancy >= 80 ? 'bg-green-100 text-green-800' :
            occupancy >= 60 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {occupancy >= 80 ? 'Excellent' : occupancy >= 60 ? 'Good' : 'Needs Attention'}
          </span>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}