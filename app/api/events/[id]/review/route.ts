import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import { getCurrentUser } from '@/lib/firebase/server'
import { isAdminUser } from '@/lib/firebase/admin-routes'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isAdminUser(user)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { action } = body

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "approve" or "reject".' }, { status: 400 })
    }

    const docRef = adminDb.collection('events').doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const newStatus = action === 'approve' ? 'published' : 'rejected'
    await docRef.update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })

    return NextResponse.json({ id, status: newStatus })
  } catch (error) {
    console.error('Error in PATCH /api/events/[id]/review:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
