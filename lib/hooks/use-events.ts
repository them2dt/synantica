'use client'

import { useState, useEffect, useCallback } from 'react'
import { getEventsClient, getEventByIdClient, getPopularEventsClient, getEventsDirectory, preloadNextPage, EventFilters, EventWithDetails } from '@/lib/database/events-client'
import { EventDirectory, EventStatus } from '@/types/event'
import { DatabaseEventCategory, DatabaseTag } from '@/lib/database/types'

/**
 * Custom hook for managing events data - Full details for individual views
 */
export function useEvents(filters: EventFilters = {}) {
  const [events, setEvents] = useState<EventWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getEventsClient(filters)
      setEvents(data)
    } catch (err) {
      console.error('Error fetching events:', err)

      // Handle different error types
      let errorMessage = 'Failed to fetch events'

      if (err instanceof Error) {
        if (err.message.includes('Authentication required')) {
          errorMessage = 'Please log in to view events'
        } else if (err.message.includes('permission')) {
          errorMessage = 'You do not have permission to view events'
        } else if (err.message.includes('Network error')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return {
    events,
    loading,
    error,
    refetch: fetchEvents
  }
}

/**
 * Custom hook for managing directory-optimized events data
 * @param filters - Optional filters to apply
 */
export function useEventsDirectory(filters: EventFilters = {}) {
  const [events, setEvents] = useState<EventDirectory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getEventsDirectory(filters)
      setEvents(data)
    } catch (err) {
      console.error('Error fetching directory events:', err)

      // Handle different error types
      let errorMessage = 'Failed to fetch events'

      if (err instanceof Error) {
        if (err.message.includes('Authentication required')) {
          errorMessage = 'Please log in to view events'
        } else if (err.message.includes('permission')) {
          errorMessage = 'You do not have permission to view events'
        } else if (err.message.includes('Network error')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return {
    events,
    loading,
    error,
    refetch: fetchEvents
  }
}

/**
 * Custom hook for paginated directory-optimized events data
 * @param filters - Optional filters to apply
 * @param pageSize - Number of events per page (default: 20)
 */
export function useEventsDirectoryPaginated(filters: EventFilters = {}, pageSize: number = 20) {
  const [events, setEvents] = useState<EventDirectory[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)

  const fetchEvents = useCallback(async (page: number = 0, append: boolean = false) => {
    try {
      if (page === 0) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      setError(null)

      const paginatedFilters: EventFilters = {
        ...filters,
        limit: pageSize,
        offset: page * pageSize
      }

      const data = await getEventsDirectory(paginatedFilters)

      if (append) {
        setEvents(prev => [...prev, ...data])
      } else {
        setEvents(data)
      }

      // If we got fewer events than requested, we've reached the end
      setHasMore(data.length === pageSize)
      setCurrentPage(page)
    } catch (err) {
      console.error('Error fetching paginated events:', err)

      // Handle different error types
      let errorMessage = 'Failed to fetch events'

      if (err instanceof Error) {
        if (err.message.includes('Authentication required')) {
          errorMessage = 'Please log in to view events'
        } else if (err.message.includes('permission')) {
          errorMessage = 'You do not have permission to view events'
        } else if (err.message.includes('Network error')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [filters, pageSize])

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchEvents(currentPage + 1, true)

      // Preload the page after next when loading current next page
      if (hasMore && currentPage >= 0) {
        setTimeout(() => {
          preloadNextPage(filters, currentPage + 1, pageSize)
        }, 1000) // Small delay to avoid immediate preload
      }
    }
  }, [fetchEvents, currentPage, loadingMore, hasMore, filters, pageSize])

  // Preload next page when we have less than 3 pages worth of data
  useEffect(() => {
    if (hasMore && events.length > 0 && events.length <= pageSize * 2) {
      preloadNextPage(filters, currentPage, pageSize)
    }
  }, [events.length, hasMore, currentPage, filters, pageSize])

  // Cleanup cache periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      // This would trigger cache cleanup if we exposed it
      // For now, we'll just clear any expired entries
    }, 60000) // Every minute

    return () => clearInterval(cleanup)
  }, [])

  const refetch = useCallback(() => {
    setCurrentPage(0)
    fetchEvents(0, false)
  }, [fetchEvents])

  // Initial load
  useEffect(() => {
    setCurrentPage(0)
    fetchEvents(0, false)
  }, [fetchEvents])

  return {
    events,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
    currentPage
  }
}

/**
 * Custom hook for fetching a single event
 */
export function useEvent(eventId: string) {
  const [event, setEvent] = useState<EventWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvent = useCallback(async () => {
    if (!eventId) return

    try {
      setLoading(true)
      setError(null)
      const data = await getEventByIdClient(eventId)
      setEvent(data)
    } catch (err) {
      console.error('Error fetching event:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch event')
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])

  return {
    event,
    loading,
    error,
    refetch: fetchEvent
  }
}

/**
 * Custom hook for popular events
 */
export function usePopularEvents(limit: number = 10) {
  const [events, setEvents] = useState<EventWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPopularEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPopularEventsClient(limit)
      setEvents(data)
    } catch (err) {
      console.error('Error fetching popular events:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch popular events')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchPopularEvents()
  }, [fetchPopularEvents])

  return {
    events,
    loading,
    error,
    refetch: fetchPopularEvents
  }
}

