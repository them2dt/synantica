import { Metadata } from 'next';
import { generateMetadataWithOG } from '@/lib/og-image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Trophy, CheckCircle } from 'lucide-react';
import Link from 'next/link';

/**
 * Example event detail page demonstrating dynamic OG image generation
 * This shows how to create event-specific social preview images
 */

// Mock event data - in a real app, this would come from your database
const MOCK_EVENT = {
  id: '1',
  title: 'HackTech 2024',
  description: 'Join us for 48 hours of coding, innovation, and prizes! Build the next big thing with fellow developers and win amazing rewards.',
  category: 'Hackathon',
  date: 'March 15, 2024',
  time: '6:00 PM',
  location: 'Computer Science Building, Room 101',
  attendees: 150,
  maxAttendees: 200,
  image: '/placeholder.svg',
  tags: ['Tech', 'Coding', 'Innovation'],
  organizer: 'Tech Society',
  requirements: ['Laptop', 'Basic programming knowledge'],
  prizes: ['$5,000 First Place', '$3,000 Second Place', '$2,000 Third Place']
};

/**
 * Generate dynamic metadata with event-specific OG image
 * This creates a custom social preview image for each event
 */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  // In a real app, you would fetch the event data based on params.id
  const { id } = await params;
  // const event = await fetchEvent(id);
  // For now, we'll use mock data but log the ID for reference
  console.log('Generating metadata for event ID:', id);
  const event = MOCK_EVENT; // Replace with actual data fetching
  
  return generateMetadataWithOG(
    event.title,
    event.description,
    'event',
    {
      eventDate: event.date,
      location: event.location,
      category: event.category,
    }
  );
}

/**
 * Event detail page component
 * Displays comprehensive information about a specific event
 */
export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // In a real app, you would fetch the event data based on params.id
  const { id } = await params;
  // const event = await fetchEvent(id);
  // For now, we'll use mock data but log the ID for reference
  console.log('Rendering event detail page for ID:', id);
  const event = MOCK_EVENT; // Replace with actual data fetching

  return (
    <div className="min-h-screen bg-background">
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
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                {event.attendees}/{event.maxAttendees} attendees
              </div>
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

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {event.requirements.map((req, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Prizes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Prizes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {event.prizes.map((prize, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    {prize}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Tags */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Event Tags</CardTitle>
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

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button size="lg" className="px-8" asChild>
            <Link href={`/events/${id}/register`}>
              Register for Event
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="px-8">
            Share Event
          </Button>
          {/* TODO: Only show edit button if user is the event organizer */}
          <Button variant="outline" size="lg" className="px-8" asChild>
            <Link href={`/events/${id}/edit`}>
              Edit Event
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
