import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        bookings: {
          include: {
            property: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        maintenance: {
          orderBy: {
            scheduledDate: 'desc'
          },
          take: 10
        },
        photoGalleries: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        _count: {
          select: {
            bookings: true,
            maintenance: true,
            photoGalleries: true
          }
        }
      }
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Parse JSON strings back to arrays for frontend
    const parsedProperty = {
      ...property,
      amenities: property.amenities ? JSON.parse(property.amenities as string) : [],
      photos: property.photos ? JSON.parse(property.photos as string) : []
    }

    return NextResponse.json({ property: parsedProperty })
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Parse amenities if it's a string (from form)
    let amenities = body.amenities
    if (typeof amenities === 'string') {
      amenities = amenities.split(',').map((item: string) => item.trim()).filter(Boolean)
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        ...body,
        amenities: amenities ? JSON.stringify(amenities) : null,
        photos: body.photos ? JSON.stringify(body.photos) : null
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        _count: {
          select: {
            bookings: true,
            maintenance: true,
            photoGalleries: true
          }
        }
      }
    })

    return NextResponse.json({ property: updatedProperty })
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if property has bookings
    const bookingsCount = await prisma.booking.count({
      where: { propertyId: id }
    })

    if (bookingsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete property with existing bookings' },
        { status: 400 }
      )
    }

    await prisma.property.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}