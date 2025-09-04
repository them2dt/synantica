'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Download, ExternalLink, Share2, Mail } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/layout/footer';
import { Event, EventStatus } from '@/types/event';

/**
 * Example event detail page demonstrating dynamic OG image generation
 * This shows how to create event-specific social preview images
 */

// Mock event data - in a real app, this would come from your database
const MOCK_EVENT: Event = {
  id: '1',
  title: 'HackTech 2024',
  description: 'Join us for 48 hours of coding, innovation, and prizes! Build the next big thing with fellow developers and win amazing rewards.',
  category: 'hackathon',
  subject: 'Computer Science',
  date: '2024-03-15',
  time: '18:00',
  location: 'Computer Science Building, Room 101',
  tags: ['Tech', 'Coding', 'Innovation'],
  organizer: 'Tech Society',
  requirements: ['Laptop', 'Basic programming knowledge'],
  prizes: ['$5,000 First Place', '$3,000 Second Place', '$2,000 Third Place'],
  // Resources and links
  supportPdfs: [
    { name: 'Event Guidelines', url: 'https://drive.google.com/file/guidelines.pdf' },
    { name: 'Preparation Checklist', url: 'https://drive.google.com/file/checklist.pdf' }
  ],
  organizationHomepage: 'https://techsociety.edu',
  youtubeVideos: ['https://youtube.com/watch?v=previous-hackathon'],
  registrationUrl: 'https://eventbrite.com/hacktech-2024',
  alumniContactEmail: 'visioncatalyzer@gmail.com',
  // Required properties from Event interface
  status: EventStatus.PUBLISHED,
  registrationRequired: true,
  isFree: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};


/**
 * Event detail page component
 * Displays comprehensive information about a specific event
 */
export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Note: params.id would be used for dynamic event fetching in a real implementation
  // In a real app, you would fetch the event data based on params.id
  // const { id } = await params;
  // const event = await fetchEvent(id);
  // For now, we'll use mock data but log the ID for reference
  const event = MOCK_EVENT; // Replace with actual data fetching
  
  // Suppress unused parameter warning for now
  void params;

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
              <Badge variant="default" className="capitalize">
                {event.category}
              </Badge>
            </div>
            
            <CardTitle className="text-4xl mb-4">
              {event.title}
            </CardTitle>
            
            <CardDescription className="text-xl">
              {event.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {event.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {event.time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Organized by {event.organizer}
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Resources */}
        {(event.supportPdfs && event.supportPdfs.length > 0) || event.organizationHomepage || event.youtubeVideos ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Support PDFs */}
                {event.supportPdfs && event.supportPdfs.map((pdf, index) => (
                  <a
                    key={index}
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Download className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{pdf.name}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
                  </a>
                ))}
                
                {/* Organization Homepage */}
                {event.organizationHomepage && (
                  <a
                    href={event.organizationHomepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Organization Homepage</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
                  </a>
                )}
                
                {/* YouTube Videos */}
                {event.youtubeVideos && event.youtubeVideos.map((video, index) => (
                  <a
                    key={index}
                    href={video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
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
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ask Alumni Section */}
        {event.alumniContactEmail && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Ask Alumni
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Want to ask our alumni about their experience and tips to succeed? Send us your questions!
              </p>
              <a href={`mailto:${event.alumniContactEmail}?subject=Question about ${event.title}`}>
                <Button variant="outline" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Alumni
                </Button>
              </a>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="bg-muted/30 rounded-lg p-6 mb-8">
          <div className="flex justify-center gap-4">
            {event.registrationUrl ? (
              <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="px-8">
                  Register for Event
                </Button>
              </a>
            ) : (
              <Button size="lg" className="px-8">
                Register for Event
              </Button>
            )}
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
