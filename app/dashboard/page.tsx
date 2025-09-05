'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Users, TrendingUp, BookOpen, Trophy } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { EventsGrid } from '@/components/dashboard/events-grid'
import { Event, EventStatus } from '@/types/event'
import { CategoryWithIcon } from '@/types/category'

// Mock data - all events use the same data for testing routing
const MOCK_EVENT: Event = {
  id: '1',
  title: 'HackTech 2024',
  description: 'Join us for 48 hours of coding, innovation, and prizes! Build the next big thing with fellow developers and win amazing rewards.',
  category: 'hackathons',
  field: 'computer-science',
  minAge: 18,
  maxAge: 25,
  region: 'zurich',
  date: '2024-03-15',
  time: '18:00',
  location: 'Computer Science Building',
  tags: ['Tech', 'Coding', 'Innovation'],
  // Required properties from new Event interface
  status: EventStatus.PUBLISHED,
  registrationRequired: true,
  isFree: true,
  organizer: 'Tech Society',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

// Generate multiple events with the same data but different IDs for testing
const MOCK_EVENTS: Event[] = Array.from({ length: 6 }, (_, index) => ({
  ...MOCK_EVENT,
  id: (index + 1).toString(),
}))

const EVENT_CATEGORIES: CategoryWithIcon[] = [
  { value: 'all', label: 'All Events', icon: Calendar },
  { value: 'contests', label: 'Contests', icon: Trophy },
  { value: 'hackathons', label: 'Hackathons', icon: TrendingUp },
  { value: 'events', label: 'Events', icon: Users },
  { value: 'workshops', label: 'Workshops', icon: BookOpen }
]

export default function DashboardPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDate, setSelectedDate] = useState('all')
  const [selectedAgeRange, setSelectedAgeRange] = useState<[number, number]>([0, 99])
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedField, setSelectedField] = useState('all')
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
      case 'created-desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'created-asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      default:
        return 0
    }
  })

  // Calculate statistics
  const totalEvents = MOCK_EVENTS.length

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
      totalEvents={totalEvents}
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
      selectedAgeRange={selectedAgeRange}
      onAgeRangeChange={setSelectedAgeRange}
      selectedRegion={selectedRegion}
      onRegionChange={setSelectedRegion}
      selectedField={selectedField}
      onFieldChange={setSelectedField}
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
        isListView={isListView}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    </DashboardLayout>
  )
}
