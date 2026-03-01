'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Calendar, Users, BookOpen, Trophy } from 'lucide-react'
import { EventDirectory } from '@/types/event'
import { CategoryWithIcon } from '@/types/category'
import { useEventsDirectoryPaginated, useEventTypes, useRealtimeEvents } from '@/lib/hooks/use-events'
import { EventFilters } from '@/types/event'
import { DateRange } from 'react-day-picker'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { ErrorBoundary } from '@/components/error-boundary'
import { Button } from '@/components/ui/button'

// Lazy load heavy components
const DashboardLayout = dynamic(() => import('@/components/dashboard/dashboard-layout').then(mod => ({ default: mod.DashboardLayout })), {
  loading: () => <div className="animate-pulse h-screen bg-slate-100"></div>
})

const EventsGrid = dynamic(() => import('@/components/dashboard/events-grid').then(mod => ({ default: mod.EventsGrid })), {
  loading: () => <div className="animate-pulse h-64 bg-slate-100 rounded-none"></div>
})

const DashboardSkeleton = dynamic(() => import('@/components/ui/skeleton').then(mod => ({ default: mod.DashboardSkeleton })), {
  loading: () => <div className="animate-pulse h-64 bg-slate-100 rounded-none"></div>
})

export default function DashboardPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(undefined)
  const [selectedAgeRange, setSelectedAgeRange] = useState<[number, number]>([0, 99])
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedField, setSelectedField] = useState('all')
  const [isListView, setIsListView] = useState(false)
  const [sortBy, setSortBy] = useState('date-asc')

  // Debounce search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Build filters for database query (without limit for pagination hook)
  const filters: EventFilters = useMemo(() => {
    const baseFilters: EventFilters = {
      search: debouncedSearchTerm || undefined,
      type: selectedType === 'all' ? undefined : selectedType,
      fields: selectedField === 'all' ? undefined : [selectedField],
      country: selectedCountry === 'all' ? undefined : selectedCountry,
      fromAge: selectedAgeRange[0] > 0 ? selectedAgeRange[0] : undefined,
      toAge: selectedAgeRange[1] < 99 ? selectedAgeRange[1] : undefined,
      fromDate: selectedDateRange?.from ? selectedDateRange.from.toISOString().split('T')[0] : undefined,
      toDate: selectedDateRange?.to ? selectedDateRange.to.toISOString().split('T')[0] : undefined
    }


    return baseFilters
  }, [debouncedSearchTerm, selectedType, selectedField, selectedCountry, selectedAgeRange, selectedDateRange])

  // Fetch events from database - using paginated optimized directory view for better performance
  const { events: dbEvents, loading, loadingMore, error, hasMore, loadMore, refetch } = useEventsDirectoryPaginated(filters, 20)
  const { eventTypes: dbCategories, loading: categoriesLoading } = useEventTypes()

  // Real-time updates for live event changes
  useRealtimeEvents((event, action) => {
    console.log(`Event ${action}:`, event.name)

    // Show a subtle notification (you could enhance this with a toast notification)
    const notificationMessage = action === 'INSERT'
      ? `New event added: ${event.name}`
      : action === 'UPDATE'
        ? `Event updated: ${event.name}`
        : `Event removed: ${event.name}`

    console.log(notificationMessage)

    // For now, we'll just log and potentially refresh the data
    // In a production app, you'd want to update the local state instead
    if (action !== 'INSERT') {
      // For updates/deletes, refresh the data after a short delay
      setTimeout(() => {
        refetch()
      }, 2000)
    }
  }, true) // Enable real-time updates

  // Transform database event types to match our interface
  const eventTypes: CategoryWithIcon[] = useMemo(() => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'olympiads': Trophy,
      'contests': Calendar,
      'events': Users,
      'workshops': BookOpen
    }

    const categories: CategoryWithIcon[] = [
      { value: 'all', label: 'All Events', icon: Calendar }
    ]

    if (dbCategories) {
      dbCategories.forEach(eventType => {
        const slug = eventType.name.toLowerCase().replace(/\s+/g, '-')
        categories.push({
          value: slug,
          label: eventType.name,
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
          return new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime()
        case 'date-desc':
          return new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime()
        case 'title-asc':
          return a.name.localeCompare(b.name)
        case 'title-desc':
          return b.name.localeCompare(a.name)
        case 'age-asc':
          return (a.fromAge || 0) - (b.fromAge || 0)
        case 'age-desc':
          return (b.fromAge || 0) - (a.fromAge || 0)
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

  const handleEventClick = (event: EventDirectory) => {
    // Navigate to the event detail page
    router.push(`/events/${event.id}`)
  }

  // Show loading state
  if (loading || categoriesLoading) {
    return (
      <ErrorBoundary>
        <DashboardLayout
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          eventTypes={eventTypes}
          totalEvents={0}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={setSelectedDateRange}
          selectedAgeRange={selectedAgeRange}
          onAgeRangeChange={setSelectedAgeRange}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          selectedField={selectedField}
          onFieldChange={setSelectedField}
          isListView={isListView}
          onViewChange={setIsListView}
          sortBy={sortBy}
          onSortChange={setSortBy}
        >
          <DashboardSkeleton />
        </DashboardLayout>
      </ErrorBoundary>
    )
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        eventTypes={eventTypes}
        totalEvents={0}
        selectedDateRange={selectedDateRange}
        onDateRangeChange={setSelectedDateRange}
        selectedAgeRange={selectedAgeRange}
        onAgeRangeChange={setSelectedAgeRange}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        selectedField={selectedField}
        onFieldChange={setSelectedField}
        isListView={isListView}
        onViewChange={setIsListView}
        sortBy={sortBy}
        onSortChange={setSortBy}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h3 className="text-lg text-slate-950 mb-2">Error Loading Events</h3>
            <p className="text-slate-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <ErrorBoundary>
      <DashboardLayout
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        eventTypes={eventTypes}
        totalEvents={totalEvents}
        selectedDateRange={selectedDateRange}
        onDateRangeChange={setSelectedDateRange}
        selectedAgeRange={selectedAgeRange}
        onAgeRangeChange={setSelectedAgeRange}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        selectedField={selectedField}
        onFieldChange={setSelectedField}
        isListView={isListView}
        onViewChange={setIsListView}
        sortBy={sortBy}
        onSortChange={setSortBy}
      >
        <EventsGrid
          events={sortedEvents}
          selectedType={selectedType}
          eventTypes={eventTypes}
          onEventClick={handleEventClick}
          isListView={isListView}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showLoadMore={true}
          onLoadMore={loadMore}
          loadingMore={loadingMore}
          hasMore={hasMore}
        />
      </DashboardLayout>
    </ErrorBoundary>
  )
}
