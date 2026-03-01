'use client'

import { db } from '@/lib/firebase/client'
import { collection, query, where, getDocs, getDoc, doc, limit, orderBy, Query } from 'firebase/firestore'
import { Event, EventStatus, EventDirectory, EventFilters } from '@/types/event'
import { safeDatabaseOperation } from './error-handler'
import { createDatabaseError } from '@/lib/utils/error-handling'

// Simple cache implementation
interface CacheEntry<T = unknown> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

class Cache {
  private cache = new Map<string, CacheEntry>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  private getKey(filters: EventFilters): string {
    return JSON.stringify(filters)
  }

  get<T = EventDirectory[]>(filters: EventFilters): T | null {
    const key = this.getKey(filters)
    const entry = this.cache.get(key) as CacheEntry<T> | undefined

    if (!entry) return null

    // Check if cache entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  set<T = EventDirectory[]>(filters: EventFilters, data: T, ttl: number = this.DEFAULT_TTL): void {
    const key = this.getKey(filters)
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

const eventsCache = new Cache()

// Request deduplication
const pendingRequests = new Map<string, Promise<EventDirectory[]>>()

function getRequestKey(filters: EventFilters): string {
  return JSON.stringify(filters)
}

/**
 * Client-side database service for events
 * For use in client components and hooks
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
 * Get all events with optional filters (client-side) - Optimized for directory views
 * Includes caching and request deduplication for better performance
 */
export async function getEventsDirectory(filters: EventFilters = {}): Promise<EventDirectory[]> {
  const requestKey = getRequestKey(filters)

  // Check if there's already a pending request for the same filters
  const pendingRequest = pendingRequests.get(requestKey)
  if (pendingRequest) {
    return pendingRequest
  }

  // Check cache first
  const cachedData = eventsCache.get(filters)
  if (cachedData) {
    return cachedData
  }

  // Create and store the promise to prevent duplicate requests
  const requestPromise = safeDatabaseOperation(async () => {
    try {
      let eventsQuery: Query = collection(db, 'events')

      // Since Firestore doesn't support complex OR queries (like search across multiple fields) 
      // or inequality filters on multiple fields easily, we do basic filtering here, 
      // and process the rest in memory if necessary (or we'd need a search service like Algolia).

      eventsQuery = query(eventsQuery, where('status', '==', 'published'))

      if (filters.type) {
        eventsQuery = query(eventsQuery, where('type', '==', filters.type))
      }

      if (filters.country) {
        eventsQuery = query(eventsQuery, where('country', '==', filters.country))
      }

      // Order by created_at. Note: if combining with inequality filters, Firestore 
      // requires ordering by that field first.
      eventsQuery = query(eventsQuery, orderBy('created_at', 'desc'))

      if (filters.limit) {
        eventsQuery = query(eventsQuery, limit(filters.limit))
      }

      const querySnapshot = await getDocs(eventsQuery)

      let eventsRows: EventRow[] = []
      querySnapshot.forEach((doc) => {
        eventsRows.push({ id: doc.id, ...doc.data() } as EventRow)
      })

      // In-memory advanced filtering (since Firestore query limitations)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        eventsRows = eventsRows.filter(ev =>
          (ev.name && ev.name.toLowerCase().includes(searchLower)) ||
          (ev.description && ev.description.toLowerCase().includes(searchLower)) ||
          (ev.organizer && ev.organizer.toLowerCase().includes(searchLower))
        )
      }

      if (filters.fields && filters.fields.length > 0) {
        eventsRows = eventsRows.filter(ev =>
          ev.fields && filters.fields!.some((f: string) => ev.fields!.includes(f))
        )
      }

      if (filters.fromAge !== undefined || filters.toAge !== undefined) {
        const minAge = filters.fromAge || 0
        const maxAge = filters.toAge || 99
        eventsRows = eventsRows.filter(ev =>
          (ev.from_age || 0) <= maxAge && (ev.to_age || 99) >= minAge
        )
      }

      if (filters.fromDate) {
        eventsRows = eventsRows.filter(ev => ev.from_date && ev.from_date >= filters.fromDate!)
      }

      if (filters.toDate) {
        eventsRows = eventsRows.filter(ev => ev.to_date && ev.to_date <= filters.toDate!)
      }

      if (filters.offset) {
        eventsRows = eventsRows.slice(filters.offset, filters.offset + (filters.limit || 20))
      }

      // Transform to optimized EventDirectory objects
      const events: EventDirectory[] = eventsRows.map((eventRow) => {
        return {
          id: eventRow.id as string,
          name: (eventRow.name as string) || '',
          description: (eventRow.description as string) || '',
          fromDate: (eventRow.from_date as string) || '',
          toDate: (eventRow.to_date as string) || '',
          location: (eventRow.location as string) || '',
          country: (eventRow.country as string) || '',
          organizer: (eventRow.organizer as string) || '',
          fromAge: eventRow.from_age as number | undefined,
          toAge: eventRow.to_age as number | undefined,
          youtubeLink: eventRow.youtube_link as string | undefined,
          links: (eventRow.links as string[]) || [],
          type: (eventRow.type as string) || '',
          fields: (eventRow.fields as string[]) || [],
          status: (eventRow.status as EventStatus) || 'published',
          createdAt: (eventRow.created_at as string) || new Date().toISOString(),
          updatedAt: (eventRow.updated_at as string) || new Date().toISOString()
        }
      })

      // Cache the results for future use
      eventsCache.set(filters, events)

      return events
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw createDatabaseError(`Failed to fetch directory events: ${errorMessage}`, 'events')
    }
    // Clean up the pending request
    pendingRequests.delete(requestKey)
  })

