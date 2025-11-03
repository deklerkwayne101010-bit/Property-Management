# Property Buddy AI - Holiday Rentals Management SaaS

A comprehensive SaaS platform for managing holiday rentals with separate Admin and Client dashboards.

## 🚀 Features

### Admin Dashboard
- **Property Management**: Add, edit, and manage properties with photo uploads
- **Property Owner Management**: Create and manage property owner accounts
- **Booking System**: View, filter, and manage all bookings across properties
- **Maintenance & Cleaning**: Schedule and track maintenance and cleaning activities
- **Photo Gallery Management**: Upload and organize property photos and inspection reports
- **Messaging System**: Communicate directly with property owners
- **Analytics & Reports**: Generate occupancy rates, revenue reports, and maintenance history
- **Package Management**: Configure different pricing models for property owners

### Client Dashboard
- **Property Overview**: View all properties with performance statistics
- **Booking Calendar**: Interactive calendar showing all bookings
- **Performance Analytics**: Occupancy rates, revenue tracking, and booking statistics
- **Photo Galleries**: Access monthly updates and inspection photos
- **Maintenance Tracking**: View upcoming and completed maintenance activities
- **Service Requests**: Request additional services from admin
- **Notifications**: Real-time updates and alerts

## 🛠 Technology Stack

- **Framework**: Next.js 15.5.6 with App Router
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with JWT tokens
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React
- **Development**: TypeScript, ESLint, Turbopack

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Clone and Install Dependencies
```bash
cd property-buddy-ai-2025
npm install
```

### 2. Environment Setup
Copy `.env.local` and update the variables:
```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed with sample data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔐 Demo Credentials

### Admin Account
- **Email**: `admin@propertybuddy.com`
- **Password**: `admin123`

### Client Account
- **Email**: `client@propertybuddy.com` 
- **Password**: `client123`

## 📱 Project Structure

```
property-buddy-ai-2025/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   ├── (dashboard)/
│   │   │   ├── admin/
│   │   │   │   └── dashboard/
│   │   │   └── client/
│   │   │       └── dashboard/
│   │   ├── api/
│   │   │   └── auth/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── dashboard-layout.tsx
│   │   ├── stats-card.tsx
│   │   ├── recent-bookings-table.tsx
│   │   ├── upcoming-maintenance-list.tsx
│   │   ├── client-property-card.tsx
│   │   └── providers.tsx
│   ├── lib/
│   │   ├── db.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── types/
│       ├── index.ts
│       └── next-auth.d.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── dev.db
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

## 🗄 Database Schema

### Core Tables
- **Users**: Admin and client user accounts
- **Properties**: Property listings with details and photos
- **Bookings**: Guest booking records and status
- **Maintenance**: Cleaning and maintenance schedules
- **PhotoGalleries**: Photo collections for properties
- **Packages**: Management fee structures for owners
- **Messages**: Internal communication system

## 🎨 Design System

- **Colors**: Professional blue/gray/white theme
- **Typography**: Inter font family
- **Components**: Custom reusable components
- **Icons**: Lucide React icon library
- **Layout**: Responsive grid system with Tailwind CSS

## 🔒 Security Features

- **Authentication**: JWT-based with secure session management
- **Authorization**: Role-based access control (Admin/Client)
- **Password Security**: bcrypt hashing
- **Data Protection**: Input validation and sanitization

## 📊 Features Implemented

### ✅ Completed Features
- [x] User authentication and role-based access
- [x] Admin dashboard with overview statistics
- [x] Client dashboard with property management
- [x] Responsive design for mobile and desktop
- [x] Database schema with relationships
- [x] Seed data for testing
- [x] Modern UI with Tailwind CSS
- [x] Navigation and routing system
- [x] Session management

### 🚧 Ready for Extension
- [ ] API endpoints for CRUD operations
- [ ] Image upload and storage system
- [ ] Advanced reporting and analytics
- [ ] Real-time notifications
- [ ] Email integration
- [ ] Calendar integrations
- [ ] Payment processing
- [ ] Advanced filtering and search

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with zero configuration

### Manual Deployment
```bash
npm run build
npm start
```

## 🧪 Testing

The application includes seed data for testing all features:
- Admin account with full system access
- Client account with property management access
- Sample properties, bookings, and maintenance records
- Mock data for dashboard statistics

## 📈 Performance Optimizations

- **Next.js App Router**: Latest routing and rendering optimizations
- **Turbopack**: Fast development builds
- **Code Splitting**: Automatic code splitting for better performance
- **SQLite**: Lightweight database for development (easily upgradeable to PostgreSQL)

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions about this project, please refer to the documentation or create an issue in the repository.

---

**Property Buddy AI** - Making holiday rental management simple and efficient.
