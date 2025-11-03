import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/maintenance/[id] - Get single maintenance task
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
    const maintenance = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            city: true,
            address: true,
            ownerId: true
          }
        }
      }
    })

    if (!maintenance) {
      return NextResponse.json(
        { error: 'Maintenance task not found' },
        { status: 404 }
      )
    }

    // Check permissions for clients
    if (session.user.role === 'client') {
      const property = await prisma.property.findUnique({
        where: { id: maintenance.propertyId }
      })

      if (!property || property.ownerId !== session.user.id) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json({ maintenance })
  } catch (error) {
    console.error('Error fetching maintenance task:', error)
    return NextResponse.json(
      { error: 'Failed to fetch maintenance task' },
      { status: 500 }
    )
  }
}

// PATCH /api/maintenance/[id] - Update maintenance task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { 
      type, 
      title, 
      description, 
      scheduledDate, 
      assignedTo,
      status,
      notes 
    } = body

    // Check if maintenance task exists
    const existingMaintenance = await prisma.maintenance.findUnique({
      where: { id }
    })

    if (!existingMaintenance) {
      return NextResponse.json(
        { error: 'Maintenance task not found' },
        { status: 404 }
      )
    }

    // Validate status transitions
    if (status && existingMaintenance.status === 'completed' && status !== 'completed') {
      return NextResponse.json(
        { error: 'Cannot modify completed tasks' },
        { status: 400 }
      )
    }

    const updateData: any = {}

    if (type !== undefined) {
      if (!['cleaning', 'maintenance'].includes(type)) {
        return NextResponse.json(
          { error: 'Invalid task type' },
          { status: 400 }
        )
      }
      updateData.type = type
    }

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (scheduledDate !== undefined) updateData.scheduledDate = new Date(scheduledDate)
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo
    if (status !== undefined) {
      if (!['scheduled', 'in_progress', 'completed', 'cancelled'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        )
      }
      updateData.status = status
      
      // Set completed date if marking as completed
      if (status === 'completed' && existingMaintenance.status !== 'completed') {
        updateData.completedDate = new Date()
      }
    }
    if (notes !== undefined) updateData.notes = notes

    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ maintenance })
  } catch (error) {
    console.error('Error updating maintenance task:', error)
    return NextResponse.json(
      { error: 'Failed to update maintenance task' },
      { status: 500 }
    )
  }
}

// DELETE /api/maintenance/[id] - Delete maintenance task (admin only, or client can cancel their tasks)
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
    const body = await request.json()
    const { reason } = body

    // Check if maintenance task exists
    const existingMaintenance = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        property: true
      }
    })

    if (!existingMaintenance) {
      return NextResponse.json(
        { error: 'Maintenance task not found' },
        { status: 404 }
      )
    }

    if (session.user.role === 'admin') {
      // Admin can delete any task
      await prisma.maintenance.delete({ where: { id } })
      return NextResponse.json({ message: 'Maintenance task deleted successfully' })
    } else {
      // Clients can only cancel their own tasks
      if (existingMaintenance.property.ownerId !== session.user.id) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }

      // Mark as cancelled instead of deleting
      const updatedMaintenance = await prisma.maintenance.update({
        where: { id },
        data: {
          status: 'cancelled',
          notes: reason ? `${existingMaintenance.notes || ''}\n\nCancellation reason: ${reason}`.trim() : existingMaintenance.notes
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
      
      return NextResponse.json({ 
        message: 'Maintenance task cancelled successfully',
        maintenance: updatedMaintenance 
      })
    }
  } catch (error) {
    console.error('Error deleting/cancelling maintenance task:', error)
    return NextResponse.json(
      { error: 'Failed to delete maintenance task' },
      { status: 500 }
    )
  }
}