  // Store the promise to prevent duplicate requests
  pendingRequests.set(requestKey, requestPromise)

  return requestPromise
}

/**
 * Clear the events cache (useful when data might have changed)
 */
export function clearEventsCache(): void {
  eventsCache.clear()
}

/**
 * Preload next page of events for smoother user experience
 * @param filters - Current filters
 * @param currentPage - Current page number
 * @param pageSize - Number of events per page
 */
export function preloadNextPage(filters: EventFilters = {}, currentPage: number, pageSize: number = 20): void {
  const nextPageFilters: EventFilters = {
    ...filters,
    limit: pageSize,
    offset: (currentPage + 1) * pageSize
  }

  // Preload in background without awaiting
  getEventsDirectory(nextPageFilters).catch(err => {
    console.warn('Failed to preload next page:', err)
  })
}

/**
 * Get all events with optional filters (client-side) - Full details for individual views
 */
export async function getEventsClient(filters: EventFilters = {}): Promise<EventWithDetails[]> {
  return safeDatabaseOperation(async () => {
    try {
      let eventsQuery: Query = collection(db, 'events')

      eventsQuery = query(eventsQuery, where('status', '==', 'published'))

      if (filters.type) {
        eventsQuery = query(eventsQuery, where('type', '==', filters.type))
      }

      if (filters.country) {
        eventsQuery = query(eventsQuery, where('country', '==', filters.country))
      }

      eventsQuery = query(eventsQuery, orderBy('created_at', 'desc'))

      if (filters.limit) {
        eventsQuery = query(eventsQuery, limit(filters.limit))
      }

      const querySnapshot = await getDocs(eventsQuery)

      let eventsRows: EventRow[] = []
      querySnapshot.forEach((doc) => {
        eventsRows.push({ id: doc.id, ...doc.data() } as EventRow)
      })

      // In-memory advanced filtering
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        eventsRows = eventsRows.filter(ev =>
          (ev.name && ev.name.toLowerCase().includes(searchLower)) ||
          (ev.description && ev.description.toLowerCase().includes(searchLower)) ||
          (ev.organizer && ev.organizer.toLowerCase().includes(searchLower))
        )
      }

      if (filters.fields && filters.fields.length > 0) {
        eventsRows = eventsRows.filter(ev =>
          ev.fields && filters.fields!.some((f: string) => ev.fields!.includes(f))
        )
      }

      if (filters.fromAge !== undefined || filters.toAge !== undefined) {
        const minAge = filters.fromAge || 0
        const maxAge = filters.toAge || 99
        eventsRows = eventsRows.filter(ev =>
          (ev.from_age || 0) <= maxAge && (ev.to_age || 99) >= minAge
        )
      }

      if (filters.fromDate) {
        eventsRows = eventsRows.filter(ev => ev.from_date && ev.from_date >= filters.fromDate!)
      }

      if (filters.toDate) {
        eventsRows = eventsRows.filter(ev => ev.to_date && ev.to_date <= filters.toDate!)
      }

      if (filters.offset) {
        eventsRows = eventsRows.slice(filters.offset, filters.offset + (filters.limit || 20))
      }

      // Transform the data to match our Event interface
      const events: EventWithDetails[] = eventsRows.map((eventRow) => {
        return {
          id: eventRow.id as string,
          name: (eventRow.name as string) || '',
          description: (eventRow.description as string) || '',
          fromDate: (eventRow.from_date as string) || '',
          toDate: (eventRow.to_date as string) || '',
          location: (eventRow.location as string) || '',
          country: (eventRow.country as string) || '',
          organizer: (eventRow.organizer as string) || '',
          fromAge: eventRow.from_age as number | undefined,
          toAge: eventRow.to_age as number | undefined,
          youtubeLink: eventRow.youtube_link as string | undefined,
          links: (eventRow.links as string[]) || [],
          type: (eventRow.type as string) || '',
          fields: (eventRow.fields as string[]) || [],
          status: (eventRow.status as EventStatus) || 'published',
          createdAt: (eventRow.created_at as string) || new Date().toISOString(),
          updatedAt: (eventRow.updated_at as string) || new Date().toISOString(),

          // Additional fields for EventWithDetails
          category_name: (eventRow.type as string) || '',
          average_rating: 0,
          tags: (eventRow.fields as string[]) || []
        }
      })

      return events
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw createDatabaseError(`Failed to fetch events: ${errorMessage}`, 'events')
    }
  }, 'fetch events', true)
}

