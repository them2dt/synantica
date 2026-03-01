'use client'

import { db } from '@/lib/firebase/client'
import { collection, query, where, getDocs, getDoc, doc, limit, orderBy, Query } from 'firebase/firestore'
import { EventDirectory, EventFilters } from '@/types/event'
import { createDatabaseError, safeDatabaseOperation } from '@/lib/utils/error-handling'
import { applyEventFilters, mapEventRowToEventDirectory, mapEventRowToEventWithDetails, mapFirestoreDataToEventRow } from './events-mappers'
import type { EventRow, EventWithDetails } from './events-types'

export type { EventWithDetails } from './events-types'

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
    console.time(`[PERF] getEventsDirectory:${requestKey}`)
    try {
      console.time(`[PERF] Firestore Query:${requestKey}`)
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
      console.timeEnd(`[PERF] Firestore Query:${requestKey}`)

      console.time(`[PERF] Mapping & In-Memory Filtering:${requestKey}`)
      const eventsRows: EventRow[] = []
      querySnapshot.forEach((doc) => {
        eventsRows.push(mapFirestoreDataToEventRow(doc.id, doc.data() as Record<string, unknown>))
      })

      const filteredRows = applyEventFilters(eventsRows, filters)

      // Transform to optimized EventDirectory objects
      const events: EventDirectory[] = filteredRows.map(mapEventRowToEventDirectory)

      // Cache the results for future use
      eventsCache.set(filters, events)
      console.timeEnd(`[PERF] Mapping & In-Memory Filtering:${requestKey}`)
      console.timeEnd(`[PERF] getEventsDirectory:${requestKey}`)

      return events
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw createDatabaseError(`Failed to fetch directory events: ${errorMessage}`, 'events')
    }
  }, 'fetch directory events', true, 'events')

  // Store the promise to prevent duplicate requests
  pendingRequests.set(requestKey, requestPromise)

  requestPromise.finally(() => {
    pendingRequests.delete(requestKey)
  })

  return requestPromise
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

      const eventsRows: EventRow[] = []
      querySnapshot.forEach((doc) => {
        eventsRows.push(mapFirestoreDataToEventRow(doc.id, doc.data() as Record<string, unknown>))
      })

      const filteredRows = applyEventFilters(eventsRows, filters)

      // Transform the data to match our Event interface
      const events: EventWithDetails[] = filteredRows.map(mapEventRowToEventWithDetails)

      return events
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw createDatabaseError(`Failed to fetch events: ${errorMessage}`, 'events')
    }
  }, 'fetch events', true, 'events')
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

      const eventRow = mapFirestoreDataToEventRow(docSnap.id, data as Record<string, unknown>)
      return mapEventRowToEventWithDetails(eventRow)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw createDatabaseError(`Failed to fetch event by ID: ${errorMessage}`, 'event')
    }
  }, 'fetch event by ID', true, 'event')
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
      eventsRows.push(mapFirestoreDataToEventRow(doc.id, doc.data() as Record<string, unknown>))
    })

    // Transform the data
    const events: EventWithDetails[] = eventsRows.map(mapEventRowToEventWithDetails)

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


