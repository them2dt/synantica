import { createClient } from '@/lib/supabase/server'
import { Event, EventStatus } from '@/types/event'
import { DatabaseEventWithRelations } from './types'

/**
 * Database service for events
 * Handles all CRUD operations and complex queries
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
  registration_count: number
  average_rating: number
  tags: string[]
  // Database-specific fields
  support_pdfs?: Array<{ name: string; url: string }>
  organization_homepage?: string
  youtube_videos?: string[]
  alumni_contact_email?: string
  registration_url?: string
}

/**
 * Get all events with optional filters
 */
export async function getEvents(filters: EventFilters = {}): Promise<EventWithDetails[]> {
  const supabase = await createClient()
  
  try {
    // Build query with filters
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
        registration_count,
        event_categories(name)
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
      console.error('Error fetching events:', error)
      throw new Error(`Failed to fetch events: ${error.message}`)
    }

    // Transform the data to match our Event interface
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
      registrationRequired: true,
      organizer: 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      
      // Additional fields from the database
      category_name: row.event_categories?.name || 'Other',
      registration_count: row.registration_count || 0,
      average_rating: 0
    }))

    return events
  } catch (error) {
    console.error('Error in getEvents:', error)
    throw error
  }
}

/**
 * Get a single event by ID
 */
export async function getEventById(id: string): Promise<EventWithDetails | null> {
  const supabase = await createClient()
  
  try {
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
      console.error('Error fetching event:', error)
      throw new Error(`Failed to fetch event: ${error.message}`)
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
      registrationRequired: data.registration_required,
      organizer: data.organizer_name,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      tags: data.event_tags?.map((et: { tags: { name: string } }) => et.tags.name) || [],
      
      // Additional fields
      category_name: data.event_categories?.name || 'Other',
      registration_count: data.registration_count || 0,
      average_rating: 0 // Would need to calculate from reviews
    }

    return event
  } catch (error) {
    console.error('Error in getEventById:', error)
    throw error
  }
}

/**
 * Get popular events
 */
export async function getPopularEvents(limit: number = 10): Promise<EventWithDetails[]> {
  const supabase = await createClient()
  
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
        registration_count,
        event_categories(name)
      `)
      .eq('status', 'published')
      .order('registration_count', { ascending: false })
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
      registrationRequired: true,
      organizer: 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      
      // Additional fields
      category_name: row.event_categories?.name || 'Other',
      registration_count: row.registration_count || 0,
      average_rating: 0
    }))

    return events
  } catch (error) {
    console.error('Error in getPopularEvents:', error)
    throw error
  }
}

/**
 * Get event categories
 */
export async function getEventCategories() {
  const supabase = await createClient()
  
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
    console.error('Error in getEventCategories:', error)
    throw error
  }
}

/**
 * Get all tags
 */
export async function getTags() {
  const supabase = await createClient()
  
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
    console.error('Error in getTags:', error)
    throw error
  }
}

/**
 * Get event statistics
 */
export async function getEventStats(eventId: string) {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase.rpc('get_event_stats', {
      event_uuid: eventId
    })

    if (error) {
      console.error('Error fetching event stats:', error)
      throw new Error(`Failed to fetch event stats: ${error.message}`)
    }

    return data?.[0] || {
      total_registrations: 0,
      total_views: 0,
      average_rating: 0,
      total_reviews: 0
    }
  } catch (error) {
    console.error('Error in getEventStats:', error)
    throw error
  }
}
