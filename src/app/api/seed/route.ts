import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    // Check if data already exists
    const existingUsers = await prisma.user.count()
    if (existingUsers > 0) {
      return NextResponse.json({ 
        message: 'Database already seeded',
        users: existingUsers 
      })
    }

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = await prisma.user.create({
      data: {
        id: 'admin_user_123',
        email: 'admin@propertybuddy.com',
        password: adminPassword,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+27123456789',
        isActive: true
      }
    })

    // Create client user
    const clientPassword = await bcrypt.hash('client123', 12)
    const client = await prisma.user.create({
      data: {
        id: 'client_user_123',
        email: 'client@propertybuddy.com',
        password: clientPassword,
        role: 'client',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+27123456790',
        isActive: true
      }
    })

    // Create properties
    const property1 = await prisma.property.create({
      data: {
        id: 'prop1',
        name: 'Beachfront Villa',
        address: '123 Ocean Drive',
        city: 'Cape Town',
        country: 'South Africa',
        description: 'Luxurious beachfront villa with stunning ocean views and private beach access.',
        bedrooms: 4,
        bathrooms: 3,
        maxGuests: 8,
        amenities: '["WiFi", "Pool", "Beach Access", "Parking", "Air Conditioning", "Kitchen"]',
        photos: '["/villa-exterior.jpg", "/villa-pool.jpg", "/villa-bedroom.jpg"]',
        ownerId: client.id,
        isActive: true
      }
    })

    const property2 = await prisma.property.create({
      data: {
        id: 'prop2',
        name: 'Mountain Cabin Retreat',
        address: '456 Mountain View Road',
        city: 'Drakensberg',
        country: 'South Africa',
        description: 'Cozy mountain cabin perfect for hiking enthusiasts and nature lovers.',
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        amenities: '["WiFi", "Fireplace", "Mountain Views", "Hiking Trails", "Parking"]',
        photos: '["cabin-exterior.jpg", "/cabin-interior.jpg", "/mountain-view.jpg"]',
        ownerId: client.id,
        isActive: true
      }
    })

    const property3 = await prisma.property.create({
      data: {
        id: 'prop3',
        name: 'City Apartment',
        address: '789 City Center Avenue',
        city: 'Cape Town',
        country: 'South Africa',
        description: 'Modern city apartment in the heart of Cape Town with easy access to attractions.',
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        amenities: '["WiFi", "Kitchen", "City Views", "Public Transport", "Security"]',
        photos: '["apartment-exterior.jpg", "/apartment-living.jpg", "/apartment-bedroom.jpg"]',
        ownerId: client.id,
        isActive: true
      }
    })

    // Create bookings
    const booking1 = await prisma.booking.create({
      data: {
        id: 'booking1',
        propertyId: property1.id,
        guestName: 'Sarah Johnson',
        guestEmail: 'sarah@example.com',
        guestPhone: '+27123456791',
        checkIn: new Date('2025-01-15'),
        checkOut: new Date('2025-01-22'),
        guests: 4,
        totalAmount: 22000.00,
        status: 'confirmed',
        notes: 'Celebrating anniversary, special arrangements needed'
      }
    })

    const booking2 = await prisma.booking.create({
      data: {
        id: 'booking2',
        propertyId: property2.id,
        guestName: 'Michael Brown',
        guestEmail: 'michael@example.com',
        guestPhone: '+27123456792',
        checkIn: new Date('2025-01-25'),
        checkOut: new Date('2025-01-28'),
        guests: 2,
        totalAmount: 18000.00,
        status: 'pending',
        notes: 'Hiking group, needs trail recommendations'
      }
    })

    const booking3 = await prisma.booking.create({
      data: {
        id: 'booking3',
        propertyId: property3.id,
        guestName: 'Emma Davis',
        guestEmail: 'emma@example.com',
        guestPhone: '+27123456793',
        checkIn: new Date('2025-01-30'),
        checkOut: new Date('2025-02-02'),
        guests: 1,
        totalAmount: 5500.00,
        status: 'confirmed',
        notes: 'Business trip, late check-in'
      }
    })

    // Create maintenance records
    await prisma.maintenance.create({
      data: {
        id: 'maintenance1',
        propertyId: property1.id,
        type: 'cleaning',
        title: 'Deep Cleaning',
        description: 'Complete deep cleaning after guest checkout',
        scheduledDate: new Date('2025-01-14'),
        status: 'scheduled',
        assignedTo: 'Clean Team A',
        photos: '["/inspection-1.jpg", "/inspection-2.jpg"]',
        notes: 'Pay special attention to pool area'
      }
    })

    await prisma.maintenance.create({
      data: {
        id: 'maintenance2',
        propertyId: property2.id,
        type: 'maintenance',
        title: 'HVAC Maintenance',
        description: 'Monthly HVAC system check and filter replacement',
        scheduledDate: new Date('2025-01-16'),
        status: 'scheduled',
        assignedTo: 'Tech Services',
        photos: '["/maintenance-1.jpg"]',
        notes: 'Check all filters and service air conditioning'
      }
    })

    // Create package
    await prisma.package.create({
      data: {
        id: 'package1',
        ownerId: client.id,
        name: 'Standard Management',
        type: 'percentage_per_booking',
        percentageRate: 15.0,
        isActive: true
      }
    })

    // Create messages
    await prisma.message.create({
      data: {
        id: 'message1',
        senderId: admin.id,
        recipientId: client.id,
        subject: 'Welcome to Property Buddy AI',
        content: 'Your account has been set up successfully. You can now manage your properties through our platform.',
        messageType: 'general'
      }
    })

    await prisma.message.create({
      data: {
        id: 'message2',
        senderId: admin.id,
        recipientId: client.id,
        subject: 'New Booking Request',
        content: 'You have received a new booking request for Beachfront Villa. Please review and respond within 24 hours.',
        messageType: 'booking_notification',
        relatedPropertyId: property1.id
      }
    })

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      data: {
        admin: { email: admin.email, password: 'admin123' },
        client: { email: client.email, password: 'client123' },
        properties: 3,
        bookings: 3,
        maintenance: 2,
        messages: 2
      }
    })

  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}