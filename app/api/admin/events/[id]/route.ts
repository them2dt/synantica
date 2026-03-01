import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import { getCurrentUser } from '@/lib/firebase/server'
import { isAdminUser } from '@/lib/firebase/admin-routes'
import { mapEventRowToEvent, mapFirestoreDataToEventRow } from '@/lib/database/events-mappers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isAdminUser(user)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const docSnap = await adminDb.collection('events').doc(id).get()

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const event = docSnap.data() as Record<string, unknown>
    const transformedEvent = mapEventRowToEvent(mapFirestoreDataToEventRow(docSnap.id, event))

    return NextResponse.json({ event: transformedEvent })
  } catch (error) {
    console.error('Error in GET /api/admin/events/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isAdminUser(user)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      description,
      fromDate,
      toDate,
      location,
      country,
      organizer,
      fromAge,
      toAge,
      youtubeLink,
      links,
      type,
      fields,
      status
    } = body

    if (!name || !description || !fromDate || !toDate || !location || !country || !organizer || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const updateData = {
      name,
      description,
      from_date: fromDate,
      to_date: toDate,
      location,
      country,
      organizer,
      from_age: fromAge ? parseInt(fromAge) : null,
      to_age: toAge ? parseInt(toAge) : null,
      youtube_link: youtubeLink || null,
      links: links || [],
      type,
      fields: fields || [],
      status: status || 'draft',
      updated_at: new Date().toISOString()
    };

    await adminDb.collection('events').doc(id).update(updateData);

    const transformedEvent = mapEventRowToEvent({
      id,
      ...updateData,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({ event: transformedEvent })
  } catch (error) {
    console.error('Error in PUT /api/admin/events/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isAdminUser(user)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    await adminDb.collection('events').doc(id).delete();

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/admin/events/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
