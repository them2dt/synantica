'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Users, ExternalLink, Share2, Mail, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/layout/footer'
import { NavigationSpacer } from '@/components/layout/navigation-spacer'
import { ThemedText } from '@/components/ui/themed-text'
import { useEvent } from '@/lib/hooks/use-events'
import { formatEventDate } from '@/lib/utils/date-formatting'
import { getCountryFlag, getCountryDisplayName } from '@/lib/utils/country-flags'

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [eventId, setEventId] = useState<string>('')

  useEffect(() => {
    params.then(({ id }) => setEventId(id))
  }, [params])

  const { event, loading, error } = useEvent(eventId)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <div className="flex-1">
          <div className="mx-auto w-full max-w-[1100px] px-6 py-10">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-none h-8 w-8 border-b-2 border-slate-950 dark:border-slate-50 mx-auto mb-4" />
                <ThemedText color="muted">Loading event...</ThemedText>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <div className="flex-1">
          <div className="mx-auto w-full max-w-[1100px] px-6 py-10">
            <div className="mb-6">
              <Link href="/dashboard">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-600 text-5xl mb-4">⚠️</div>
                <ThemedText variant="h3" className="mb-2">Event Not Found</ThemedText>
                <ThemedText color="muted" className="mb-4 block">
                  {error || 'The event you are looking for does not exist or has been removed.'}
                </ThemedText>
                <Link href="/dashboard">
                  <Button>Return to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <div className="flex-1">
        <div className="mx-auto w-full max-w-[1100px] border-x border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-6 sm:py-10">
          <NavigationSpacer />
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-50 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          <Card className="mb-8">
            <CardHeader>
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
            <CardContent>
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
              </div>
            </CardContent>
          </Card>

          {event.youtubeLink && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-slate-500" />
                  Video
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(event.youtubeLink)}`}
                    title={`${event.name} - Video`}
                    className="w-full h-full rounded-none border border-slate-200 dark:border-slate-800"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {event.links && event.links.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-slate-500" />
                  Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-900/60 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-950 dark:text-slate-50">Resource {index + 1}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 ml-auto" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {event.fields.map((field, index) => (
                  <Badge key={index} variant="outline" className="text-slate-500">
                    {field}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="border border-slate-200 dark:border-slate-800 p-6 mb-8 bg-white dark:bg-slate-900">
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className="px-4 sm:px-8"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: event.name,
                      text: event.description,
                      url: window.location.href,
                    })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                  }
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Event
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-4 sm:px-8"
                onClick={() => {
                  window.location.href = `mailto:contact@visioncatalyzer.com?subject=Question about ${event.name}`
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Ask Questions
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
