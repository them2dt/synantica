import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import { getCurrentUser } from '@/lib/firebase/server'
import { isAdminUser } from '@/lib/firebase/admin-routes'

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

    const transformedEvent = {
      id: docSnap.id,
      name: event.name || '',
      description: event.description || '',
      fromDate: event.from_date || '',
      toDate: event.to_date || '',
      location: event.location || '',
      country: event.country || '',
      organizer: event.organizer || '',
      fromAge: event.from_age,
      toAge: event.to_age,
      youtubeLink: event.youtube_link,
      links: event.links || [],
      type: event.type || '',
      fields: event.fields || [],
      status: event.status || 'draft',
      createdAt: event.created_at || new Date().toISOString(),
      updatedAt: event.updated_at || new Date().toISOString()
    }

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

    const transformedEvent = {
      id,
      name: updateData.name,
      description: updateData.description,
      fromDate: updateData.from_date,
      toDate: updateData.to_date,
      location: updateData.location,
      country: updateData.country,
      organizer: updateData.organizer,
      fromAge: updateData.from_age,
      toAge: updateData.to_age,
      youtubeLink: updateData.youtube_link,
      links: updateData.links,
      type: updateData.type,
      fields: updateData.fields,
      status: updateData.status,
      createdAt: new Date().toISOString(), // we don't have this, but close enough for return
      updatedAt: updateData.updated_at
    }

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
