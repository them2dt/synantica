'use client'

import { Calendar, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Event, EventDirectory } from '@/types/event'
import { formatEventDate } from '@/lib/utils/date-formatting'
import { EventCardSkeleton } from '@/components/ui/loading'
import { getCountryFlag, getCountryDisplayName } from '@/lib/utils/country-flags'

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
      <div className="h-full">
        <Card className="overflow-hidden border-slate-200 bg-white">
          <div className="flex">
            {/* Content Section */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      className="capitalize"
                      variant="default"
                    >
                      {event.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-slate-500"
                    >
                      Age: {event.fromAge || 0}-{event.toAge || 99}
                    </Badge>
                  </div>
                  <div className="text-2xl" title={getCountryDisplayName(event.country)}>
                    {getCountryFlag(event.country)}
                  </div>
                </div>
                <CardTitle className="text-lg text-balance text-slate-950 mb-2">{event.name}</CardTitle>
                <CardDescription className="text-pretty text-sm mb-3 line-clamp-2">{event.description}</CardDescription>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {formatEventDate(event.fromDate)} - {formatEventDate(event.toDate)}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    {event.location}
                  </div>


                  <div className="flex flex-wrap gap-1">
                    {event.fields.slice(0, 3).map((field) => (
                      <Badge key={field} variant="outline" className="text-slate-500">
                        {field}
                      </Badge>
                    ))}
                    {event.fields.length > 3 && (
                      <Badge variant="outline" className="text-slate-500">
                        +{event.fields.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  size="sm"
                  onClick={() => onLearnMore(event)}
                  className="w-fit"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Grid variant (default)
  return (
    <div className="h-full">
      <Card className="overflow-hidden flex flex-col h-full border-slate-200 bg-white">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge
                className="capitalize"
                variant="default"
              >
                {event.type}
              </Badge>
              <Badge
                variant="outline"
                className="text-slate-500"
              >
                Age: {event.fromAge || 0}-{event.toAge || 99}
              </Badge>
            </div>
            <div className="text-2xl" title={getCountryDisplayName(event.country)}>
              {getCountryFlag(event.country)}
            </div>
          </div>
          <CardTitle className="text-lg text-balance text-slate-950">{event.name}</CardTitle>
          <CardDescription className="text-pretty">{event.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 flex-grow">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4 text-slate-500" />
            {formatEventDate(event.fromDate)} - {formatEventDate(event.toDate)}
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="w-4 h-4 text-slate-500" />
            {event.location}
          </div>


          <div className="flex flex-wrap gap-1">
            {event.fields.map((field) => (
              <Badge key={field} variant="outline" className="text-slate-500">
                {field}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="pt-0 mt-auto">
          <Button
            className="w-full"
            size="sm"
            onClick={() => onLearnMore(event)}
          >
            Learn More
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
