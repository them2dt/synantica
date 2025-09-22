import { createClient } from '@/lib/supabase/server'
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
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,organizer.ilike.%${filters.search}%`)
    }
    
    if (filters.category) {
      query = query.eq('type', filters.category)
    }
    
    if (filters.field) {
      query = query.contains('fields', [filters.field])
    }
    
    if (filters.minAge !== undefined) {
      query = query.gte('from_age', filters.minAge)
    }
    
    if (filters.maxAge !== undefined) {
      query = query.lte('to_age', filters.maxAge)
    }
    
    if (filters.region) {
      query = query.eq('country', filters.region)
    }
    
    if (filters.dateFrom) {
      query = query.gte('from_date', filters.dateFrom)
    }
    
    if (filters.dateTo) {
      query = query.lte('to_date', filters.dateTo)
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
        *
      `)
      .eq('id', id)
      .eq('status', 'published')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Event not found
      }
      throw createDatabaseError(`Failed to fetch event: ${error.message}`, 'event')
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
    console.error('Error in getPopularEvents:', error)
    throw error
  }
}

/**
 * Get event types
 */
export async function getEventTypes() {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('event_types')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) {
      throw createDatabaseError(`Failed to fetch event types: ${error.message}`, 'event-types')
    }

    return data || []
  } catch (error) {
    console.error('Error in getEventTypes:', error)
    throw error
  }
}

/**
 * Get all event fields
 */
export async function getEventFields() {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('event_fields')
      .select('*')
      .order('usage_count', { ascending: false })

    if (error) {
      throw createDatabaseError(`Failed to fetch event fields: ${error.message}`, 'event-fields')
    }

    return data || []
  } catch (error) {
    console.error('Error in getEventFields:', error)
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
      throw createDatabaseError(`Failed to fetch event stats: ${error.message}`, 'database')
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
