import { Metadata } from 'next';
import { generateMetadataWithOG } from '@/lib/og-image';

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
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // In a real app, you would fetch the event data based on params.id
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
export default function EventDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the event data based on params.id
  const event = MOCK_EVENT; // Replace with actual data fetching

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {event.category}
              </span>
              <span className="text-sm text-gray-500">
                {event.attendees}/{event.maxAttendees} attendees
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {event.description}
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                📅 {event.date} at {event.time}
              </div>
              <div className="flex items-center">
                📍 {event.location}
              </div>
              <div className="flex items-center">
                👥 Organized by {event.organizer}
              </div>
            </div>
          </div>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Requirements */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
            <ul className="space-y-2">
              {event.requirements.map((req, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  ✓ {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Prizes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Prizes</h2>
            <ul className="space-y-2">
              {event.prizes.map((prize, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  🏆 {prize}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            Register for Event
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg transition-colors">
            Share Event
          </button>
        </div>
      </div>
    </div>
  );
}
