'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Users, TrendingUp, BookOpen, Briefcase } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { EventsGrid, Event } from '@/components/dashboard/events-grid'

// Mock data - all events use the same data for testing routing
const MOCK_EVENT: Event = {
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
  tags: ['Tech', 'Coding', 'Innovation']
}

// Generate multiple events with the same data but different IDs for testing
const MOCK_EVENTS: Event[] = Array.from({ length: 6 }, (_, index) => ({
  ...MOCK_EVENT,
  id: (index + 1).toString(),
  // Add slight variations to make them look different
  attendees: MOCK_EVENT.attendees + (index * 10),
  maxAttendees: MOCK_EVENT.maxAttendees + (index * 5),
}))

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
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDate, setSelectedDate] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [isListView, setIsListView] = useState(false)
  const [sortBy, setSortBy] = useState('date-asc')

  // Filter events based on search term and category
  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Sort events based on selected sort option
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'title-asc':
        return a.title.localeCompare(b.title)
      case 'title-desc':
        return b.title.localeCompare(a.title)
      case 'attendees-desc':
        return b.attendees - a.attendees
      case 'attendees-asc':
        return a.attendees - b.attendees
      default:
        return 0
    }
  })

  // Calculate statistics
  const totalAttendees = MOCK_EVENTS.reduce((sum, event) => sum + event.attendees, 0)

  const handleEventClick = (event: Event) => {
    // Navigate to the event detail page
    router.push(`/events/${event.id}`)
  }

  return (
    <DashboardLayout
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      categories={EVENT_CATEGORIES}
      totalAttendees={totalAttendees}
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
      selectedSubject={selectedSubject}
      onSubjectChange={setSelectedSubject}
      isListView={isListView}
      onViewChange={setIsListView}
      sortBy={sortBy}
      onSortChange={setSortBy}
    >
      <EventsGrid
        events={sortedEvents}
        selectedCategory={selectedCategory}
        categories={EVENT_CATEGORIES}
        onEventClick={handleEventClick}
      />
    </DashboardLayout>
  )
}
