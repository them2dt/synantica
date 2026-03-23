'use client'

import { Calendar, MapPin } from 'lucide-react'
import { Event, EventDirectory } from '@/types/event'
import { formatEventDate, getRelativeDateLabel } from '@/lib/utils/date-formatting'
import { EventCardSkeleton } from '@/components/ui/loading'
import { getCountryFlag, getCountryDisplayName } from '@/lib/utils/country-flags'
import { ThemedText } from '@/components/ui/themed-text'

interface EventCardProps {
  event?: Event | EventDirectory
  onLearnMore: (event: Event | EventDirectory) => void
  variant?: 'grid' | 'list'
  loading?: boolean
}

function RelativeDateBadge({ fromDate, toDate }: { fromDate: string; toDate?: string }) {
  const { label, status } = getRelativeDateLabel(fromDate, toDate)
  if (!label) return null

  const styles: Record<string, string> = {
    past: 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500',
    ongoing: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
    'upcoming-soon': 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
    upcoming: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    future: '',
  }

  return (
    <span className={`text-xs px-2 py-0.5 font-medium ${styles[status]}`}>
      {label}
    </span>
  )
}

export function EventCard({ event, onLearnMore, variant = 'grid', loading = false }: EventCardProps) {
  if (loading || !event) {
    return <EventCardSkeleton />
  }

  const { status: dateStatus } = getRelativeDateLabel(event.fromDate, event.toDate)
  const isPast = dateStatus === 'past'

  if (variant === 'list') {
    return (
      <div
        className={`flex flex-col md:flex-row hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-200 dark:border-slate-800 last:border-b-0 ${isPast ? 'opacity-50' : ''}`}
        onClick={() => onLearnMore(event)}
      >
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <ThemedText variant="xs" color="muted" className="uppercase tracking-wide">{event.type}</ThemedText>
                {event.fromAge && event.toAge && (
                  <>
                    <ThemedText variant="xs" color="muted">•</ThemedText>
                    <ThemedText variant="xs" color="muted">Age {event.fromAge}–{event.toAge}</ThemedText>
                  </>
                )}
                <RelativeDateBadge fromDate={event.fromDate} toDate={event.toDate} />
              </div>
              <div className="text-xl shrink-0" title={getCountryDisplayName(event.country)}>
                {getCountryFlag(event.country)}
              </div>
            </div>

            <ThemedText variant="xl" className="mb-2 font-medium block">{event.name}</ThemedText>
            <ThemedText variant="sm" color="secondary" className="line-clamp-2 md:line-clamp-none mb-4 max-w-4xl block">
              {event.description}
            </ThemedText>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <ThemedText variant="sm" color="muted">
                  {formatEventDate(event.fromDate)} – {formatEventDate(event.toDate)}
                </ThemedText>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <ThemedText variant="sm" color="muted">{event.location}</ThemedText>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {event.fields.slice(0, 3).map((field) => (
                <ThemedText key={field} variant="xs" color="secondary" className="bg-slate-100 dark:bg-slate-800 px-2 py-1">
                  {field}
                </ThemedText>
              ))}
              {event.fields.length > 3 && (
                <ThemedText variant="xs" color="secondary" className="bg-slate-100 dark:bg-slate-800 px-2 py-1">
                  +{event.fields.length - 3}
                </ThemedText>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid variant
  return (
    <div
      className={`flex flex-col h-full bg-slate-50 dark:bg-slate-900 p-6 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${isPast ? 'opacity-50' : ''}`}
      onClick={() => onLearnMore(event)}
    >
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 uppercase tracking-wide flex-wrap">
            <ThemedText variant="xs" color="muted">{event.type}</ThemedText>
            {event.fromAge && event.toAge && (
              <>
                <ThemedText variant="xs" color="muted">•</ThemedText>
                <ThemedText variant="xs" color="muted">Age {event.fromAge}–{event.toAge}</ThemedText>
              </>
            )}
          </div>
          <RelativeDateBadge fromDate={event.fromDate} toDate={event.toDate} />
        </div>
        <div className="text-xl shrink-0" title={getCountryDisplayName(event.country)}>
          {getCountryFlag(event.country)}
        </div>
      </div>

      <ThemedText variant="xl" className="mb-2 font-medium block">{event.name}</ThemedText>
      <ThemedText variant="sm" color="secondary" className="line-clamp-2 mb-6 flex-grow block">
        {event.description}
      </ThemedText>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <ThemedText variant="sm" color="muted">
            {formatEventDate(event.fromDate)} – {formatEventDate(event.toDate)}
          </ThemedText>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <ThemedText variant="sm" color="muted">{event.location}</ThemedText>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        {event.fields.slice(0, 3).map((field) => (
          <ThemedText key={field} variant="xs" color="secondary" className="bg-slate-100 dark:bg-slate-800 px-2 py-1">
            {field}
          </ThemedText>
        ))}
        {event.fields.length > 3 && (
          <ThemedText variant="xs" color="secondary" className="bg-slate-100 dark:bg-slate-800 px-2 py-1">
            +{event.fields.length - 3}
          </ThemedText>
        )}
      </div>
    </div>
  )
}
