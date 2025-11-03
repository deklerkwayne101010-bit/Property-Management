'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { 
  Home, 
  Building2, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu,
  X,
  MessageSquare,
  Wrench,
  BarChart3,
  Bell
} from 'lucide-react'
import { useState } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/login')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const navigation = session.user.role === 'admin' ? [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home, current: pathname === '/admin/dashboard' },
    { name: 'Properties', href: '/admin/properties', icon: Building2, current: pathname.startsWith('/admin/properties') },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar, current: pathname.startsWith('/admin/bookings') },
    { name: 'Maintenance', href: '/admin/maintenance', icon: Wrench, current: pathname.startsWith('/admin/maintenance') },
    { name: 'Property Owners', href: '/admin/owners', icon: Users, current: pathname.startsWith('/admin/owners') },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare, current: pathname.startsWith('/admin/messages') },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3, current: pathname.startsWith('/admin/reports') },
  ] : [
    { name: 'Dashboard', href: '/client/dashboard', icon: Home, current: pathname === '/client/dashboard' },
    { name: 'Properties', href: '/client/properties', icon: Building2, current: pathname.startsWith('/client/properties') },
    { name: 'Bookings', href: '/client/bookings', icon: Calendar, current: pathname.startsWith('/client/bookings') },
    { name: 'Maintenance', href: '/client/maintenance', icon: Wrench, current: pathname.startsWith('/client/maintenance') },
    { name: 'Gallery', href: '/client/gallery', icon: BarChart3, current: pathname.startsWith('/client/gallery') },
    { name: 'Messages', href: '/client/messages', icon: MessageSquare, current: pathname.startsWith('/client/messages') },
  ]

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <Sidebar navigation={navigation} user={session.user} />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar navigation={navigation} user={session.user} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-900">
              {session.user.role === 'admin' ? 'Admin Dashboard' : 'Client Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <button type="button" className="text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{session.user.firstName} {session.user.lastName}</div>
                  <div className="text-gray-500 capitalize">{session.user.role}</div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function Sidebar({ navigation, user }: { navigation: any[], user: any }) {
  return (
    <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <Building2 className="h-8 w-8 text-blue-600" />
          <h1 className="ml-2 text-xl font-bold text-gray-900">Property Buddy AI</h1>
        </div>
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  item.current
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <Icon className={`${
                  item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 flex-shrink-0 h-6 w-6`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}