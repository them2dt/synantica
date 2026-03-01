import 'server-only'

import { adminDb } from '@/lib/server/firebase/app'
import { mapEventRowToEvent, mapEventRowToEventWithDetails, mapFirestoreDataToEventRow } from '@/lib/database/events-mappers'
import { CreateEventInput } from '@/lib/server/validators/events'

interface AuthUser {
  uid: string
  email?: string | null
}

export async function createEvent(user: AuthUser, input: CreateEventInput) {
  const now = new Date().toISOString()
  const newEvent = {
    name: input.name,
    description: input.description,
    from_date: input.fromDate,
    to_date: input.toDate,
    location: input.location,
    country: input.country,
    organizer: input.organizer,
    from_age: input.fromAge,
    to_age: input.toAge,
    youtube_link: input.youtubeLink,
    links: input.links,
    type: input.type,
    fields: input.fields,
    status: 'pending_review',
    submitted_by: user.uid,
    submitted_by_email: user.email || undefined,
    created_at: now,
    updated_at: now,
  }

  const docRef = await adminDb.collection('events').add(newEvent)
  return mapEventRowToEvent({ id: docRef.id, ...newEvent })
}

export async function listUserEvents(userId: string) {
  const snapshot = await adminDb
    .collection('events')
    .where('submitted_by', '==', userId)
    .orderBy('created_at', 'desc')
    .get()

  return snapshot.docs.map((doc) => {
    const row = mapFirestoreDataToEventRow(doc.id, doc.data() as Record<string, unknown>)
    return mapEventRowToEventWithDetails(row)
  })
}
