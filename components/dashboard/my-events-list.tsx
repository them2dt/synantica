'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { EventWithDetails } from '@/lib/database/events-client'

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
    fetch('/api/events/mine')
      .then(async (res) => {
        if (res.status === 401) {
          setEvents([])
          return
        }
        if (!res.ok) throw new Error('Failed to fetch events')
        const data = await res.json()
        setEvents(data.events)
      })
      .catch(() => setError('Failed to load your events'))
      .finally(() => setLoading(false))
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
