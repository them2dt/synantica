'use client'

import { useState, useEffect, useCallback } from 'react'
import { getEventsClient, getEventByIdClient, getPopularEventsClient, getEventsDirectory, EventFilters, EventWithDetails } from '@/lib/database/events-client'
import { EventDirectory } from '@/types/event'
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