/**
 * Custom hook for event categories
 */
export function useEventCategories() {
  const [categories, setCategories] = useState<DatabaseEventCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { getEventCategoriesClient } = await import('@/lib/database/events-client')
      const data = await getEventCategoriesClient()
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  }
}

/**
 * Custom hook for tags
 */
export function useTags() {
  const [tags, setTags] = useState<DatabaseTag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { getTagsClient } = await import('@/lib/database/events-client')
      const data = await getTagsClient()
      setTags(data)
    } catch (err) {
      console.error('Error fetching tags:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch tags')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  return {
    tags,
    loading,
    error,
    refetch: fetchTags
  }
}

/**
 * Custom hook for real-time event updates
 * @param onEventUpdate - Callback function called when events are updated
 * @param enabled - Whether to enable real-time updates (default: true)
 */
export function useRealtimeEvents(
  onEventUpdate?: (event: EventDirectory, action: 'INSERT' | 'UPDATE' | 'DELETE') => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled || !onEventUpdate) return

    const setupRealtimeSubscription = async () => {
      try {
        // Import supabase client dynamically to avoid SSR issues
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()

        const subscription = supabase
          .channel('events_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'events',
              filter: 'status=eq.published'
            },
            (payload) => {
              console.log('Real-time event update:', payload)

              // Transform the database event to EventDirectory format
              if (payload.new && typeof payload.new === 'object') {
                const dbEvent = payload.new as Record<string, unknown>
                const event: EventDirectory = {
                  id: dbEvent.id as string,
                  title: dbEvent.title as string,
                  description: (dbEvent.description as string) || '',
                  shortDescription: dbEvent.short_description as string,
                  category: 'other', // Would need category lookup for full implementation
                  field: dbEvent.field as string,
                  minAge: (dbEvent.min_age as number) || 0,
                  maxAge: (dbEvent.max_age as number) || 100,
                  region: dbEvent.region as string,
                  date: dbEvent.date as string,
                  time: dbEvent.time as string,
                  endDate: dbEvent.end_date as string,
                  endTime: dbEvent.end_time as string,
                  location: dbEvent.location as string,
                  isVirtual: (dbEvent.is_virtual as boolean) || false,
                  isFree: (dbEvent.is_free as boolean) || false,
                  status: ((dbEvent.status as string) || 'published') as EventStatus,
                  isFeatured: (dbEvent.is_featured as boolean) || false,
                  organizer: (dbEvent.organizer_name as string) || 'Unknown',
                  viewCount: (dbEvent.view_count as number) || 0,
                  createdAt: dbEvent.created_at as string,
                  updatedAt: dbEvent.updated_at as string,
                  tags: [] // Would need tag lookup for full implementation
                }

                onEventUpdate(event, payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE')
              }
            }
          )
          .subscribe()

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Failed to setup real-time subscription:', error)
      }
    }

    const cleanup = setupRealtimeSubscription()

    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.())
    }
  }, [enabled, onEventUpdate])
}
