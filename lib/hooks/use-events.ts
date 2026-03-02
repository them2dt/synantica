'use client'

import { useState, useEffect, useCallback } from 'react'
import { getEventByIdClient, getEventsDirectory, preloadNextPage, getMyEventsClient, EventWithDetails } from '@/lib/database/events-client'
import { EventDirectory, EventStatus, EventFilters } from '@/types/event'
import { handleAsyncError } from '@/lib/utils/error-handling'
import { useAuth } from '@/lib/hooks/use-auth'



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
      handleAsyncError(err, 'events', setError, setLoading)
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
 * Custom hook for fetching the authenticated user's submitted events
 */
export function useMyEvents() {
  const { user } = useAuth()
  const [events, setEvents] = useState<EventWithDetails[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMyEvents = useCallback(async () => {
    if (!user) {
      setEvents([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getMyEventsClient(user.id)
      setEvents(data)
    } catch (err) {
      handleAsyncError(err, 'events', setError, setLoading)
      return
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchMyEvents()
  }, [fetchMyEvents])

  return { events, loading, error, refetch: fetchMyEvents }
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

    let unsubscribe: () => void

    const setupRealtimeSubscription = async () => {
      try {
        const { db } = await import('@/lib/firebase/client')
        const { collection, query, where, onSnapshot } = await import('firebase/firestore')

        const eventsQuery = query(collection(db, 'events'), where('status', '==', 'published'))

        unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const dbEvent = change.doc.data()
            const event: EventDirectory = {
              id: change.doc.id,
              name: dbEvent.name || '',
              description: dbEvent.description || '',
              fromDate: dbEvent.from_date || '',
              toDate: dbEvent.to_date || '',
              location: dbEvent.location || '',
              country: dbEvent.country || '',
              organizer: dbEvent.organizer || '',
              fromAge: dbEvent.from_age || undefined,
              toAge: dbEvent.to_age || undefined,
              youtubeLink: dbEvent.youtube_link || undefined,
              links: dbEvent.links || [],
              type: dbEvent.type || '',
              fields: dbEvent.fields || [],
              status: (dbEvent.status || 'published') as EventStatus,
              createdAt: dbEvent.created_at || new Date().toISOString(),
              updatedAt: dbEvent.updated_at || new Date().toISOString()
            }

            if (change.type === 'added') {
              onEventUpdate(event, 'INSERT')
            } else if (change.type === 'modified') {
              onEventUpdate(event, 'UPDATE')
            } else if (change.type === 'removed') {
              onEventUpdate(event, 'DELETE')
            }
          })
        })
      } catch (error) {
        console.error('Failed to setup real-time subscription:', error)
      }
    }

    setupRealtimeSubscription()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [enabled, onEventUpdate])
}
