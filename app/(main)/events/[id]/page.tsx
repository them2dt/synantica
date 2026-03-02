'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/layout/footer'
import { NavigationSpacer } from '@/components/layout/navigation-spacer'
import { ThemedText } from '@/components/ui/themed-text'
import { useEvent } from '@/lib/hooks/use-events'
import { EventHeader } from '@/components/events/event-header'
import { EventDetailsSection } from '@/components/events/event-details-section'
import { EventVideoSection } from '@/components/events/event-video-section'
import { EventResourcesSection } from '@/components/events/event-resources-section'
import { EventFieldsSection } from '@/components/events/event-fields-section'
import { EventActionsSection } from '@/components/events/event-actions-section'

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

          <Card className="mb-8 p-6">
            <EventHeader event={event} />
            <EventDetailsSection event={event} />
          </Card>

          <EventVideoSection videoLink={event.youtubeLink || ''} eventName={event.name} />
          <EventResourcesSection links={event.links} />
          <EventFieldsSection fields={event.fields} />
          <EventActionsSection event={event} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
