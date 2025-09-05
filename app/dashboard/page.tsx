'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Users, TrendingUp, BookOpen, Trophy } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { EventsGrid } from '@/components/dashboard/events-grid'
import { Event } from '@/types/event'
import { CategoryWithIcon } from '@/types/category'
import { useEvents, useEventCategories } from '@/lib/hooks/use-events'
import { EventFilters } from '@/lib/database/events-client'

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

  // Build filters for database query
  const filters: EventFilters = useMemo(() => {
    const baseFilters: EventFilters = {
      search: searchTerm || undefined,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      field: selectedField === 'all' ? undefined : selectedField,
      region: selectedRegion === 'all' ? undefined : selectedRegion,
      minAge: selectedAgeRange[0] > 0 ? selectedAgeRange[0] : undefined,
      maxAge: selectedAgeRange[1] < 99 ? selectedAgeRange[1] : undefined,
      limit: 50 // Increase limit for better UX
    }

    // Add date filtering if not 'all'
    if (selectedDate !== 'all') {
      const now = new Date()
      switch (selectedDate) {
        case 'today':
          baseFilters.dateFrom = now.toISOString().split('T')[0]
          baseFilters.dateTo = now.toISOString().split('T')[0]
          break
        case 'this-week':
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
          const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6))
          baseFilters.dateFrom = weekStart.toISOString().split('T')[0]
          baseFilters.dateTo = weekEnd.toISOString().split('T')[0]
          break
        case 'this-month':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
          baseFilters.dateFrom = monthStart.toISOString().split('T')[0]
          baseFilters.dateTo = monthEnd.toISOString().split('T')[0]
          break
      }
    }

    return baseFilters
  }, [searchTerm, selectedCategory, selectedField, selectedRegion, selectedAgeRange, selectedDate])

  // Fetch events from database
  const { events: dbEvents, loading, error } = useEvents(filters)
  const { categories: dbCategories, loading: categoriesLoading } = useEventCategories()

  // Transform database categories to match our interface
  const eventCategories: CategoryWithIcon[] = useMemo(() => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'contests': Trophy,
      'hackathons': TrendingUp,
      'events': Users,
      'workshops': BookOpen,
      'seminars': BookOpen,
      'conferences': Users,
      'networking': Users,
      'social': Users,
      'sports': Users,
      'cultural': Users,
      'academic': BookOpen,
      'career': Users,
      'volunteer': Users,
      'olympiads': Trophy,
      'science-fairs': BookOpen,
      'other': Calendar
    }

    const categories: CategoryWithIcon[] = [
      { value: 'all', label: 'All Events', icon: Calendar }
    ]

    if (dbCategories) {
      dbCategories.forEach(cat => {
        const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')
        categories.push({
          value: slug,
          label: cat.name,
          icon: iconMap[slug] || Calendar
        })
      })
    }

    return categories
  }, [dbCategories])

  // Sort events based on selected sort option
  const sortedEvents = useMemo(() => {
    if (!dbEvents) return []
    
    return [...dbEvents].sort((a, b) => {
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
  }, [dbEvents, sortBy])

  // Calculate statistics
  const totalEvents = dbEvents?.length || 0

  const handleEventClick = (event: Event) => {
    // Navigate to the event detail page
    router.push(`/events/${event.id}`)
  }

  // Show loading state
  if (loading || categoriesLoading) {
    return (
      <DashboardLayout
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={eventCategories}
        totalEvents={0}
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
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={eventCategories}
        totalEvents={0}
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
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Events</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      categories={eventCategories}
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
        categories={eventCategories}
        onEventClick={handleEventClick}
        isListView={isListView}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    </DashboardLayout>
  )
}
