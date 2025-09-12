'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Calendar, Users, TrendingUp, BookOpen, Trophy } from 'lucide-react'
import { EventDirectory } from '@/types/event'
import { CategoryWithIcon } from '@/types/category'
import { useEventsDirectoryPaginated, useEventCategories, useRealtimeEvents } from '@/lib/hooks/use-events'
import { EventFilters } from '@/lib/database/events-client'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { ErrorBoundary } from '@/components/error-boundary'

// Lazy load heavy components
const DashboardLayout = dynamic(() => import('@/components/dashboard/dashboard-layout').then(mod => ({ default: mod.DashboardLayout })), {
  loading: () => <div className="animate-pulse h-screen bg-muted"></div>
})

const EventsGrid = dynamic(() => import('@/components/dashboard/events-grid').then(mod => ({ default: mod.EventsGrid })), {
  loading: () => <div className="animate-pulse h-64 bg-muted rounded-lg"></div>
})

const DashboardSkeleton = dynamic(() => import('@/components/ui/skeleton').then(mod => ({ default: mod.DashboardSkeleton })), {
  loading: () => <div className="animate-pulse h-64 bg-muted rounded-lg"></div>
})

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

  // Debounce search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

    // Build filters for database query (without limit for pagination hook)
  const filters: EventFilters = useMemo(() => {
    const baseFilters: EventFilters = {
      search: debouncedSearchTerm || undefined,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      field: selectedField === 'all' ? undefined : selectedField,
      region: selectedRegion === 'all' ? undefined : selectedRegion,
      minAge: selectedAgeRange[0] > 0 ? selectedAgeRange[0] : undefined,
      maxAge: selectedAgeRange[1] < 99 ? selectedAgeRange[1] : undefined
    }

    // Add date filtering if not 'all'
    if (selectedDate !== 'all') {
      const now = new Date()
      switch (selectedDate) {
        case 'today':
          baseFilters.dateFrom = now.toISOString().split('T')[0]
          baseFilters.dateTo = now.toISOString().split('T')[0]
          break
        case 'tomorrow':
          const tomorrow = new Date(now)
          tomorrow.setDate(now.getDate() + 1)
          baseFilters.dateFrom = tomorrow.toISOString().split('T')[0]
          baseFilters.dateTo = tomorrow.toISOString().split('T')[0]
          break
        case 'this-week':
          const weekStart = new Date(now)
          weekStart.setDate(now.getDate() - now.getDay())
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          baseFilters.dateFrom = weekStart.toISOString().split('T')[0]
          baseFilters.dateTo = weekEnd.toISOString().split('T')[0]
          break
        case 'next-week':
          const nextWeekStart = new Date(now)
          nextWeekStart.setDate(now.getDate() - now.getDay() + 7)
          const nextWeekEnd = new Date(nextWeekStart)
          nextWeekEnd.setDate(nextWeekStart.getDate() + 6)
          baseFilters.dateFrom = nextWeekStart.toISOString().split('T')[0]
          baseFilters.dateTo = nextWeekEnd.toISOString().split('T')[0]
          break
        case 'this-month':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
          baseFilters.dateFrom = monthStart.toISOString().split('T')[0]
          baseFilters.dateTo = monthEnd.toISOString().split('T')[0]
          break
        case 'next-month':
          const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)
          const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0)
          baseFilters.dateFrom = nextMonthStart.toISOString().split('T')[0]
          baseFilters.dateTo = nextMonthEnd.toISOString().split('T')[0]
          break
      }
    }

    return baseFilters
  }, [debouncedSearchTerm, selectedCategory, selectedField, selectedRegion, selectedAgeRange, selectedDate])

  // Fetch events from database - using paginated optimized directory view for better performance
  const { events: dbEvents, loading, loadingMore, error, hasMore, loadMore, refetch } = useEventsDirectoryPaginated(filters, 20)
  const { categories: dbCategories, loading: categoriesLoading } = useEventCategories()

  // Real-time updates for live event changes
  useRealtimeEvents((event, action) => {
    console.log(`Event ${action}:`, event.title)

    // Show a subtle notification (you could enhance this with a toast notification)
    const notificationMessage = action === 'INSERT'
      ? `New event added: ${event.title}`
      : action === 'UPDATE'
      ? `Event updated: ${event.title}`
      : `Event removed: ${event.title}`

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
    <ErrorBoundary>
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
          showLoadMore={true}
          onLoadMore={loadMore}
          loadingMore={loadingMore}
          hasMore={hasMore}
        />
      </DashboardLayout>
    </ErrorBoundary>
  )
}
