import { Metadata } from 'next';
import { generateMetadataWithOG } from '@/lib/og-image';
import { RegistrationForm } from '@/components/events/registration-form';

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
 * Generate dynamic metadata for the registration page
 */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // In a real app, you would fetch the event data based on the id
  // const event = await fetchEvent(id);
  console.log('Generating metadata for registration page, event ID:', id);
  const event = MOCK_EVENT; // Replace with actual data fetching
  
  return generateMetadataWithOG(
    `Register for ${event.title} - Synantica`,
    `Register for ${event.title} and join ${event.attendees} other attendees for an amazing experience.`,
    'default'
  );
}

/**
 * Event registration page
 * Allows users to register for events with comprehensive form
 */
export default async function EventRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // In a real app, you would fetch the event data based on the id
  // const event = await fetchEvent(id);
  console.log('Loading registration page for event ID:', id);
  const event = MOCK_EVENT; // Replace with actual data fetching
  
  // TODO: Add authorization check - user must be logged in
  // TODO: Check if user is already registered for this event
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <RegistrationForm event={event} />
      </div>
    </div>
  );
}
