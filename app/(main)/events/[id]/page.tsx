'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, Users, ExternalLink, Share2, Mail, Globe } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/layout/footer';
import { useEvent } from '@/lib/hooks/use-events';
import { useEffect, useState } from 'react';
import { formatEventDate } from '@/lib/utils/date-formatting';
import { getCountryFlag, getCountryDisplayName } from '@/lib/utils/country-flags';

/**
 * Event detail page component
 * Displays comprehensive information about a specific event
 */
export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [eventId, setEventId] = useState<string>('')
  
  // Get event ID from params
  useEffect(() => {
    params.then(({ id }) => setEventId(id))
  }, [params])
  
  // Fetch event data from database
  const { event, loading, error } = useEvent(eventId)

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading event...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Show error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
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
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Not Found</h3>
                <p className="text-gray-600 mb-4">
                  {error || 'The event you are looking for does not exist or has been removed.'}
                </p>
                <Link href="/dashboard">
                  <Button variant="outline">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="default" 
                    className="capitalize"
                    style={{ backgroundColor: '#FF327D', color: 'white' }}
                  >
                    {event.type}
                  </Badge>
                  <div className="text-2xl" title={getCountryDisplayName(event.country)}>
                    {getCountryFlag(event.country)}
                  </div>
                </div>
              </div>
              
              <CardTitle className="text-4xl mb-4 font-heading font-semibold">
                {event.name}
              </CardTitle>
              
              <CardDescription className="text-xl">
                {event.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  {formatEventDate(event.fromDate)} - {formatEventDate(event.toDate)}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  Organized by {event.organizer}
                </div>
                {event.fromAge && event.toAge && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    Ages {event.fromAge}-{event.toAge}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* YouTube Video Frame */}
          {event.youtubeLink && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-accent" />
                  Video
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(event.youtubeLink)}`}
                    title={`${event.name} - Video`}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resources */}
          {event.links && event.links.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-accent" />
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
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium">Resource {index + 1}</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags/Fields */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {event.fields.map((field, index) => (
                  <Badge key={index} variant="outline" className="border-accent">
                    {field}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Button Row */}
          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="lg" className="px-8" onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: event.name,
                    text: event.description,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Event
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8"
                onClick={() => {
                  window.location.href = `mailto:contact@visioncatalyzer.com?subject=Question about ${event.name}`;
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Ask Questions
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}