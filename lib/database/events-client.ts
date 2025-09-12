'use client'

import { createClient } from '@/lib/supabase/client'
import { Event, EventStatus } from '@/types/event'
import { DatabaseEventWithRelations } from './types'
import { safeDatabaseOperation, handleDatabaseError } from './error-handler'

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
 * Get all events with optional filters (client-side)
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
      query = query.ilike('title', `%${filters.search}%`)
    }
    
    if (filters.category) {
      query = query.eq('event_categories.name', filters.category)
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
      const dbError = handleDatabaseError(error, 'fetch events')
      
      // Handle specific cases
      if (dbError.type === 'NOT_FOUND') {
        return []
      }
      
      throw new Error(dbError.message)
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
      const dbError = handleDatabaseError(error, 'fetch event by ID')
      
      if (dbError.type === 'NOT_FOUND') {
        return null
      }
      
      throw new Error(dbError.message)
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
      console.error('Error fetching popular events:', error)
      throw new Error(`Failed to fetch popular events: ${error.message}`)
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
      console.error('Error fetching categories:', error)
      throw new Error(`Failed to fetch categories: ${error.message}`)
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
      console.error('Error fetching tags:', error)
      throw new Error(`Failed to fetch tags: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Error in getTagsClient:', error)
    throw error
  }
}
