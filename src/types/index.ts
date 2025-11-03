export type UserRole = 'admin' | 'client'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type MaintenanceType = 'cleaning' | 'maintenance'
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type PackageType = 'flat_fee' | 'percentage_per_booking' | 'check_in_only'
export type MessageType = 'general' | 'maintenance_alert' | 'booking_notification'
export type UploadType = 'monthly_update' | 'inspection' | 'property_photos'

export interface UserWithRelations {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  properties: PropertyWithRelations[]
  sentMessages: MessageWithRelations[]
  receivedMessages: MessageWithRelations[]
  packages: PackageWithRelations[]
}

export interface PropertyWithRelations {
  id: string
  name: string
  address: string
  city: string
  country: string
  description?: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  amenities: string[] // JSON parsed array
  photos: string[] // JSON parsed array
  ownerId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  owner: UserWithRelations
  bookings: BookingWithRelations[]
  maintenance: MaintenanceWithRelations[]
  photoGalleries: PhotoGalleryWithRelations[]
  _count?: {
    bookings: number
    maintenance: number
    photoGalleries: number
  }
}

export interface BookingWithRelations {
  id: string
  propertyId: string
  guestName: string
  guestEmail: string
  guestPhone?: string
  checkIn: string
  checkOut: string
  guests: number
  totalAmount: number
  status: BookingStatus
  notes?: string
  createdAt: string
  updatedAt: string
  property: PropertyWithRelations
}

export interface MaintenanceWithRelations {
  id: string
  propertyId: string
  type: MaintenanceType
  title: string
  description?: string
  scheduledDate: string
  completedDate?: string
  status: MaintenanceStatus
  assignedTo?: string
  photos: string[] // JSON parsed array
  notes?: string
  createdAt: string
  updatedAt: string
  property: PropertyWithRelations
}

export interface PhotoGalleryWithRelations {
  id: string
  propertyId: string
  title: string
  description?: string
  photos: string[] // JSON parsed array
  uploadedBy: string
  uploadType: UploadType
  month?: number
  year?: number
  createdAt: string
  property: PropertyWithRelations
  uploadedByUser: UserWithRelations
}

export interface PackageWithRelations {
  id: string
  ownerId: string
  name: string
  type: PackageType
  flatFeeAmount?: number
  percentageRate?: number
  checkInFee?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  owner: UserWithRelations
}

export interface MessageWithRelations {
  id: string
  senderId: string
  recipientId: string
  subject: string
  content: string
  isRead: boolean
  messageType: MessageType
  relatedPropertyId?: string
  createdAt: string
  sender: UserWithRelations
  recipient: UserWithRelations
  relatedProperty?: PropertyWithRelations
}

export interface DashboardStats {
  totalProperties: number
  currentOccupancy: number
  upcomingCleanings: number
  pendingReports: number
  monthlyRevenue: number
  yearlyRevenue: number
}

export interface PropertyStats {
  occupancyRate: number
  totalBookings: number
  totalRevenue: number
  averageRating: number
  lastBooking?: BookingWithRelations
  nextBooking?: BookingWithRelations
}

export interface ChartData {
  name: string
  value: number
  date?: string
}

export interface FilterOptions {
  dateFrom?: Date
  dateTo?: Date
  propertyId?: string
  ownerId?: string
  status?: BookingStatus | MaintenanceStatus
}

export interface SearchParams {
  q?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface FormErrors {
  [key: string]: string | undefined
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
}