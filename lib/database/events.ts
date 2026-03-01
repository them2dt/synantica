import { adminDb } from '@/lib/firebase/admin'
import { Event, EventStatus, EventFilters } from '@/types/event'
import { createDatabaseError } from '@/lib/utils/error-handling'

/**
 * Database service for events
 * Handles all CRUD operations and complex queries
 */


export interface EventWithDetails extends Event {
  category_name: string
  average_rating: number
  tags: string[]
  // Database-specific fields
  support_pdfs?: Array<{ name: string; url: string }>
  organization_homepage?: string
  youtube_videos?: string[]
  alumni_contact_email?: string
}

export interface EventRow {
  id: string;
  name?: string;
  description?: string;
  from_date?: string;
  to_date?: string;
  location?: string;
  country?: string;
  organizer?: string;
  from_age?: number;
  to_age?: number;
  youtube_link?: string;
  links?: string[];
  type?: string;
  fields?: string[];
  status?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all events with optional filters
 */
export async function getEvents(filters: EventFilters = {}): Promise<EventWithDetails[]> {
  try {
    let eventsQuery: FirebaseFirestore.Query = adminDb.collection('events');

    eventsQuery = eventsQuery.where('status', '==', 'published');

    if (filters.type) {
      eventsQuery = eventsQuery.where('type', '==', filters.type);
    }

    if (filters.country) {
      eventsQuery = eventsQuery.where('country', '==', filters.country);
    }

    eventsQuery = eventsQuery.orderBy('created_at', 'desc');

    if (filters.limit) {
      eventsQuery = eventsQuery.limit(filters.limit);
    }

    const querySnapshot = await eventsQuery.get();

    let eventsRows: EventRow[] = [];
    querySnapshot.forEach((doc) => {
      eventsRows.push({ id: doc.id, ...(doc.data() as Omit<EventRow, 'id'>) });
    });

    // In-memory advanced filtering
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      eventsRows = eventsRows.filter(ev =>
        (ev.name && ev.name.toLowerCase().includes(searchLower)) ||
        (ev.description && ev.description.toLowerCase().includes(searchLower)) ||
        (ev.organizer && ev.organizer.toLowerCase().includes(searchLower))
      );
    }

    if (filters.fields && filters.fields.length > 0) {
      eventsRows = eventsRows.filter(ev =>
        ev.fields && filters.fields!.some((f: string) => ev.fields!.includes(f))
      );
    }

    if (filters.fromAge !== undefined || filters.toAge !== undefined) {
      const minAge = filters.fromAge || 0;
      const maxAge = filters.toAge || 99;
      eventsRows = eventsRows.filter(ev =>
        (ev.from_age || 0) <= maxAge && (ev.to_age || 99) >= minAge
      );
    }

    if (filters.fromDate) {
      eventsRows = eventsRows.filter(ev => ev.from_date && ev.from_date >= filters.fromDate!);
    }

    if (filters.toDate) {
      eventsRows = eventsRows.filter(ev => ev.to_date && ev.to_date <= filters.toDate!);
    }

    if (filters.offset) {
      eventsRows = eventsRows.slice(filters.offset, filters.offset + (filters.limit || 20));
    }

    // Transform the data to match our Event interface
    const events: EventWithDetails[] = eventsRows.map((row) => ({
      id: row.id as string,
      name: (row.name as string) || '',
      description: (row.description as string) || '',
      fromDate: (row.from_date as string) || '',
      toDate: (row.to_date as string) || '',
      location: (row.location as string) || '',
      country: (row.country as string) || '',
      organizer: (row.organizer as string) || '',
      fromAge: row.from_age as number | undefined,
      toAge: row.to_age as number | undefined,
      youtubeLink: row.youtube_link as string | undefined,
      links: (row.links as string[]) || [],
      type: (row.type as string) || '',
      fields: (row.fields as string[]) || [],
      status: (row.status as EventStatus) || 'published',
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,

      // Additional fields for EventWithDetails
      category_name: (row.type as string) || '',
      average_rating: 0,
      tags: (row.fields as string[]) || []
    }));

    return events;
  } catch (error: unknown) {
    console.error('Error in getEvents:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw createDatabaseError(`Failed to fetch events: ${errorMessage}`, 'events');
  }
}

/**
 * Get a single event by ID
 */
export async function getEventById(id: string): Promise<EventWithDetails | null> {
  try {
    const docRef = adminDb.collection('events').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null;
    }

    const data = docSnap.data();

    if (!data || data.status !== 'published') {
      return null;
    }

    // Transform the data
    const event: EventWithDetails = {
      id: docSnap.id,
      name: data.name || '',
      description: data.description || '',
      fromDate: data.from_date || '',
      toDate: data.to_date || '',
      location: data.location || '',
      country: data.country || '',
      organizer: data.organizer || '',
      fromAge: data.from_age,
      toAge: data.to_age,
      youtubeLink: data.youtube_link,
      links: data.links || [],
      type: data.type || '',
      fields: data.fields || [],
      status: (data.status as EventStatus) || 'published',
      createdAt: data.created_at,
      updatedAt: data.updated_at,

      // Additional fields for EventWithDetails
      category_name: data.type || '',
      average_rating: 0,
      tags: data.fields || []
    };

    return event;
  } catch (error: unknown) {
    console.error('Error in getEventById:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw createDatabaseError(`Failed to fetch event: ${errorMessage}`, 'event');
  }
}

/**
 * Get popular events
 */
export async function getPopularEvents(limitCount: number = 10): Promise<EventWithDetails[]> {
  try {
    const querySnapshot = await adminDb.collection('events')
      .where('status', '==', 'published')
      .orderBy('created_at', 'desc')
      .limit(limitCount)
      .get();

    const eventsRows: EventRow[] = [];
    querySnapshot.forEach((doc) => {
      eventsRows.push({ id: doc.id, ...(doc.data() as Omit<EventRow, 'id'>) });
    });

    // Transform the data
    const events: EventWithDetails[] = eventsRows.map((row) => ({
      id: row.id as string,
      name: (row.name as string) || '',
      description: (row.description as string) || '',
      fromDate: (row.from_date as string) || '',
      toDate: (row.to_date as string) || '',
      location: (row.location as string) || '',
      country: (row.country as string) || '',
      organizer: (row.organizer as string) || '',
      fromAge: row.from_age as number | undefined,
      toAge: row.to_age as number | undefined,
      youtubeLink: row.youtube_link as string | undefined,
      links: (row.links as string[]) || [],
      type: (row.type as string) || '',
      fields: (row.fields as string[]) || [],
      status: (row.status as EventStatus) || 'published',
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,

      // Additional fields for EventWithDetails
      category_name: (row.type as string) || '',
      average_rating: 0,
      tags: (row.fields as string[]) || []
    }));

    return events;
  } catch (error: unknown) {
    console.error('Error in getPopularEvents:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw createDatabaseError(`Failed to fetch popular events: ${errorMessage}`, 'popular-events');
  }
}

/**
 * Get event types
 */
export async function getEventTypes() {
  try {
    const querySnapshot = await adminDb.collection('event_types')
      .where('is_active', '==', true)
      .get();

    const types: { id: string, name: string, is_active: boolean }[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      types.push({
        id: doc.id,
        name: (data.name as string) || '',
        is_active: (data.is_active as boolean) ?? true
      });
    });

    types.sort((a, b) => a.name.localeCompare(b.name));
    return types;
  } catch (error: unknown) {
    console.error('Error in getEventTypes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw createDatabaseError(`Failed to fetch event types: ${errorMessage}`, 'events');
  }
}

/**
 * Get all event fields
 */
export async function getEventFields() {
  try {
    const querySnapshot = await adminDb.collection('event_fields')
      .orderBy('usage_count', 'desc')
      .get();

    const fields: { id: string, name: string, usage_count: number }[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      fields.push({
        id: doc.id,
        name: (data.name as string) || doc.id,
        usage_count: (data.usage_count as number) || 0
      });
    });

    return fields;
  } catch (error: unknown) {
    console.error('Error in getEventFields:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw createDatabaseError(`Failed to fetch event fields: ${errorMessage}`, 'events');
  }
}

/**
 * Get event statistics
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getEventStats(_eventId: string) {
  try {
    // In Firestore, aggregation queries can be done via count(), sum(), etc.
    // Assuming you have an `event_stats` collection or query `event_registrations`,
    // this mimics the RPC call but without a stored procedure.
    // For now we could return a mock object, since we no longer have an SQL RPC.
    return {
      total_registrations: 0,
      total_views: 0,
      average_rating: 0,
      total_reviews: 0
    };
  } catch (error) {
    console.error('Error in getEventStats:', error);
    throw error;
  }
}
