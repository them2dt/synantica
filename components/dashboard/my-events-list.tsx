'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemedText } from '@/components/ui/themed-text'
import { EmptyState } from '@/components/ui/empty-state'
import { useMyEvents } from '@/lib/hooks/use-events'
import { deleteEventClient } from '@/lib/database/events-client'

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  published: { label: 'Published', className: 'bg-green-100 text-green-800' },
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
}

export function MyEventsList() {
  const router = useRouter()
  const { events, loading, error, refetch } = useMyEvents()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleDelete = async (eventId: string) => {
    setDeletingId(eventId)
    try {
      await deleteEventClient(eventId)
      refetch()
    } catch (err) {
      console.error('Failed to delete event:', err)
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

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
      <EmptyState
        icon={Users}
        title="No events submitted"
        description="You haven't submitted any events yet. Click the '+' button to share an event with the community."
      />
    )
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {events.map((event) => {
        const badge = STATUS_BADGE[event.status] ?? { label: event.status, className: 'bg-slate-100 text-slate-700' }
        return (
          <div
            key={event.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900/50"
          >
            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => router.push(`/events/${event.id}`)}
            >
              <ThemedText variant="base" className="font-medium block">{event.name}</ThemedText>
              <ThemedText variant="sm" color="muted" className="block">
                {event.type} &middot; {event.fromDate}{event.toDate && event.toDate !== event.fromDate ? ` – ${event.toDate}` : ''}
              </ThemedText>
            </div>
            <div className="flex items-center gap-2">
              <ThemedText variant="xs" color="white" className={`font-medium px-2 py-1 rounded-full ${badge.className}`}>
                {badge.label}
              </ThemedText>
              {confirmDeleteId === event.id ? (
                <div className="flex items-center gap-1">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === event.id}
                    onClick={() => handleDelete(event.id)}
                  >
                    {deletingId === event.id ? 'Deleting...' : 'Confirm'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDeleteId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-red-600"
                  onClick={() => setConfirmDeleteId(event.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
