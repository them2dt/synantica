'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Calendar, Users, BookOpen, Trophy } from 'lucide-react'
import { EventDirectory } from '@/types/event'
import { CategoryWithIcon } from '@/types/category'
import { useEventsDirectoryPaginated, useEventTypes, useRealtimeEvents } from '@/lib/hooks/use-events'
import { EventFilters } from '@/types/event'

import { useDebounce } from '@/lib/hooks/use-debounce'
import { ErrorBoundary } from '@/components/error-boundary'
import { Button } from '@/components/ui/button'
import { InlineSpinner } from '@/components/ui/loading'
import { useAuth } from '@/lib/hooks/use-auth'

// Lazy load heavy components
const DashboardLayout = dynamic(() => import('@/components/dashboard/dashboard-layout').then(mod => ({ default: mod.DashboardLayout })), {
  loading: () => <div className="animate-pulse h-screen bg-slate-100"></div>
})

const EventsGrid = dynamic(() => import('@/components/dashboard/events-grid').then(mod => ({ default: mod.EventsGrid })), {
  loading: () => <div className="animate-pulse h-64 bg-slate-100 rounded-none"></div>
})

const SubmitEventModal = dynamic(() => import('@/components/dashboard/submit-event-modal').then(mod => ({ default: mod.SubmitEventModal })))
const MyEventsList = dynamic(() => import('@/components/dashboard/my-events-list').then(mod => ({ default: mod.MyEventsList })))

export default function DashboardPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [isListView, setIsListView] = useState(false)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all')
  const { isAuthenticated } = useAuth()

  // Debounce search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Build filters for database query (without limit for pagination hook)
  const filters: EventFilters = useMemo(() => {
    const baseFilters: EventFilters = {
      search: debouncedSearchTerm || undefined,
      type: selectedType === 'all' ? undefined : selectedType,
    }

    return baseFilters
  }, [debouncedSearchTerm, selectedType])

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

  // Sort events (date ascending) constantly since we removed the sort picker UI
  const sortedEvents = useMemo(() => {
    if (!dbEvents) return []
    return [...dbEvents].sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime())
  }, [dbEvents])


  const handleEventClick = (event: EventDirectory) => {
    // Navigate to the event detail page
    router.push(`/events/${event.id}`)
  }

  // Show error state (keep this covering the page if it's a hard error)
  if (error) {
    return (
      <DashboardLayout
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        eventTypes={eventTypes}
        isListView={isListView}
        onViewChange={setIsListView}
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
        isListView={isListView}
        onViewChange={setIsListView}
        onAddEventClick={() => setIsSubmitModalOpen(true)}
      >
        {isAuthenticated && (
          <div className="flex gap-1 pt-3 border-b border-slate-100">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('all')}
            >
              All Events
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'mine' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('mine')}
            >
              My Events
            </button>
          </div>
        )}
        {activeTab === 'mine' ? (
          <MyEventsList />
        ) : loading || categoriesLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <div className="flex flex-col items-center gap-4">
              <InlineSpinner className="w-8 h-8" />
              <p>Loading directory...</p>
            </div>
          </div>
        ) : (
          <EventsGrid
            events={sortedEvents}
            selectedType={selectedType}
            eventTypes={eventTypes}
            onEventClick={handleEventClick}
            isListView={isListView}
            showLoadMore={true}
            onLoadMore={loadMore}
            loadingMore={loadingMore}
            hasMore={hasMore}
          />
        )}
        <SubmitEventModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
        />
      </DashboardLayout>
    </ErrorBoundary>
  )
}
