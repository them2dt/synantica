'use client'

import { Calendar, MapPin, Users, Globe } from 'lucide-react'
import { CardContent } from '@/components/ui/card'
import { formatEventDate } from '@/lib/utils/date-formatting'
import { Event } from '@/types/event'
import type { EventWithDetails } from '@/lib/database/events-client'

export function EventDetailsSection({ event }: { event: Event | EventWithDetails }) {
    const homepage = 'organization_homepage' in event ? event.organization_homepage : undefined

    return (
        <CardContent className="p-0">
            <div className="flex flex-wrap gap-3 sm:gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {formatEventDate(event.fromDate)} - {formatEventDate(event.toDate)}
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    {event.location}
                </div>
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    Organized by {event.organizer}
                </div>
                {event.fromAge && event.toAge && (
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        Ages {event.fromAge}-{event.toAge}
                    </div>
                )}
                {homepage && (
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-500" />
                        <a
                            href={homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-slate-950 dark:hover:text-slate-50 hover:underline transition-colors"
                        >
                            Official Website
                        </a>
                    </div>
                )}
            </div>
        </CardContent>
    )
}
