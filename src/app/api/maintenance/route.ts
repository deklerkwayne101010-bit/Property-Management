import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/maintenance - List all maintenance tasks
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')

    const where: any = {}

    if (propertyId) {
      where.propertyId = propertyId
    }

    if (type) {
      where.type = type
    }

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { assignedTo: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Filter by user role
    if (session.user.role === 'client') {
      const userProperties = await prisma.property.findMany({
        where: { ownerId: session.user.id },
        select: { id: true }
      })
      const propertyIds = userProperties.map((p: any) => p.id)
      
      if (propertyIds.length === 0) {
        return NextResponse.json({
          maintenance: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            pages: 0
          }
        })
      }
      
      where.propertyId = { in: propertyIds }
    }

    // Calculate pagination
    const skip = (page - 1) * limit
    const [total, maintenance] = await Promise.all([
      prisma.maintenance.count({ where }),
      prisma.maintenance.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              name: true,
              city: true,
              ownerId: true
            }
          }
        },
        orderBy: [
          { scheduledDate: 'asc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      })
    ])

    const pages = Math.ceil(total / limit)

    return NextResponse.json({
      maintenance,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    })
  } catch (error) {
    console.error('Error fetching maintenance tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch maintenance tasks' },
      { status: 500 }
    )
  }
}

// POST /api/maintenance - Create new maintenance task
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      propertyId, 
      type, 
      title, 
      description, 
      scheduledDate, 
      assignedTo,
      notes 
    } = body

    // Validation
    if (!propertyId || !type || !title || !scheduledDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['cleaning', 'maintenance'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid task type' },
        { status: 400 }
      )
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    const maintenance = await prisma.maintenance.create({
      data: {
        propertyId,
        type,
        title,
        description: description || '',
        scheduledDate: new Date(scheduledDate),
        assignedTo: assignedTo || '',
        notes: notes || '',
        status: 'scheduled'
      },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            city: true,
            ownerId: true
          }
        }
      }
    })

    return NextResponse.json({ maintenance }, { status: 201 })
  } catch (error) {
    console.error('Error creating maintenance task:', error)
    return NextResponse.json(
      { error: 'Failed to create maintenance task' },
      { status: 500 }
    )
  }
}