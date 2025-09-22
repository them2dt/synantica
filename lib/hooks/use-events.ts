'use client'

import { useState, useEffect, useCallback } from 'react'
import { getEventsClient, getEventByIdClient, getPopularEventsClient, getEventsDirectory, preloadNextPage, EventWithDetails } from '@/lib/database/events-client'
import { EventDirectory, EventStatus, EventFilters } from '@/types/event'
import { handleAsyncError } from '@/lib/utils/error-handling'

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
      handleAsyncError(err, 'events', setError, setLoading)
      return // Early return since error is handled
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
      handleAsyncError(err, 'events', setError, setLoading)
      return // Early return since error is handled
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
      handleAsyncError(err, 'events', setError, setLoading)
      return // Early return since error is handled
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
      handleAsyncError(err, 'event', setError, setLoading)
      return // Early return since error is handled
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
      handleAsyncError(err, 'popular-events', setError, setLoading)
      return // Early return since error is handled
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
 * Custom hook for event types
 */
export function useEventTypes() {
  const [eventTypes, setEventTypes] = useState<Array<{ id: string; name: string; is_active: boolean }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEventTypes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { getEventTypesClient } = await import('@/lib/database/events-client')
      const data = await getEventTypesClient()
      setEventTypes(data)
    } catch (err) {
      handleAsyncError(err, 'event-types', setError, setLoading)
      return // Early return since error is handled
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEventTypes()
  }, [fetchEventTypes])

  return {
    eventTypes,
    loading,
    error,
    refetch: fetchEventTypes
  }
}

/**
 * Custom hook for event fields
 */
export function useEventFields() {
  const [fields, setFields] = useState<Array<{ id: string; name: string; usage_count: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFields = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { getEventFieldsClient } = await import('@/lib/database/events-client')
      const data = await getEventFieldsClient()
      setFields(data)
    } catch (err) {
      handleAsyncError(err, 'event-fields', setError, setLoading)
      return // Early return since error is handled
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFields()
  }, [fetchFields])

  return {
    fields,
    loading,
    error,
    refetch: fetchFields
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
                  name: dbEvent.name as string,
                  description: (dbEvent.description as string) || '',
                  fromDate: dbEvent.from_date as string,
                  toDate: dbEvent.to_date as string,
                  location: dbEvent.location as string,
                  country: dbEvent.country as string,
                  organizer: dbEvent.organizer as string,
                  fromAge: (dbEvent.from_age as number) || undefined,
                  toAge: (dbEvent.to_age as number) || undefined,
                  youtubeLink: (dbEvent.youtube_link as string) || undefined,
                  links: (dbEvent.links as string[]) || [],
                  type: dbEvent.type as string,
                  fields: (dbEvent.fields as string[]) || [],
                  status: ((dbEvent.status as string) || 'published') as EventStatus,
                  createdAt: dbEvent.created_at as string,
                  updatedAt: dbEvent.updated_at as string
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
