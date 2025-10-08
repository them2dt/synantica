'use client'

import { Calendar, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Event, EventDirectory } from '@/types/event'
import { formatEventDate } from '@/lib/utils/date-formatting'
import { EventCardSkeleton } from '@/components/ui/loading'
import { getCountryFlag, getCountryDisplayName } from '@/lib/utils/country-flags'
import { motion } from 'framer-motion'

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
      <motion.div whileHover={{ y: -4 }} className="h-full" transition={{ duration: 0.2 }}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="flex">
            {/* Content Section */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      className="capitalize text-xs"
                      variant="default"
                      style={{ backgroundColor: '#FF327D', color: 'white' }}
                    >
                      {event.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-muted-foreground/30 text-muted-foreground"
                    >
                      Age: {event.fromAge || 0}-{event.toAge || 99}
                    </Badge>
                  </div>
                  <div className="text-2xl" title={getCountryDisplayName(event.country)}>
                    {getCountryFlag(event.country)}
                  </div>
                </div>
                <CardTitle className="text-lg text-balance text-primary mb-2">{event.name}</CardTitle>
                <CardDescription className="text-pretty text-sm mb-3 line-clamp-2">{event.description}</CardDescription>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-accent" />
                    {formatEventDate(event.fromDate)} - {formatEventDate(event.toDate)}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-accent" />
                    {event.location}
                  </div>


                  <div className="flex flex-wrap gap-1">
                    {event.fields.slice(0, 3).map((field) => (
                      <Badge key={field} variant="outline" className="text-xs border-accent">
                        {field}
                      </Badge>
                    ))}
                    {event.fields.length > 3 && (
                      <Badge variant="outline" className="text-xs border-accent">
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
                  className="w-fit touch-manipulation"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  // Grid variant (default)
  return (
    <motion.div whileHover={{ y: -4 }} className="h-full" transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <Badge
                  className="capitalize"
                  variant="default"
                  style={{ backgroundColor: '#FF327D', color: 'white' }}
                >
                  {event.type}
                </Badge>
              <Badge
                variant="outline"
                className="text-xs border-muted-foreground/30 text-muted-foreground"
              >
                Age: {event.fromAge || 0}-{event.toAge || 99}
              </Badge>
            </div>
            <div className="text-2xl" title={getCountryDisplayName(event.country)}>
              {getCountryFlag(event.country)}
            </div>
          </div>
          <CardTitle className="text-lg text-balance text-primary">{event.name}</CardTitle>
          <CardDescription className="text-pretty">{event.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 flex-grow">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-accent" />
            {formatEventDate(event.fromDate)} - {formatEventDate(event.toDate)}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-accent" />
            {event.location}
          </div>


          <div className="flex flex-wrap gap-1">
            {event.fields.map((field) => (
              <Badge key={field} variant="outline" className="text-xs border-accent">
                {field}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="pt-0 mt-auto">
          <Button 
            className="w-full touch-manipulation" 
            size="sm" 
            onClick={() => onLearnMore(event)}
          >
            Learn More
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