/**
 * Get a single event by ID (client-side)
 */
export async function getEventByIdClient(id: string): Promise<EventWithDetails | null> {
  return safeDatabaseOperation(async () => {
    try {
      const docRef = doc(db, 'events', id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        return null // Event not found
      }

      const data = docSnap.data()

      if (data.status !== 'published') {
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
      }

      return event
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw createDatabaseError(`Failed to fetch event by ID: ${errorMessage}`, 'event')
    }
  }, 'fetch event by ID', true)
}

/**
 * Get popular events (client-side)
 */
export async function getPopularEventsClient(limitCount: number = 10): Promise<EventWithDetails[]> {
  try {
    const eventsQuery = query(
      collection(db, 'events'),
      where('status', '==', 'published'),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(eventsQuery)
    const eventsRows: EventRow[] = []
    querySnapshot.forEach((doc) => {
      eventsRows.push({ id: doc.id, ...(doc.data() as Omit<EventRow, 'id'>) })
    })

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
    }))

    return events
  } catch (error) {
    console.error('Error in getPopularEventsClient:', error)
    throw error
  }
}

/**
 * Get event types (client-side)
 */
export async function getEventTypesClient() {
  try {
    const typesQuery = query(collection(db, 'event_types'), where('is_active', '==', true))
    const querySnapshot = await getDocs(typesQuery)
    const types: { id: string, name: string, is_active: boolean }[] = []
    // Since Firebase doesn't order easily without index on name, we can sort in JS
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      types.push({
        id: doc.id,
        name: (data.name as string) || '',
        is_active: (data.is_active as boolean) ?? true
      })
    })

    types.sort((a, b) => a.name.localeCompare(b.name))
    return types
  } catch (error) {
    console.error('Error in getEventTypesClient:', error)
    throw error
  }
}

/**
 * Get all event fields (client-side)
 */
export async function getEventFieldsClient() {
  try {
    const fieldsQuery = query(collection(db, 'event_fields'), orderBy('usage_count', 'desc'))
    const querySnapshot = await getDocs(fieldsQuery)

    const fields: { id: string, name: string, usage_count: number }[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      fields.push({
        id: doc.id,
        name: (data.name as string) || doc.id,
        usage_count: (data.usage_count as number) || 0
      })
    })

    return fields
  } catch (error) {
    console.error('Error in getEventFieldsClient:', error)
    throw error
  }
}
