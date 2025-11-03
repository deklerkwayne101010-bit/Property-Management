'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { MessageSquare, Send, Plus, Mail, User } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'

interface Message {
  id: string
  subject: string
  content: string
  senderName: string
  senderRole: 'admin'
  messageType: 'general' | 'maintenance_alert' | 'booking_notification'
  isRead: boolean
  createdAt: string
  replyTo?: string
}

const mockMessages: Message[] = [
  {
    id: '1',
    subject: 'Welcome to Property Buddy AI',
    content: 'Your account has been set up successfully. You can now manage your properties through our platform.',
    senderName: 'Admin User',
    senderRole: 'admin',
    messageType: 'general',
    isRead: false,
    createdAt: '2025-01-10'
  },
  {
    id: '2',
    subject: 'New Booking Request',
    content: 'You have received a new booking request for Beachfront Villa. Please review and respond within 24 hours.',
    senderName: 'Admin User',
    senderRole: 'admin',
    messageType: 'booking_notification',
    isRead: true,
    createdAt: '2025-01-12'
  },
  {
    id: '3',
    subject: 'Maintenance Update',
    content: 'The HVAC maintenance for Mountain Cabin has been scheduled for January 16th. Our technician will arrive at 9 AM.',
    senderName: 'Admin User',
    senderRole: 'admin',
    messageType: 'maintenance_alert',
    isRead: true,
    createdAt: '2025-01-14'
  }
]

const typeVariants = {
  general: 'bg-blue-100 text-blue-800',
  maintenance_alert: 'bg-orange-100 text-orange-800',
  booking_notification: 'bg-green-100 text-green-800'
}

export default function ClientMessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [showCompose, setShowCompose] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'client') {
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

  const unreadCount = messages.filter(msg => !msg.isRead).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="mt-2 text-gray-600">
              Communicate with your property manager
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
          <button 
            onClick={() => setShowCompose(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Send Message
          </button>
        </div>

        {showCompose && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Send Message to Admin</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Message subject..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="general">General Inquiry</option>
                  <option value="maintenance_alert">Maintenance Request</option>
                  <option value="booking_notification">Booking Question</option>
                </select>
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

        {selectedMessage && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedMessage.subject}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <User className="h-4 w-4 mr-1" />
                  From: {selectedMessage.senderName}
                  <span className="ml-2">•</span>
                  <Mail className="h-4 w-4 mr-1 ml-2" />
                  {new Date(selectedMessage.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeVariants[selectedMessage.messageType]}`}>
                  {selectedMessage.messageType.replace('_', ' ')}
                </span>
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700">{selectedMessage.content}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Reply
              </button>
            </div>
          </div>
        )}

        {!selectedMessage && (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow ${!message.isRead ? 'border-l-4 border-blue-500' : ''}`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{message.subject}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        {message.senderName}
                        <span className="ml-2">•</span>
                        {new Date(message.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeVariants[message.messageType]}`}>
                      {message.messageType.replace('_', ' ')}
                    </span>
                    {!message.isRead && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        New
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 line-clamp-2">{message.content}</p>
                <div className="mt-3 text-right">
                  <span className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Read message →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {messages.length === 0 && !loading && (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 text-lg">No messages yet</div>
            <p className="text-gray-400 mt-2">Your property manager will contact you here when needed</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}