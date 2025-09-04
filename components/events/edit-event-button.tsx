'use client'

import { Button } from '@/components/ui/button'
import { usePermission } from '@/lib/auth/user-context'
import Link from 'next/link'

/**
 * Props for the edit event button component
 */
interface EditEventButtonProps {
  eventId: string
  className?: string
}

/**
 * Edit event button component
 * Only shows for users with edit permissions
 */
export function EditEventButton({ eventId, className }: EditEventButtonProps) {
  const canEditEvents = usePermission('canEditEvents')

  if (!canEditEvents) {
    return null
  }

  return (
    <Button variant="outline" size="lg" className={className} asChild>
      <Link href={`/events/${eventId}/edit`}>
        Edit Event
      </Link>
    </Button>
  )
}
