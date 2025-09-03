'use client'

import { useState } from 'react'
import { Calendar, Users, TrendingUp, BookOpen, Briefcase } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { EventsGrid, Event } from '@/components/dashboard/events-grid'

// Mock data - in a real app, this would come from an API
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'HackTech 2024',
    description: 'Join us for 48 hours of coding, innovation, and prizes! Build the next big thing.',
    category: 'hackathon',
    date: '2024-03-15',
    time: '18:00',
    location: 'Computer Science Building',
    attendees: 150,
    maxAttendees: 200,
    image: '/placeholder.svg',
    tags: ['Tech', 'Coding', 'Innovation']
  },
  {
    id: '2',
    title: 'Coffee & Code Meetup',
    description: 'Casual networking event for CS students. Bring your projects and meet fellow developers!',
    category: 'social',
    date: '2024-03-08',
    time: '15:00',
    location: 'Student Union Café',
    attendees: 45,
    maxAttendees: 60,
    image: '/placeholder.svg',
    tags: ['Networking', 'Casual', 'Coffee']
  },
  {
    id: '3',
    title: 'Game Dev Workshop',
    description: 'Learn Unity basics and create your first 2D game in this hands-on workshop.',
    category: 'workshop',
    date: '2024-03-12',
    time: '14:00',
    location: 'Media Lab Room 101',
    attendees: 28,
    maxAttendees: 30,
    image: '/placeholder.svg',
    tags: ['Gaming', 'Unity', 'Workshop']
  },
  {
    id: '4',
    title: 'Startup Pitch Competition',
    description: 'Present your startup idea to industry experts and win funding for your venture.',
    category: 'career',
    date: '2024-03-20',
    time: '10:00',
    location: 'Business School Auditorium',
    attendees: 75,
    maxAttendees: 100,
    image: '/placeholder.svg',
    tags: ['Entrepreneurship', 'Pitching', 'Funding']
  },
  {
    id: '5',
    title: 'Study Group: Algorithms',
    description: 'Collaborative study session for CS algorithms course. Bring your questions!',
    category: 'academic',
    date: '2024-03-10',
    time: '19:00',
    location: 'Library Study Room 3',
    attendees: 12,
    maxAttendees: 15,
    image: '/placeholder.svg',
    tags: ['Study', 'Algorithms', 'CS']
  },
  {
    id: '6',
    title: 'Wellness Fair',
    description: 'Learn about mental health resources and wellness practices for students.',
    category: 'wellness',
    date: '2024-03-18',
    time: '12:00',
    location: 'Student Center Plaza',
    attendees: 200,
    maxAttendees: 300,
    image: '/placeholder.svg',
    tags: ['Wellness', 'Mental Health', 'Resources']
  }
]

const EVENT_CATEGORIES = [
  { value: 'all', label: 'All Events', icon: Calendar },
  { value: 'hackathon', label: 'Hackathons', icon: TrendingUp },
  { value: 'workshop', label: 'Workshops', icon: BookOpen },
  { value: 'social', label: 'Social Events', icon: Users },
  { value: 'career', label: 'Career Fairs', icon: Briefcase },
  { value: 'academic', label: 'Academic', icon: BookOpen },
  { value: 'wellness', label: 'Wellness', icon: Users }
]

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [, setSelectedEvent] = useState<Event | null>(null)

  // Filter events based on search term and category
  const filteredEvents = MOCK_EVENTS.filter(event => {
                    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                     event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                     event.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Calculate statistics
  const totalEvents = MOCK_EVENTS.length
  const thisWeekEvents = MOCK_EVENTS.filter(event => {
    const eventDate = new Date(event.date)
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return eventDate >= now && eventDate <= weekFromNow
  }).length
  
  const totalAttendees = MOCK_EVENTS.reduce((sum, event) => sum + event.attendees, 0)

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    // In a real app, this would open a modal or navigate to event details
    console.log('Event clicked:', event)
  }

  return (
    <DashboardLayout
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      categories={EVENT_CATEGORIES}
      totalEvents={totalEvents}
      thisWeekEvents={thisWeekEvents}
      totalAttendees={totalAttendees}
    >
      <EventsGrid
        events={filteredEvents}
        selectedCategory={selectedCategory}
        categories={EVENT_CATEGORIES}
        onEventClick={handleEventClick}
      />
    </DashboardLayout>
  )
}
