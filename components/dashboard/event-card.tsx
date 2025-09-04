'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import Image from 'next/image'

/**
 * Event data interface
 */
export interface Event {
  id: string
  title: string
  description: string
  category: string
  date: string
  time: string
  location: string
  attendees: number
  maxAttendees: number
  image?: string
  tags: string[]
}

/**
 * Props for the event card component
 */
interface EventCardProps {
  event: Event
  onLearnMore: (event: Event) => void
  variant?: 'grid' | 'list'
}

/**
 * Event card component displaying event information
 */
export function EventCard({ event, onLearnMore, variant = 'grid' }: EventCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const attendancePercentage = (event.attendees / event.maxAttendees) * 100

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  if (variant === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex">
          {/* Image Section */}
          <div className="w-48 h-32 relative overflow-hidden bg-muted flex-shrink-0">
            {!imageError && event.image ? (
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            ) : (
              <ImagePlaceholder 
                text="Event Image" 
                size="md"
              />
            )}
            
            {imageLoading && !imageError && (
              <div className="absolute inset-0">
                <ImagePlaceholder 
                  text="Loading..." 
                  size="md"
                  loading={true}
                />
              </div>
            )}
            
            <Badge
              className="absolute top-2 left-2 capitalize text-xs"
              variant={event.category === "hackathon" ? "default" : "secondary"}
            >
              {event.category}
            </Badge>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <CardTitle className="text-lg text-balance text-primary mb-2">{event.title}</CardTitle>
              <CardDescription className="text-pretty text-sm mb-3 line-clamp-2">{event.description}</CardDescription>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {formatDate(event.date)}
                  <Clock className="w-4 h-4 ml-2" />
                  {event.time}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {event.attendees}/{event.maxAttendees} attending
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-2 ml-2 max-w-20">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${attendancePercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {event.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {event.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{event.tags.length - 3}
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
    )
  }

  // Grid variant (default)
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden bg-muted">
        {!imageError && event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <ImagePlaceholder 
            text="Event Image" 
            size="lg"
          />
        )}
        
        {imageLoading && !imageError && (
          <div className="absolute inset-0">
            <ImagePlaceholder 
              text="Loading..." 
              size="lg"
              loading={true}
            />
          </div>
        )}
        
        <Badge
          className="absolute top-3 left-3 capitalize"
          variant={event.category === "hackathon" ? "default" : "secondary"}
        >
          {event.category}
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="text-lg text-balance text-primary">{event.title}</CardTitle>
        <CardDescription className="text-pretty">{event.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {formatDate(event.date)}
          <Clock className="w-4 h-4 ml-2" />
          {event.time}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          {event.location}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>
            {event.attendees}/{event.maxAttendees} attending
          </span>
          <div className="flex-1 bg-muted rounded-full h-2 ml-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {event.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          className="w-full" 
          size="sm" 
          onClick={() => onLearnMore(event)}
        >
          Learn More
        </Button>
      </CardFooter>
    </Card>
  )
}
