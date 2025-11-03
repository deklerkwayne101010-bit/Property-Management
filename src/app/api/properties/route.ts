import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/properties - List all properties
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    const where: any = {
      isActive: true
    }

    if (ownerId) {
      where.ownerId = ownerId
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          _count: {
            select: {
              bookings: true,
              maintenance: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.property.count({ where })
    ])

    // Parse JSON strings back to arrays for frontend
    const parsedProperties = properties.map((property: any) => ({
      ...property,
      amenities: property.amenities ? JSON.parse(property.amenities as string) : [],
      photos: property.photos ? JSON.parse(property.photos as string) : []
    }))

    return NextResponse.json({
      properties: parsedProperties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

// POST /api/properties - Create new property
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      address,
      city,
      country,
      description,
      bedrooms,
      bathrooms,
      maxGuests,
      ownerId,
      amenities = [],
      photos = []
    } = body

    // Validate required fields
    if (!name || !address || !city || !country || !bedrooms || !bathrooms || !maxGuests || !ownerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert arrays to JSON strings (database expects String | null, not arrays)
    const amenitiesJson = amenities.length > 0 ? JSON.stringify(amenities) : null
    const photosJson = photos.length > 0 ? JSON.stringify(photos) : null

    const property = await prisma.property.create({
      data: {
        name,
        address,
        city,
        country,
        description: description || null,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        maxGuests: parseInt(maxGuests),
        ownerId,
        amenities: amenitiesJson,
        photos: photosJson,
        isActive: true
      },
      include: {
        _count: {
          select: {
            bookings: true,
            maintenance: true
          }
        }
      }
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}