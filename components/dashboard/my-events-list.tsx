'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { EventWithDetails } from '@/lib/database/events-client'
import { auth, db } from '@/lib/firebase/client'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { mapEventRowToEventWithDetails, mapFirestoreDataToEventRow } from '@/lib/database/events-mappers'

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending_review: { label: 'Pending Review', className: 'bg-yellow-100 text-yellow-800' },
  published: { label: 'Published', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
}

export function MyEventsList() {
  const router = useRouter()
  const [events, setEvents] = useState<EventWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!mounted) return
      setLoading(true)
      setError(null)

      if (!user) {
        setEvents([])
        setLoading(false)
        return
      }

      try {
        const eventsQuery = query(
          collection(db, 'events'),
          where('submitted_by', '==', user.uid),
          orderBy('created_at', 'desc')
        )
        const snapshot = await getDocs(eventsQuery)
        const mapped = snapshot.docs.map((doc) => {
          const row = mapFirestoreDataToEventRow(doc.id, doc.data() as Record<string, unknown>)
          return mapEventRowToEventWithDetails(row)
        })
        if (mounted) setEvents(mapped)
      } catch {
        if (mounted) setError('Failed to load your events')
      } finally {
        if (mounted) setLoading(false)
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse h-16 bg-slate-100 rounded" />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="p-4 text-red-600">{error}</p>
  }

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-500">
        You haven&apos;t submitted any events yet.
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {events.map((event) => {
        const badge = STATUS_BADGE[event.status] ?? { label: event.status, className: 'bg-slate-100 text-slate-700' }
        return (
          <div
            key={event.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 cursor-pointer"
            onClick={() => router.push(`/events/${event.id}`)}
          >
            <div>
              <p className="font-medium text-slate-900">{event.name}</p>
              <p className="text-sm text-slate-500">
                {event.type} &middot; {event.fromDate}{event.toDate && event.toDate !== event.fromDate ? ` – ${event.toDate}` : ''}
              </p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${badge.className}`}>
              {badge.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
