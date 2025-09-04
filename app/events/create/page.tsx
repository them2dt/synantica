import { Metadata } from 'next';
import { generateMetadataWithOG } from '@/lib/og-image';
import { CreateEventForm } from '@/components/events/create-event-form';

/**
 * Metadata for the event creation page
 */
export const metadata: Metadata = generateMetadataWithOG(
  'Create Event - Synantica',
  'Create and organize events for students to discover and attend. Build your community and share your knowledge.'
);

/**
 * Event creation page
 * Allows users to create new events with comprehensive form validation
 */
export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <CreateEventForm />
      </div>
    </div>
  );
}
