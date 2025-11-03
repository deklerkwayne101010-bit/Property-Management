# Holiday Rentals Management SaaS - Architecture Plan

## Project Overview
A comprehensive SaaS platform for managing holiday rentals with separate Admin and Client dashboards.

## Technology Stack

### Core Framework
- **Next.js 15.5.6** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS 4** - Utility-first CSS framework

### Database & ORM
- **Prisma** - Type-safe database ORM
- **SQLite** - For MVP (easily upgradable to PostgreSQL)

### Authentication & Authorization
- **NextAuth.js** - Authentication solution with role-based access
- **JWT tokens** - Session management

### UI Components
- **shadcn/ui** - High-quality React components
- **Chart.js/Recharts** - Data visualization
- **React Hook Form** - Form management
- **Date-fns** - Date manipulation

### Image & File Storage
- **Cloudinary** - Image upload and management (cloud-based)
- **Local storage fallback** - For development/MVP

## Database Schema

### Core Tables

#### Users Table
```sql
- id: String (Primary Key)
- email: String (Unique)
- password: String (Hashed)
- role: Enum ('admin', 'client')
- firstName: String
- lastName: String
- phone: String?
- avatar: String?
- createdAt: DateTime
- updatedAt: DateTime
- isActive: Boolean (default: true)
```

#### Properties Table
```sql
- id: String (Primary Key)
- name: String
- address: String
- city: String
- country: String
- description: Text?
- bedrooms: Int
- bathrooms: Int
- maxGuests: Int
- amenities: Json?
- photos: Json? (Array of image URLs)
- ownerId: String (Foreign Key -> Users.id)
- createdAt: DateTime
- updatedAt: DateTime
- isActive: Boolean (default: true)
```

#### Bookings Table
```sql
- id: String (Primary Key)
- propertyId: String (Foreign Key -> Properties.id)
- guestName: String
- guestEmail: String
- guestPhone: String?
- checkIn: DateTime
- checkOut: DateTime
- guests: Int
- totalAmount: Decimal
- status: Enum ('pending', 'confirmed', 'cancelled', 'completed')
- notes: Text?
- createdAt: DateTime
- updatedAt: DateTime
```

#### Maintenance/Cleaning Table
```sql
- id: String (Primary Key)
- propertyId: String (Foreign Key -> Properties.id)
- type: Enum ('cleaning', 'maintenance')
- title: String
- description: Text?
- scheduledDate: DateTime
- completedDate: DateTime?
- status: Enum ('scheduled', 'in_progress', 'completed', 'cancelled')
- assignedTo: String? (Staff member name)
- photos: Json? (Array of image URLs)
- notes: Text?
- createdAt: DateTime
- updatedAt: DateTime
```

#### Photo Galleries Table
```sql
- id: String (Primary Key)
- propertyId: String (Foreign Key -> Properties.id)
- title: String
- description: Text?
- photos: Json? (Array of image URLs)
- uploadedBy: String (Foreign Key -> Users.id)
- uploadType: Enum ('monthly_update', 'inspection', 'property_photos')
- month: Int? (For monthly updates)
- year: Int? (For monthly updates)
- createdAt: DateTime
```

#### Packages/Plans Table
```sql
- id: String (Primary Key)
- ownerId: String (Foreign Key -> Users.id)
- name: String
- type: Enum ('flat_fee', 'percentage_per_booking', 'check_in_only')
- flatFeeAmount: Decimal? (For flat_fee)
- percentageRate: Decimal? (For percentage_per_booking)
- checkInFee: Decimal? (For check_in_only)
- isActive: Boolean (default: true)
- createdAt: DateTime
- updatedAt: DateTime
```

#### Messages Table
```sql
- id: String (Primary Key)
- senderId: String (Foreign Key -> Users.id)
- recipientId: String (Foreign Key -> Users.id)
- subject: String
- content: Text
- isRead: Boolean (default: false)
- messageType: Enum ('general', 'maintenance_alert', 'booking_notification')
- relatedPropertyId: String? (Foreign Key -> Properties.id)
- createdAt: DateTime
```

#### Messages Table
```sql
- id: String (Primary Key)
- senderId: String (Foreign Key -> Users.id)
- recipientId: String (Foreign Key -> Users.id)
- subject: String
- content: Text
- isRead: Boolean (default: false)
- messageType: Enum ('general', 'maintenance_alert', 'booking_notification')
- relatedPropertyId: String? (Foreign Key -> Properties.id)
- createdAt: DateTime
```

## Application Structure

