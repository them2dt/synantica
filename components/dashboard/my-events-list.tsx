'use client'

import { useRouter } from 'next/navigation'
import { ThemedText } from '@/components/ui/themed-text'
import { useMyEvents } from '@/lib/hooks/use-events'

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending_review: { label: 'Pending Review', className: 'bg-yellow-100 text-yellow-800' },
  published: { label: 'Published', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
}

export function MyEventsList() {
  const router = useRouter()
  const { events, loading, error } = useMyEvents()

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
    return <ThemedText color="error" className="p-4 block">{error}</ThemedText>
  }

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-500">
        You haven&apos;t submitted any events yet.
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {events.map((event) => {
        const badge = STATUS_BADGE[event.status] ?? { label: event.status, className: 'bg-slate-100 text-slate-700' }
        return (
          <div
            key={event.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer"
            onClick={() => router.push(`/events/${event.id}`)}
          >
            <div className="flex-1 min-w-0">
              <ThemedText variant="base" className="font-medium block">{event.name}</ThemedText>
              <ThemedText variant="sm" color="muted" className="block">
                {event.type} &middot; {event.fromDate}{event.toDate && event.toDate !== event.fromDate ? ` – ${event.toDate}` : ''}
              </ThemedText>
            </div>
            <ThemedText variant="xs" color="white" className={`font-medium px-2 py-1 rounded-full ${badge.className}`}>
              {badge.label}
            </ThemedText>
          </div>
        )
      })}
    </div>
  )
}
