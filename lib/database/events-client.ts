'use client'

import { createClient } from '@/lib/supabase/client'
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
    const supabase = createClient()

    // Optimized query with only essential fields for directory/listing views
    let query = supabase
      .from('events')
      .select(`
        id,
        name,
        description,
        from_date,
        to_date,
        location,
        country,
        organizer,
        from_age,
        to_age,
        youtube_link,
        links,
        type,
        fields,
        status,
        created_at,
        updated_at
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    // Apply filters (same as before)
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,organizer.ilike.%${filters.search}%`)
    }

    if (filters.type) {
      query = query.eq('type', filters.type)
    }

    if (filters.fields && filters.fields.length > 0) {
      query = query.contains('fields', filters.fields)
    }

    // Age range filtering: event age range should overlap with filter range
    if (filters.fromAge !== undefined || filters.toAge !== undefined) {
      const minAge = filters.fromAge || 0
      const maxAge = filters.toAge || 99
      
      // Event should be included if: event.fromAge <= maxAge AND event.toAge >= minAge
      query = query.lte('from_age', maxAge).gte('to_age', minAge)
    }

    if (filters.country) {
      query = query.eq('country', filters.country)
    }

    if (filters.fromDate) {
      query = query.gte('from_date', filters.fromDate)
    }

    if (filters.toDate) {
      query = query.lte('to_date', filters.toDate)
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw createDatabaseError(`Failed to fetch directory events: ${error.message}`, 'events')
    }

    // Transform to optimized EventDirectory objects
    const events: EventDirectory[] = (data || []).map((row: unknown) => {
      if (!row || typeof row !== 'object') {
        throw new Error('Invalid event data received from database')
      }

      const eventRow = row as Record<string, unknown>

      return {
        id: eventRow.id as string,
        name: eventRow.name as string,
        description: (eventRow.description as string) || '',
        fromDate: eventRow.from_date as string,
        toDate: eventRow.to_date as string,
        location: eventRow.location as string,
        country: eventRow.country as string,
        organizer: eventRow.organizer as string,
        fromAge: (eventRow.from_age as number) || undefined,
        toAge: (eventRow.to_age as number) || undefined,
        youtubeLink: (eventRow.youtube_link as string) || undefined,
        links: (eventRow.links as string[]) || [],
        type: eventRow.type as string,
        fields: (eventRow.fields as string[]) || [],
        status: (eventRow.status as EventStatus) || 'published',
        createdAt: (eventRow.created_at as string) || new Date().toISOString(),
        updatedAt: (eventRow.updated_at as string) || new Date().toISOString()
      }
    })

    // Cache the results for future use
    eventsCache.set(filters, events)

    return events
  }, 'fetch directory events', true).finally(() => {
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
    const supabase = createClient()
    // Build optimized query with proper JOINs to avoid N+1 queries
    let query = supabase
      .from('events')
      .select(`
        id,
        name,
        description,
        from_date,
        to_date,
        location,
        country,
        organizer,
        from_age,
        to_age,
        youtube_link,
        links,
        type,
        fields,
        status,
        created_at,
        updated_at
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters.search) {
      // Search across multiple fields for better directory experience
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,organizer.ilike.%${filters.search}%`)
    }

    if (filters.type) {
      // Filter by type instead of category
      query = query.eq('type', filters.type)
    }

    if (filters.fields && filters.fields.length > 0) {
      query = query.contains('fields', filters.fields)
    }

    // Age range filtering: event age range should overlap with filter range
    if (filters.fromAge !== undefined || filters.toAge !== undefined) {
      const minAge = filters.fromAge || 0
      const maxAge = filters.toAge || 99
      
      // Event should be included if: event.fromAge <= maxAge AND event.toAge >= minAge
      query = query.lte('from_age', maxAge).gte('to_age', minAge)
    }

    if (filters.country) {
      query = query.eq('country', filters.country)
    }

    if (filters.fromDate) {
      query = query.gte('from_date', filters.fromDate)
    }

    if (filters.toDate) {
      query = query.lte('to_date', filters.toDate)
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw createDatabaseError(`Failed to fetch events: ${error.message}`, 'events')
    }

    // Transform the data to match our Event interface
    const events: EventWithDetails[] = (data || []).map((row: unknown) => {
      // Type guard for row data
      if (!row || typeof row !== 'object') {
        throw new Error('Invalid event data received from database')
      }
      
      const eventRow = row as Record<string, unknown>
      
      return {
        id: eventRow.id as string,
        name: eventRow.name as string,
        description: eventRow.description as string,
        fromDate: eventRow.from_date as string,
        toDate: eventRow.to_date as string,
        location: eventRow.location as string,
        country: eventRow.country as string,
        organizer: eventRow.organizer as string,
        fromAge: (eventRow.from_age as number) || undefined,
        toAge: (eventRow.to_age as number) || undefined,
        youtubeLink: (eventRow.youtube_link as string) || undefined,
        links: (eventRow.links as string[]) || [],
        type: eventRow.type as string,
        fields: (eventRow.fields as string[]) || [],
        status: (eventRow.status as EventStatus) || 'published',
        createdAt: (eventRow.created_at as string) || new Date().toISOString(),
        updatedAt: (eventRow.updated_at as string) || new Date().toISOString(),
        
        // Additional fields for EventWithDetails
        category_name: eventRow.type as string,
        average_rating: 0,
        tags: (eventRow.fields as string[]) || []
      }
    })

    return events
  }, 'fetch events', true)
}

