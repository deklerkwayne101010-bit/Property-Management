
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // NOTE: Users are now handled by Supabase Auth, not Prisma
  // Create admin user in Supabase auth.users table using SQL files instead
  
  // For seeding, we'll use placeholder UUIDs for Supabase user IDs
  const adminUserId = '11111111-1111-1111-1111-111111111111' // Replace with actual Supabase user ID
  const clientUserId = '22222222-2222-2222-2222-222222222222' // Replace with actual Supabase user ID

  // Create properties
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
        amenities: JSON.stringify(['WiFi', 'Pool', 'Beach Access', 'Parking', 'Air Conditioning']),
        photos: JSON.stringify(['/placeholder-beachfront-1.jpg', '/placeholder-beachfront-2.jpg', '/placeholder-beachfront-3.jpg']),
        ownerId: clientUserId, // Supabase user ID
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
        amenities: JSON.stringify(['WiFi', 'Fireplace', 'Hot Tub', 'Mountain Views', 'Kitchen']),
        photos: JSON.stringify(['/placeholder-cabin-1.jpg', '/placeholder-cabin-2.jpg']),
        ownerId: clientUserId, // Supabase user ID
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
        amenities: JSON.stringify(['WiFi', 'Air Conditioning', 'Gym Access', 'Concierge', 'Balcony']),
        photos: JSON.stringify(['/placeholder-city-1.jpg', '/placeholder-city-2.jpg']),
        ownerId: clientUserId, // Supabase user ID
      },
    }),
  ])

  // Create bookings
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
        totalAmount: 2200.00,  // ZAR amount
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
        totalAmount: 1800.00,  // ZAR amount
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
        totalAmount: 550.00,   // ZAR amount
        status: 'confirmed',
      },
    }),
  ])

  // Create maintenance records
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
        photos: JSON.stringify(['/inspection-1.jpg', '/inspection-2.jpg']),
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
        photos: JSON.stringify(['/maintenance-1.jpg']),
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
        photos: JSON.stringify(['/cleaning-1.jpg', '/cleaning-2.jpg']),
      },
    }),
  ])

  // Create package
  await prisma.package.create({
    data: {
      ownerId: clientUserId, // Supabase user ID
      name: 'Standard Management',
      type: 'percentage_per_booking',
      percentageRate: 15.0,
      isActive: true,
    },
  })

  // Create messages (using placeholder user IDs)
  await Promise.all([
    prisma.message.create({
      data: {
        senderId: adminUserId, // Supabase user ID
        recipientId: clientUserId, // Supabase user ID
        subject: 'Welcome to Property Buddy AI',
        content: 'Your account has been set up successfully. You can now manage your properties through our platform.',
        messageType: 'general',
      },
    }),
    prisma.message.create({
      data: {
        senderId: adminUserId, // Supabase user ID
        recipientId: clientUserId, // Supabase user ID
        subject: 'New Booking Request',
        content: 'You have received a new booking request for Beachfront Villa. Please review and respond within 24 hours.',
        messageType: 'booking_notification',
        relatedPropertyId: properties[0].id,
      },
    }),
  ])

  console.log('Database seeded successfully!')
  console.log('Note: Users are now managed by Supabase Auth, not Prisma')
  console.log('Create admin user in Supabase auth.users table using SQL files')
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
