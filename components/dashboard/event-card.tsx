'use client'

import { Calendar, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Event, EventDirectory } from '@/types/event'
import { formatEventDate } from '@/lib/utils/date-formatting'
import { EventCardSkeleton } from '@/components/ui/loading'
import { getCountryFlag, getCountryDisplayName } from '@/lib/utils/country-flags'
import { ThemedText } from '@/components/ui/themed-text'

/**
 * Props for the event card component
 */
interface EventCardProps {
  event?: Event | EventDirectory
  onLearnMore: (event: Event | EventDirectory) => void
  variant?: 'grid' | 'list'
  loading?: boolean
}

/**
 * Event card component displaying event information
 */
export function EventCard({ event, onLearnMore, variant = 'grid', loading = false }: EventCardProps) {
  // Show skeleton when loading or no event data
  if (loading || !event) {
    return <EventCardSkeleton />
  }

  if (variant === 'list') {
    return (
      <div className="flex flex-col md:flex-row bg-white hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-200 last:border-b-0" onClick={() => onLearnMore(event)}>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-2 uppercase tracking-wide">
                <ThemedText variant="xs" color="muted">{event.type}</ThemedText>
                <ThemedText variant="xs" color="muted">•</ThemedText>
                <ThemedText variant="xs" color="muted">Age {event.fromAge || 0}-{event.toAge || 99}</ThemedText>
              </div>
              <div className="text-xl" title={getCountryDisplayName(event.country)}>
                {getCountryFlag(event.country)}
              </div>
            </div>

            <ThemedText variant="xl" className="mb-2 font-medium block">{event.name}</ThemedText>
            <ThemedText variant="sm" color="secondary" className="line-clamp-2 md:line-clamp-none mb-4 max-w-4xl block">
              {event.description}
            </ThemedText>

            <div className="flex flex-wrap md:flex-nowrap gap-x-6 gap-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <ThemedText variant="sm" color="muted">
                  {formatEventDate(event.fromDate)} - {formatEventDate(event.toDate)}
                </ThemedText>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <ThemedText variant="sm" color="muted">{event.location}</ThemedText>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {event.fields.slice(0, 3).map((field) => (
                <ThemedText key={field} variant="xs" color="secondary" className="bg-slate-100 px-2 py-1">
                  {field}
                </ThemedText>
              ))}
              {event.fields.length > 3 && (
                <ThemedText variant="xs" color="secondary" className="bg-slate-100 px-2 py-1">
                  +{event.fields.length - 3}
                </ThemedText>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid variant (default)
  return (
    <div className="flex flex-col h-full bg-white p-6 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onLearnMore(event)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 uppercase tracking-wide">
          <ThemedText variant="xs" color="muted">{event.type}</ThemedText>
          <ThemedText variant="xs" color="muted">•</ThemedText>
          <ThemedText variant="xs" color="muted">Age {event.fromAge || 0}-{event.toAge || 99}</ThemedText>
        </div>
        <div className="text-xl" title={getCountryDisplayName(event.country)}>
          {getCountryFlag(event.country)}
        </div>
      </div>

      <ThemedText variant="xl" className="mb-2 font-medium block">{event.name}</ThemedText>
      <ThemedText variant="sm" color="secondary" className="line-clamp-2 mb-6 flex-grow block">
        {event.description}
      </ThemedText>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <ThemedText variant="sm" color="muted">
            {formatEventDate(event.fromDate)} - {formatEventDate(event.toDate)}
          </ThemedText>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <ThemedText variant="sm" color="muted">{event.location}</ThemedText>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        {event.fields.slice(0, 3).map((field) => (
          <ThemedText key={field} variant="xs" color="secondary" className="bg-slate-100 px-2 py-1">
            {field}
          </ThemedText>
        ))}
        {event.fields.length > 3 && (
          <ThemedText variant="xs" color="secondary" className="bg-slate-100 px-2 py-1">
            +{event.fields.length - 3}
          </ThemedText>
        )}
      </div>
    </div>
  )
}
