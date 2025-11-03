import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/bookings/[id] - Get single booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            city: true,
            owner: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this booking
    if (session.user.role === 'client') {
      const property = await prisma.property.findUnique({
        where: { id: booking.propertyId }
      })
      
      if (!property || property.ownerId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

// PATCH /api/bookings/[id] - Update booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    
    // Check if booking exists and user has access
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        property: true
      }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check access permissions
    if (session.user.role === 'client') {
      if (existingBooking.property.ownerId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // If updating dates or property, check for conflicts
    if (body.checkIn || body.checkOut || body.propertyId) {
      const checkIn = body.checkIn ? new Date(body.checkIn) : existingBooking.checkIn
      const checkOut = body.checkOut ? new Date(body.checkOut) : existingBooking.checkOut
      const propertyId = body.propertyId || existingBooking.propertyId

      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          id: { not: id },
          propertyId,
          status: { in: ['confirmed', 'completed'] },
          OR: [
            {
              AND: [
                { checkIn: { lte: checkIn } },
                { checkOut: { gt: checkIn } }
              ]
            },
            {
              AND: [
                { checkIn: { lt: checkOut } },
                { checkOut: { gte: checkOut } }
              ]
            }
          ]
        }
      })

      if (conflictingBooking) {
        return NextResponse.json(
          { error: 'Property is not available for these dates' },
          { status: 409 }
        )
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        ...body,
        checkIn: body.checkIn ? new Date(body.checkIn) : undefined,
        checkOut: body.checkOut ? new Date(body.checkOut) : undefined,
        guests: body.guests ? parseInt(body.guests) : undefined,
        totalAmount: body.totalAmount ? parseFloat(body.totalAmount) : undefined,
      },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            city: true,
            owner: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ booking: updatedBooking })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

// DELETE /api/bookings/[id] - Cancel/Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const { reason } = body

    // Check if booking exists and user has access
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        property: true
      }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check access permissions
    if (session.user.role === 'client') {
      if (existingBooking.property.ownerId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // For admin, we can actually delete the booking
    // For clients, we should mark it as cancelled instead
    if (session.user.role === 'admin') {
      await prisma.booking.delete({
        where: { id }
      })
      
      return NextResponse.json({ message: 'Booking deleted successfully' })
    } else {
      // Client - mark as cancelled
      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: {
          status: 'cancelled',
          notes: reason ? `${existingBooking.notes || ''}\n\nCancellation reason: ${reason}`.trim() : existingBooking.notes
        }
      })
      
      return NextResponse.json({ 
        message: 'Booking cancelled successfully',
        booking: updatedBooking 
      })
    }
  } catch (error) {
    console.error('Error cancelling/deleting booking:', error)
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}