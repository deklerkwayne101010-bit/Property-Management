import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@propertybuddy.com' },
    update: {},
    create: {
      email: 'admin@propertybuddy.com',
      password: adminPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
    },
  })

  // Create client user
  const clientPassword = await bcrypt.hash('client123', 12)
  const client = await prisma.user.upsert({
    where: { email: 'client@propertybuddy.com' },
    update: {},
    create: {
      email: 'client@propertybuddy.com',
      password: clientPassword,
      role: 'client',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567891',
    },
  })

  // Create properties (using PostgreSQL array types)
  const properties = await Promise.all([
    prisma.property.upsert({
      where: { id: 'prop1' },
      update: {},
      create: {
        id: 'prop1',
        name: 'Beachfront Villa',
        address: '123 Ocean Drive',
        city: 'Cape Town',
        country: 'South Africa',
        description: 'Luxury beachfront villa with stunning ocean views',
        bedrooms: 4,
        bathrooms: 3,
        maxGuests: 8,
        amenities: ['WiFi', 'Pool', 'Beach Access', 'Parking', 'Air Conditioning'],
        photos: ['/placeholder-beachfront-1.jpg', '/placeholder-beachfront-2.jpg', '/placeholder-beachfront-3.jpg'],
        ownerId: client.id,
      },
    }),
    prisma.property.upsert({
      where: { id: 'prop2' },
      update: {},
      create: {
        id: 'prop2',
        name: 'Mountain Cabin',
        address: '456 Drakensberg Way',
        city: 'Drakensberg',
        country: 'South Africa',
        description: 'Cozy mountain retreat with fireplace and hot tub',
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        amenities: ['WiFi', 'Fireplace', 'Hot Tub', 'Mountain Views', 'Kitchen'],
        photos: ['/placeholder-cabin-1.jpg', '/placeholder-cabin-2.jpg'],
        ownerId: client.id,
      },
    }),
    prisma.property.upsert({
      where: { id: 'prop3' },
      update: {},
      create: {
        id: 'prop3',
        name: 'City Apartment',
        address: '789 Cape Town CBD',
        city: 'Cape Town',
        country: 'South Africa',
        description: 'Modern apartment in the heart of the city',
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        amenities: ['WiFi', 'Air Conditioning', 'Gym Access', 'Concierge', 'Balcony'],
        photos: ['/placeholder-city-1.jpg', '/placeholder-city-2.jpg'],
        ownerId: client.id,
      },
    }),
  ])

  // Create bookings (using proper decimal type)
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        propertyId: properties[0].id,
        guestName: 'John Smith',
        guestEmail: 'john@example.com',
        guestPhone: '+1234567892',
        checkIn: new Date('2025-01-15'),
        checkOut: new Date('2025-01-20'),
        guests: 4,
        totalAmount: 22000.00,  // ZAR amount
        status: 'confirmed',
        notes: 'Special requests for beach equipment',
      },
    }),
    prisma.booking.create({
      data: {
        propertyId: properties[1].id,
        guestName: 'Sarah Johnson',
        guestEmail: 'sarah@example.com',
        guestPhone: '+1234567893',
        checkIn: new Date('2025-01-18'),
        checkOut: new Date('2025-01-25'),
        guests: 2,
        totalAmount: 18000.00,  // ZAR amount
        status: 'pending',
        notes: 'First-time visitor to Drakensberg',
      },
    }),
    prisma.booking.create({
      data: {
        propertyId: properties[2].id,
        guestName: 'Mike Davis',
        guestEmail: 'mike@example.com',
        checkIn: new Date('2025-01-22'),
        checkOut: new Date('2025-01-24'),
        guests: 1,
        totalAmount: 5500.00,   // ZAR amount
        status: 'confirmed',
      },
    }),
  ])

  // Create maintenance records (using proper enum types)
  const maintenance = await Promise.all([
    prisma.maintenance.create({
      data: {
        propertyId: properties[0].id,
        type: 'cleaning',
        title: 'Deep Cleaning',
        description: 'Complete deep cleaning after guest checkout',
        scheduledDate: new Date('2025-01-14'),
        status: 'scheduled',
        assignedTo: 'Clean Team A',
        photos: ['/inspection-1.jpg', '/inspection-2.jpg'],
      },
    }),
    prisma.maintenance.create({
      data: {
        propertyId: properties[1].id,
        type: 'maintenance',
        title: 'HVAC Maintenance',
        description: 'Monthly HVAC system check and filter replacement',
        scheduledDate: new Date('2025-01-16'),
        status: 'scheduled',
        assignedTo: 'Tech Services',
        photos: ['/maintenance-1.jpg'],
      },
    }),
    prisma.maintenance.create({
      data: {
        propertyId: properties[2].id,
        type: 'cleaning',
        title: 'Window Cleaning',
        description: 'Professional window cleaning for all windows',
        scheduledDate: new Date('2025-01-18'),
        status: 'scheduled',
        photos: ['/cleaning-1.jpg', '/cleaning-2.jpg'],
      },
    }),
  ])

  // Create package (using proper enum)
  await prisma.package.create({
    data: {
      ownerId: client.id,
      name: 'Standard Management',
      type: 'percentage_per_booking',
      percentageRate: 15.0,  // Using Decimal type
      isActive: true,
    },
  })

  // Create messages (using proper enum)
  await Promise.all([
    prisma.message.create({
      data: {
        senderId: admin.id,
        recipientId: client.id,
        subject: 'Welcome to Property Buddy AI',
        content: 'Your account has been set up successfully. You can now manage your properties through our platform.',
        messageType: 'general',
      },
    }),
    prisma.message.create({
      data: {
        senderId: admin.id,
        recipientId: client.id,
        subject: 'New Booking Request',
        content: 'You have received a new booking request for Beachfront Villa. Please review and respond within 24 hours.',
        messageType: 'booking_notification',
        relatedPropertyId: properties[0].id,
      },
    }),
  ])

  console.log('Database seeded successfully!')
  console.log('Admin user: admin@propertybuddy.com / admin123')
  console.log('Client user: client@propertybuddy.com / client123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })