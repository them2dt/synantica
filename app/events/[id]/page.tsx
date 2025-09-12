'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Download, ExternalLink, Share2, Mail } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/layout/footer';
// Event type is used in the component logic
import { useEvent } from '@/lib/hooks/use-events';
import { useEffect, useState } from 'react';
import { EventWithDetails } from '@/lib/database/events-client';
import { formatEventDate } from '@/lib/utils/date-formatting';


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

  // Helper functions to safely access database fields
  const getSupportPdfs = () => {
    return (event as EventWithDetails)?.support_pdfs || []
  }

  const getYoutubeVideos = () => {
    return (event as EventWithDetails)?.youtube_videos || []
  }

  const getOrganizationHomepage = () => {
    return (event as EventWithDetails)?.organization_homepage
  }

  const getAlumniContactEmail = () => {
    return (event as EventWithDetails)?.alumni_contact_email
  }


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

        {/* Event Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge 
                variant="default" 
                className="capitalize"
                style={event.category === "hackathon" ? { backgroundColor: '#FF327D', color: 'white' } : {}}
              >
                {event.category}
              </Badge>
            </div>
            
            <CardTitle className="text-4xl mb-4 font-heading font-semibold">
              {event.title}
            </CardTitle>
            
            <CardDescription className="text-xl">
              {event.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                {formatEventDate(event.date)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                {event.time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                Organized by {event.organizer}
              </div>
              {event.minAge && event.maxAge && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  Ages {event.minAge}-{event.maxAge}
                </div>
              )}
            </div>
          </CardContent>
        </Card>


        {/* Resources */}
        {getSupportPdfs().length > 0 || getOrganizationHomepage() || getYoutubeVideos().length > 0 ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-accent" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Support PDFs */}
                {getSupportPdfs().map((pdf: { name: string; url: string }, index: number) => (
                  <a
                    key={index}
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Download className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">{pdf.name}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
                  </a>
                ))}
                
                {/* Organization Homepage */}
                {getOrganizationHomepage() && (
                  <a
                    href={getOrganizationHomepage()!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">Organization Homepage</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
                  </a>
                )}
                
                {/* YouTube Videos */}
                {getYoutubeVideos().map((video: string, index: number) => (
                  <a
                    key={index}
                    href={video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">YouTube Video {index + 1}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Tags */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="border-accent">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ask Alumni Section */}
        {getAlumniContactEmail() && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-accent" />
                Ask Alumni
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Want to ask our alumni about their experience and tips to succeed? Send us your questions!
              </p>
              <a href={`mailto:${getAlumniContactEmail()}?subject=Question about ${event.title}`}>
                <Button variant="outline" className="gap-2">
                  <Mail className="w-4 h-4 text-accent" />
                  Contact Alumni
                </Button>
              </a>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="bg-muted/30 rounded-lg p-6 mb-8">
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" className="px-8" onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: event.title,
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
          </div>
        </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
