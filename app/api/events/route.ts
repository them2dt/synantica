import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import { getCurrentUser } from '@/lib/firebase/server'
import { mapEventRowToEvent } from '@/lib/database/events-mappers'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
    } = body

    // Field validation
    if (typeof name !== 'string' || name.length < 1 || name.length > 200) {
      return NextResponse.json({ error: 'Event name must be between 1 and 200 characters' }, { status: 400 })
    }
    if (typeof description !== 'string' || description.length < 1 || description.length > 5000) {
      return NextResponse.json({ error: 'Description must be between 1 and 5000 characters' }, { status: 400 })
    }
    if (typeof organizer !== 'string' || organizer.length < 1 || organizer.length > 200) {
      return NextResponse.json({ error: 'Organizer must be between 1 and 200 characters' }, { status: 400 })
    }
    if (typeof location !== 'string' || location.length < 1 || location.length > 200) {
      return NextResponse.json({ error: 'Location must be between 1 and 200 characters' }, { status: 400 })
    }
    if (typeof country !== 'string' || country.length < 1 || country.length > 100) {
      return NextResponse.json({ error: 'Country must be between 1 and 100 characters' }, { status: 400 })
    }
    if (!fromDate || isNaN(Date.parse(fromDate)) || !toDate || isNaN(Date.parse(toDate))) {
      return NextResponse.json({ error: 'Invalid date format for fromDate or toDate' }, { status: 400 })
    }
    if (new Date(fromDate) > new Date(toDate)) {
      return NextResponse.json({ error: 'fromDate must be on or before toDate' }, { status: 400 })
    }
    if (fromAge !== undefined && fromAge !== null) {
      const fa = parseInt(fromAge)
      if (!Number.isInteger(fa) || fa < 0 || fa > 100) {
        return NextResponse.json({ error: 'fromAge must be an integer between 0 and 100' }, { status: 400 })
      }
    }
    if (toAge !== undefined && toAge !== null) {
      const ta = parseInt(toAge)
      if (!Number.isInteger(ta) || ta < 0 || ta > 100) {
        return NextResponse.json({ error: 'toAge must be an integer between 0 and 100' }, { status: 400 })
      }
    }
    if (fromAge !== undefined && fromAge !== null && toAge !== undefined && toAge !== null) {
      if (parseInt(fromAge) > parseInt(toAge)) {
        return NextResponse.json({ error: 'fromAge must be less than or equal to toAge' }, { status: 400 })
      }
    }
    if (youtubeLink !== undefined && youtubeLink !== null && youtubeLink !== '') {
      if (typeof youtubeLink !== 'string' || youtubeLink.length > 500) {
        return NextResponse.json({ error: 'youtubeLink must be at most 500 characters' }, { status: 400 })
      }
    }
    if (links !== undefined && links !== null) {
      if (!Array.isArray(links) || links.length > 10 || links.some((l: unknown) => typeof l !== 'string' || l.length > 500)) {
        return NextResponse.json({ error: 'links must be an array of at most 10 strings, each at most 500 characters' }, { status: 400 })
      }
    }
    if (fields !== undefined && fields !== null) {
      if (!Array.isArray(fields) || fields.length > 20) {
        return NextResponse.json({ error: 'fields must be an array of at most 20 items' }, { status: 400 })
      }
    }
    if (!type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const now = new Date().toISOString()
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
      status: 'pending_review',
      submitted_by: user.uid,
      submitted_by_email: user.email || undefined,
      created_at: now,
      updated_at: now,
    }

    const docRef = await adminDb.collection('events').add(newEvent)
    const transformedEvent = mapEventRowToEvent({ id: docRef.id, ...newEvent })

    return NextResponse.json({ event: transformedEvent }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
