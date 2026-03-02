'use client'

import { Badge } from '@/components/ui/badge'
import { CardHeader } from '@/components/ui/card'
import { ThemedText } from '@/components/ui/themed-text'
import { getCountryFlag, getCountryDisplayName } from '@/lib/utils/country-flags'
import { Event } from '@/types/event'

export function EventHeader({ event }: { event: Event }) {
    return (
        <CardHeader className="p-0 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Badge variant="default" className="capitalize">
                        {event.type}
                    </Badge>
                    <div className="text-2xl" title={getCountryDisplayName(event.country)}>
                        {getCountryFlag(event.country)}
                    </div>
                </div>
            </div>
            <ThemedText variant="h2" className="mb-4">{event.name}</ThemedText>
            <ThemedText variant="lg" color="secondary">
                {event.description}
            </ThemedText>
        </CardHeader>
    )
}
