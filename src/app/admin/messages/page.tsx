'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Plus, Search, Mail, Send, User } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'

interface Message {
  id: string
  recipientName: string
  subject: string
  content: string
  type: 'general' | 'maintenance_alert' | 'booking_notification'
  isRead: boolean
  createdAt: string
}

const mockMessages: Message[] = [
  {
    id: '1',
    recipientName: 'John Doe',
    subject: 'Welcome to Property Buddy AI',
    content: 'Your account has been set up successfully. You can now manage your properties through our platform.',
    type: 'general',
    isRead: false,
    createdAt: '2025-01-10'
  },
  {
    id: '2',
    recipientName: 'John Doe',
    subject: 'New Booking Request',
    content: 'You have received a new booking request for Beachfront Villa. Please review and respond within 24 hours.',
    type: 'booking_notification',
    isRead: true,
    createdAt: '2025-01-12'
  }
]

const typeVariants = {
  general: 'bg-blue-100 text-blue-800',
  maintenance_alert: 'bg-orange-100 text-orange-800',
  booking_notification: 'bg-green-100 text-green-800'
}

export default function AdminMessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [showCompose, setShowCompose] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'admin') {
      router.push('/login')
      return
    }

    setTimeout(() => {
      setMessages(mockMessages)
      setLoading(false)
    }, 1000)
  }, [session, status, router])

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="mt-2 text-gray-600">Send messages and notifications to property owners</p>
          </div>
          <button 
            onClick={() => setShowCompose(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Compose Message
          </button>
        </div>

        {showCompose && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Compose New Message</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>All Property Owners</option>
                  <option>John Doe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Message subject..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your message..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`bg-white rounded-lg shadow p-6 ${!message.isRead ? 'border-l-4 border-blue-500' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{message.subject}</h3>
                    <p className="text-sm text-gray-600">To: {message.recipientName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeVariants[message.type]}`}>
                    {message.type.replace('_', ' ')}
                  </span>
                  {!message.isRead && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      New
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-700 mb-3">{message.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                <div className="space-x-2">
                  <button className="text-blue-600 hover:text-blue-700">Reply</button>
                  <button className="text-red-600 hover:text-red-700">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}