import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import { getCurrentUser } from '@/lib/firebase/server'
import { isAdminUser } from '@/lib/firebase/admin-routes'
import { mapEventRowToEvent, mapFirestoreDataToEventRow } from '@/lib/database/events-mappers'

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isAdminUser(user)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Fetch all events
    const snapshot = await adminDb.collection('events').orderBy('created_at', 'desc').get();

    const transformedEvents = snapshot.docs.map((doc) =>
      mapEventRowToEvent(mapFirestoreDataToEventRow(doc.id, doc.data() as Record<string, unknown>))
    );

    return NextResponse.json({ events: transformedEvents })
  } catch (error) {
    console.error('Error in GET /api/admin/events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

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

    const newEvent = {
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const docRef = await adminDb.collection('events').add(newEvent);

    // Transform database field names to frontend field names
    const transformedEvent = mapEventRowToEvent({ id: docRef.id, ...newEvent })

    return NextResponse.json({ event: transformedEvent }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