/**
 * Get a single event by ID (client-side)
 */
export async function getEventByIdClient(id: string): Promise<EventWithDetails | null> {
  return safeDatabaseOperation(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('events')
      .select(`
        *
      `)
      .eq('id', id)
      .eq('status', 'published')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Event not found
      }
      throw createDatabaseError(`Failed to fetch event by ID: ${error.message}`, 'event')
    }

    if (!data) {
      return null
    }

    // Transform the data
    const event: EventWithDetails = {
      id: data.id,
      name: data.name,
      description: data.description,
      fromDate: data.from_date,
      toDate: data.to_date,
      location: data.location,
      country: data.country,
      organizer: data.organizer,
      fromAge: data.from_age,
      toAge: data.to_age,
      youtubeLink: data.youtube_link,
      links: data.links || [],
      type: data.type,
      fields: data.fields || [],
      status: data.status as EventStatus,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      
      // Additional fields for EventWithDetails
      category_name: data.type,
      average_rating: 0,
      tags: data.fields || []
    }

    return event
  }, 'fetch event by ID', true)
}

/**
 * Get popular events (client-side)
 */
export async function getPopularEventsClient(limit: number = 10): Promise<EventWithDetails[]> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        id,
        name,
        description,
        from_date,
        to_date,
        location,
        country,
        organizer,
        from_age,
        to_age,
        youtube_link,
        links,
        type,
        fields,
        status,
        created_at,
        updated_at
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw createDatabaseError(`Failed to fetch popular events: ${error.message}`, 'popular-events')
    }

    // Transform the data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const events: EventWithDetails[] = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      fromDate: row.from_date,
      toDate: row.to_date,
      location: row.location,
      country: row.country,
      organizer: row.organizer,
      fromAge: row.from_age,
      toAge: row.to_age,
      youtubeLink: row.youtube_link,
      links: row.links || [],
      type: row.type,
      fields: row.fields || [],
      status: row.status as EventStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      
      // Additional fields for EventWithDetails
      category_name: row.type,
      average_rating: 0,
      tags: row.fields || []
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
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('event_types')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) {
      throw createDatabaseError(`Failed to fetch event types: ${error.message}`, 'events')
    }

    return data || []
  } catch (error) {
    console.error('Error in getEventTypesClient:', error)
    throw error
  }
}

/**
 * Get all event fields (client-side)
 */
export async function getEventFieldsClient() {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('event_fields')
      .select('*')
      .order('usage_count', { ascending: false })

    if (error) {
      throw createDatabaseError(`Failed to fetch event fields: ${error.message}`, 'events')
    }

    return data || []
  } catch (error) {
    console.error('Error in getEventFieldsClient:', error)
    throw error
  }
}
