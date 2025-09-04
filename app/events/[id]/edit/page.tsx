import { Metadata } from 'next';
import { generateMetadataWithOG } from '@/lib/og-image';
import { EditEventForm } from '@/components/events/edit-event-form';

/**
 * Mock event data - in a real app, this would come from your database
 */
const MOCK_EVENT = {
  id: '1',
  title: 'HackTech 2024',
  description: 'Join us for 48 hours of coding, innovation, and prizes! Build the next big thing with fellow developers and win amazing rewards.',
  category: 'hackathon',
  date: '2024-03-15',
  time: '18:00',
  location: 'Computer Science Building',
  attendees: 150,
  maxAttendees: 200,
  image: '/placeholder.svg',
  tags: ['Tech', 'Coding', 'Innovation'],
  requirements: ['Laptop', 'Basic programming knowledge'],
  prizes: ['$5,000 First Place', '$3,000 Second Place', '$2,000 Third Place'],
  organizer: 'Tech Society',
  status: 'active' as const,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z'
};

/**
 * Generate dynamic metadata for the edit event page
 */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // In a real app, you would fetch the event data based on the id
  // const event = await fetchEvent(id);
  console.log('Generating metadata for edit page, event ID:', id);
  const event = MOCK_EVENT; // Replace with actual data fetching
  
  return generateMetadataWithOG(
    `Edit ${event.title} - Synantica`,
    `Edit and manage your event: ${event.description}`,
    'default'
  );
}

/**
 * Edit event page
 * Allows event organizers to edit their events
 */
export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // In a real app, you would fetch the event data based on params.id
  // const event = await fetchEvent(id);
  const event = MOCK_EVENT; // Replace with actual data fetching
  
  // TODO: Add authorization check - only event organizer should be able to edit
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <EditEventForm eventId={id} initialEvent={event} />
      </div>
    </div>
  );
}
