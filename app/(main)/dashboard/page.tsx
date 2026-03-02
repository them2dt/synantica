'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { EventDirectory } from '@/types/event'
import { useEventsDirectoryPaginated, useEventTypes, useRealtimeEvents } from '@/lib/hooks/use-events'
import { EventFilters } from '@/types/event'

import { useDebounce } from '@/lib/hooks/use-debounce'
import { ErrorBoundary } from '@/components/error-boundary'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/hooks/use-auth'

import { mapEventTypesToCategories } from '@/lib/utils/categories'
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs'
import { DashboardLoading } from '@/components/dashboard/dashboard-loading'

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
  const filters: EventFilters = useMemo(() => ({
    search: debouncedSearchTerm || undefined,
    type: selectedType === 'all' ? undefined : selectedType,
  }), [debouncedSearchTerm, selectedType])

  // Fetch events from database - using paginated optimized directory view for better performance
  const { events: dbEvents, loading, loadingMore, error, hasMore, loadMore, refetch } = useEventsDirectoryPaginated(filters, 20)
  const { eventTypes: dbCategories, loading: categoriesLoading } = useEventTypes()

  // Real-time updates for live event changes
  useRealtimeEvents((event, action) => {
    console.log(`Event ${action}:`, event.name)

    // For updates/deletes, refresh the data after a short delay
    if (action !== 'INSERT') {
      setTimeout(() => refetch(), 2000)
    }
  }, true) // Enable real-time updates

  // Transform database event types to match our interface
  const eventTypes = useMemo(() => mapEventTypesToCategories(dbCategories), [dbCategories])

  // Sort events (date ascending) constantly since we removed the sort picker UI
  const sortedEvents = useMemo(() => {
    if (!dbEvents) return []
    return [...dbEvents].sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime())
  }, [dbEvents])

  const handleEventClick = (event: EventDirectory) => {
    router.push(`/events/${event.id}`)
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
        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isAuthenticated={isAuthenticated}
        />

        {activeTab === 'mine' ? (
          <MyEventsList />
        ) : loading || categoriesLoading ? (
          <DashboardLoading />
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
