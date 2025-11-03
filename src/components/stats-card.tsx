'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  change?: string
  className?: string
}

const colorVariants = {
  blue: 'bg-blue-500',
  green: 'bg-green-500', 
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500'
}

export function StatsCard({ title, value, icon: Icon, color, change, className }: StatsCardProps) {
  return (
    <div className={cn('bg-white overflow-hidden shadow rounded-lg', className)}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={cn('p-3 rounded-md', colorVariants[color])}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
      {change && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="text-green-600 font-medium">{change}</span>
          </div>
        </div>
      )}
    </div>
  )
}