### Directory Structure
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── properties/
│   │   │   ├── bookings/
│   │   │   ├── maintenance/
│   │   │   ├── galleries/
│   │   │   ├── packages/
│   │   │   ├── reports/
│   │   │   ├── messages/
│   │   │   └── owners/
│   │   └── client/
│   │       ├── dashboard/
│   │       ├── properties/
│   │       ├── bookings/
│   │       ├── maintenance/
│   │       ├── galleries/
│   │       └── messages/
│   ├── api/
│   │   ├── auth/
│   │   ├── properties/
│   │   ├── bookings/
│   │   ├── maintenance/
│   │   ├── galleries/
│   │   ├── messages/
│   │   └── upload/
│   └── globals.css
├── components/
│   ├── ui/ (shadcn components)
│   ├── charts/
│   ├── forms/
│   ├── layout/
│   └── dashboard/
├── lib/
│   ├── db.ts (Prisma client)
│   ├── auth.ts (NextAuth config)
│   ├── utils.ts
│   └── validations.ts
├── types/
│   ├── index.ts
│   └── api.ts
└── hooks/
    ├── useAuth.ts
    ├── useProperties.ts
    ├── useBookings.ts
    └── useMaintenance.ts
```

### Key Features by Dashboard

#### Admin Dashboard
1. **Overview Dashboard**
   - Total properties count
   - Current occupancy percentage
   - Upcoming cleanings/maintenance
   - Pending reports
   - Monthly/year-to-date revenue

2. **Property Owners Management**
   - CRUD operations for property owners
   - Assign login credentials
   - View owner statistics

3. **Properties Management**
   - Add/edit property details
   - Photo upload and gallery management
   - Assign properties to owners
   - Property status management

4. **Bookings Management**
   - View all bookings with filters
   - Manual booking creation
   - Booking status updates
   - Calendar view

5. **Maintenance & Cleaning**
   - Schedule management
   - Photo upload for inspections
   - Status tracking
   - Notes and reporting

6. **Gallery Management**
   - Monthly photo updates
   - Upload inspection photos
   - Organize by property and date

7. **Packages/Plans**
   - Manage different pricing models
   - Assign plans to owners
   - Billing management

8. **Reports**
   - Occupancy rates
   - Revenue reports
   - Maintenance history
   - Export functionality

9. **Messaging System**
   - Send messages to property owners
   - Notification management

#### Client Dashboard
1. **Property Overview**
   - All properties with thumbnails
   - Basic statistics per property

2. **Booking Calendar**
   - Interactive calendar view
   - Booking status and details

3. **Performance Analytics**
   - Occupancy rates (daily/weekly/monthly)
   - Revenue tracking
   - Booking statistics

4. **Photo Galleries**
   - Monthly updates from admin
   - Inspection photos
   - Property photos

5. **Maintenance Updates**
   - Upcoming scheduled maintenance
   - Recent completed work
   - Inspection reports

6. **Service Requests**
   - Request additional services
   - Communication with admin

7. **Notifications**
   - Recent updates
   - Maintenance alerts
   - Booking confirmations

## Authentication & Authorization

### Role-Based Access Control
- **Admin Role**: Full access to all features
- **Client Role**: Access only to their properties and data

### Protected Routes
- API routes protected with middleware
- Dashboard routes protected with role-based navigation
- Session management with JWT tokens

## Security Considerations

1. **Data Protection**
   - Password hashing with bcrypt
   - JWT token expiration
   - Input validation and sanitization

2. **File Upload Security**
   - File type validation
   - Size limitations
   - Secure file storage

3. **API Security**
   - Rate limiting
   - CORS configuration
   - Input validation

## Performance Optimizations

1. **Database**
   - Proper indexing
   - Query optimization
   - Pagination for large datasets

2. **Frontend**
   - Image optimization
   - Code splitting
   - Lazy loading
   - Caching strategies

3. **File Storage**
   - Image compression
   - CDN usage (Cloudinary)
   - Efficient upload handling

## Deployment Strategy

1. **Development**
   - Local SQLite database
   - Local file storage

2. **Production**
   - Vercel deployment
   - PostgreSQL database (upgrade from SQLite)
   - Cloudinary for image storage
   - Environment variables for configuration

## MVP Implementation Priorities

### Phase 1: Core Infrastructure
1. Database schema and setup
2. Authentication system
3. Basic UI framework
4. Admin dashboard overview

### Phase 2: Property Management
1. Property CRUD operations
2. Owner management
3. Basic booking system

### Phase 3: Advanced Features
1. Maintenance scheduling
2. Photo galleries
3. Messaging system

### Phase 4: Analytics & Reports
1. Dashboard analytics
2. Report generation
3. Performance optimization

This architecture provides a solid foundation for building a comprehensive holiday rentals management SaaS platform with clear separation of concerns, scalable design, and modern development practices.