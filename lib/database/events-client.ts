'use client'

import { createClient } from '@/lib/supabase/client'
import { Event, EventStatus, EventDirectory } from '@/types/event'
import { DatabaseEventWithRelations } from './types'
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

export interface EventFilters {
  search?: string
  category?: string
  field?: string
  minAge?: number
  maxAge?: number
  region?: string
  dateFrom?: string
  dateTo?: string
  isFree?: boolean
  status?: EventStatus
  limit?: number
  offset?: number
}

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
        title,
        description,
        short_description,
        field,
        min_age,
        max_age,
        region,
        date,
        time,
        end_date,
        end_time,
        location,
        is_virtual,
        is_free,
        status,
        is_featured,
        organizer_name,
        view_count,
        created_at,
        updated_at,
        event_categories!inner(
          id,
          name,
          slug
        ),
        event_tags(
          tags(
            id,
            name,
            slug
          )
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    // Apply filters (same as before)
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,organizer_name.ilike.%${filters.search}%`)
    }

    if (filters.category) {
      query = query.eq('event_categories.slug', filters.category)
    }

    if (filters.field) {
      query = query.eq('field', filters.field)
    }

    if (filters.minAge !== undefined) {
      query = query.gte('min_age', filters.minAge)
    }

    if (filters.maxAge !== undefined) {
      query = query.lte('max_age', filters.maxAge)
    }

    if (filters.region) {
      query = query.eq('region', filters.region)
    }

    if (filters.dateFrom) {
      query = query.gte('date', filters.dateFrom)
    }

    if (filters.dateTo) {
      query = query.lte('date', filters.dateTo)
    }

    if (filters.isFree !== undefined) {
      query = query.eq('is_free', filters.isFree)
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

      // Extract tags from the optimized query result
      const eventTags = eventRow.event_tags as Array<{ tags: { name: string } }> | undefined
      const tags = eventTags?.map((et) => et.tags?.name).filter(Boolean) || []

      return {
        id: eventRow.id as string,
        title: eventRow.title as string,
        description: (eventRow.description as string) || '',
        shortDescription: (eventRow.short_description as string) || undefined,
        category: (eventRow.event_categories as { slug: string } | undefined)?.slug || 'other',
        field: eventRow.field as string,
        minAge: (eventRow.min_age as number) || 0,
        maxAge: (eventRow.max_age as number) || 100,
        region: eventRow.region as string,
        date: eventRow.date as string,
        time: eventRow.time as string,
        endDate: (eventRow.end_date as string) || undefined,
        endTime: (eventRow.end_time as string) || undefined,
        location: eventRow.location as string,
        isVirtual: (eventRow.is_virtual as boolean) || false,
        isFree: (eventRow.is_free as boolean) || false,
        status: (eventRow.status as EventStatus) || 'published',
        isFeatured: (eventRow.is_featured as boolean) || false,
        organizer: (eventRow.organizer_name as string) || 'Unknown',
        viewCount: (eventRow.view_count as number) || 0,
        createdAt: (eventRow.created_at as string) || new Date().toISOString(),
        updatedAt: (eventRow.updated_at as string) || new Date().toISOString(),
        tags
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
        title,
        description,
        field,
        min_age,
        max_age,
        region,
        date,
        time,
        location,
        is_free,
        status,
        organizer_name,
        created_at,
        updated_at,
        view_count,
        event_categories!inner(
          id,
          name,
          slug,
          color
        ),
        event_tags(
          tags(
            id,
            name,
            slug
          )
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters.search) {
      // Search across multiple fields for better directory experience
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,organizer_name.ilike.%${filters.search}%`)
    }

    if (filters.category) {
      // Filter by category slug instead of name for better performance
      query = query.eq('event_categories.slug', filters.category)
    }

    if (filters.field) {
      query = query.eq('field', filters.field)
    }

    if (filters.minAge !== undefined) {
      query = query.gte('min_age', filters.minAge)
    }

    if (filters.maxAge !== undefined) {
      query = query.lte('max_age', filters.maxAge)
    }

    if (filters.region) {
      query = query.eq('region', filters.region)
    }

    if (filters.dateFrom) {
      query = query.gte('date', filters.dateFrom)
    }

    if (filters.dateTo) {
      query = query.lte('date', filters.dateTo)
    }

    if (filters.isFree !== undefined) {
      query = query.eq('is_free', filters.isFree)
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
      
      // Extract tags from the optimized query result
      const eventTags = eventRow.event_tags as Array<{ tags: { name: string } }> | undefined
      const tags = eventTags?.map((et) => et.tags?.name).filter(Boolean) || []
      
      return {
        id: eventRow.id as string,
        title: eventRow.title as string,
        description: eventRow.description as string,
        category: (eventRow.event_categories as { name: string } | undefined)?.name?.toLowerCase().replace(/\s+/g, '-') || 'other',
        field: eventRow.field as string,
        minAge: (eventRow.min_age as number) || 0,
        maxAge: (eventRow.max_age as number) || 100,
        region: eventRow.region as string,
        date: eventRow.date as string,
        time: eventRow.time as string,
        location: eventRow.location as string,
        isFree: (eventRow.is_free as boolean) || false,
        status: (eventRow.status as EventStatus) || 'published',
        organizer: (eventRow.organizer_name as string) || 'Unknown',
        createdAt: (eventRow.created_at as string) || new Date().toISOString(),
        updatedAt: (eventRow.updated_at as string) || new Date().toISOString(),
        tags,
        
        // Additional fields from the database
        category_name: (eventRow.event_categories as { name: string } | undefined)?.name || 'Other',
        average_rating: 0,
        viewCount: (eventRow.view_count as number) || 0
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
        *,
        event_categories(name),
        event_tags(
          tags(name)
        )
      `)
      .eq('id', id)
      .eq('status', 'published')
      .single() as { data: DatabaseEventWithRelations | null; error: { code?: string; message: string } | null }

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
      title: data.title,
      description: data.description,
      category: data.event_categories?.name?.toLowerCase().replace(/\s+/g, '-') || 'other',
      field: data.field,
      minAge: data.min_age,
      maxAge: data.max_age,
      region: data.region,
      date: data.date,
      time: data.time,
      location: data.location,
      isFree: data.is_free,
      status: data.status as EventStatus,
      organizer: data.organizer_name,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      tags: data.event_tags?.map((et: { tags: { name: string } }) => et.tags.name) || [],
      
      // Additional fields
      category_name: data.event_categories?.name || 'Other',
      average_rating: 0
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
        title,
        description,
        field,
        min_age,
        max_age,
        region,
        date,
        time,
        location,
        is_free,
        event_categories(name)
      `)
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(limit)

    if (error) {
      throw createDatabaseError(`Failed to fetch popular events: ${error.message}`, 'popular-events')
    }

    // Transform the data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const events: EventWithDetails[] = (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.event_categories?.name?.toLowerCase().replace(/\s+/g, '-') || 'other',
      field: row.field,
      minAge: row.min_age || 0,
      maxAge: row.max_age || 100,
      region: row.region,
      date: row.date,
      time: row.time,
      location: row.location,
      isFree: row.is_free,
      status: 'published' as EventStatus,
      organizer: 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      
      // Additional fields
      category_name: row.event_categories?.name || 'Other',
      average_rating: 0
    }))

    return events
  } catch (error) {
    console.error('Error in getPopularEventsClient:', error)
    throw error
  }
}

/**
 * Get event categories (client-side)
 */
export async function getEventCategoriesClient() {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('event_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (error) {
      throw createDatabaseError(`Failed to fetch categories: ${error.message}`, 'categories')
    }

    return data || []
  } catch (error) {
    console.error('Error in getEventCategoriesClient:', error)
    throw error
  }
}

/**
 * Get all tags (client-side)
 */
export async function getTagsClient() {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('usage_count', { ascending: false })

    if (error) {
      throw createDatabaseError(`Failed to fetch tags: ${error.message}`, 'tags')
    }

    return data || []
  } catch (error) {
    console.error('Error in getTagsClient:', error)
    throw error
  }
}
