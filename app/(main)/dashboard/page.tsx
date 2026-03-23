'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { EventDirectory, EventFilters } from '@/types/event'
import { useEventsDirectoryPaginated, useEventTypes, useRealtimeEvents } from '@/lib/hooks/use-events'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { ErrorBoundary } from '@/components/error-boundary'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/hooks/use-auth'
import { mapEventTypesToCategories } from '@/lib/utils/categories'
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs'
import { DashboardLoading } from '@/components/dashboard/dashboard-loading'
import { SortOption, DateRangeOption, AgeOption } from '@/components/dashboard/filters-top-bar'
import { ActiveFilter } from '@/components/dashboard/filter-chips'

const DashboardLayout = dynamic(() => import('@/components/dashboard/dashboard-layout').then(mod => ({ default: mod.DashboardLayout })), {
  loading: () => <div className="animate-pulse h-screen bg-slate-100"></div>
})

const EventsGrid = dynamic(() => import('@/components/dashboard/events-grid').then(mod => ({ default: mod.EventsGrid })), {
  loading: () => <div className="animate-pulse h-64 bg-slate-100"></div>
})

const SubmitEventModal = dynamic(() => import('@/components/dashboard/submit-event-modal').then(mod => ({ default: mod.SubmitEventModal })))
const MyEventsList = dynamic(() => import('@/components/dashboard/my-events-list').then(mod => ({ default: mod.MyEventsList })))

/** Compute fromDate/toDate for the selected date range option */
function resolveDateRange(range: DateRangeOption): { fromDate?: string; toDate?: string } {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  if (range === 'all') return {}
  if (range === 'past') return { toDate: today }
  if (range === 'this-month') {
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return { fromDate: today, toDate: end.toISOString().split('T')[0] }
  }
  if (range === 'next-3-months') {
    const end = new Date(now.getFullYear(), now.getMonth() + 3, 0)
    return { fromDate: today, toDate: end.toISOString().split('T')[0] }
  }
  if (range === 'this-year') {
    const end = new Date(now.getFullYear(), 11, 31)
    return { fromDate: today, toDate: end.toISOString().split('T')[0] }
  }
  return {}
}

/** Compute fromAge/toAge for the selected age option */
function resolveAge(age: AgeOption): { fromAge?: number; toAge?: number } {
  if (age === 'all') return {}
  if (age === 'under-14') return { toAge: 14 }
  if (age === '14-18') return { fromAge: 14, toAge: 18 }
  if (age === '18-plus') return { fromAge: 18 }
  return {}
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Primary filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all')
  const [isListView, setIsListView] = useState(false)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all')
  const { isAuthenticated } = useAuth()

  // Advanced filters
  const [selectedSort, setSelectedSort] = useState<SortOption>('date-asc')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeOption>('all')
  const [selectedAge, setSelectedAge] = useState<AgeOption>('all')

  // Sync type from URL query param (for landing page category links)
  useEffect(() => {
    const typeParam = searchParams.get('type')
    if (typeParam) setSelectedType(typeParam)
  }, [searchParams])

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const filters: EventFilters = useMemo(() => {
    const dateRange = resolveDateRange(selectedDateRange)
    const ageRange = resolveAge(selectedAge)
    return {
      search: debouncedSearchTerm || undefined,
      type: selectedType === 'all' ? undefined : selectedType,
      country: selectedCountry === 'all' ? undefined : selectedCountry,
      ...dateRange,
      ...ageRange,
    }
  }, [debouncedSearchTerm, selectedType, selectedCountry, selectedDateRange, selectedAge])

  const { events: dbEvents, loading, loadingMore, error, hasMore, loadMore, refetch } = useEventsDirectoryPaginated(filters, 20)
  const { eventTypes: dbCategories, loading: categoriesLoading } = useEventTypes()

  useRealtimeEvents((event, action) => {
    if (action !== 'INSERT') {
      setTimeout(() => refetch(), 2000)
    }
  }, true)

  const eventTypes = useMemo(() => mapEventTypesToCategories(dbCategories), [dbCategories])

  const sortedEvents = useMemo(() => {
    if (!dbEvents) return []
    const arr = [...dbEvents]
    switch (selectedSort) {
      case 'date-asc':
        return arr.sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime())
      case 'date-desc':
        return arr.sort((a, b) => new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime())
      case 'name-asc':
        return arr.sort((a, b) => a.name.localeCompare(b.name))
      case 'recently-added':
        return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      default:
        return arr
    }
  }, [dbEvents, selectedSort])

  // Compute active filter chips for display
  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const chips: ActiveFilter[] = []
    if (selectedType !== 'all') {
      const found = eventTypes.find(t => t.value === selectedType)
      chips.push({ key: 'type', label: found?.label ?? selectedType })
    }
    if (selectedCountry !== 'all') {
      chips.push({ key: 'country', label: `Country: ${selectedCountry}` })
    }
    if (selectedDateRange !== 'all') {
      const labels: Record<DateRangeOption, string> = {
        all: '', 'this-month': 'This month', 'next-3-months': 'Next 3 months',
        'this-year': 'This year', past: 'Past events'
      }
      chips.push({ key: 'dateRange', label: labels[selectedDateRange] })
    }
    if (selectedAge !== 'all') {
      const labels: Record<AgeOption, string> = {
        all: '', 'under-14': 'Under 14', '14-18': '14–18', '18-plus': '18+'
      }
      chips.push({ key: 'age', label: `Age: ${labels[selectedAge]}` })
    }
    return chips
  }, [selectedType, selectedCountry, selectedDateRange, selectedAge, eventTypes])

  const handleRemoveFilter = (key: string) => {
    if (key === 'type') setSelectedType('all')
    if (key === 'country') setSelectedCountry('all')
    if (key === 'dateRange') setSelectedDateRange('all')
    if (key === 'age') setSelectedAge('all')
  }

  const handleClearAllFilters = () => {
    setSelectedType('all')
    setSelectedCountry('all')
    setSelectedDateRange('all')
    setSelectedAge('all')
    setSearchTerm('')
  }

  const handleEventClick = (event: EventDirectory) => {
    router.push(`/events/${event.id}`)
  }

  const layoutProps = {
    searchTerm, onSearchChange: setSearchTerm,
    selectedType, onTypeChange: setSelectedType,
    eventTypes,
    isListView, onViewChange: setIsListView,
    selectedSort, onSortChange: setSelectedSort,
    selectedCountry, onCountryChange: setSelectedCountry,
    selectedDateRange, onDateRangeChange: setSelectedDateRange,
    selectedAge, onAgeChange: setSelectedAge,
    activeFilters,
    onRemoveFilter: handleRemoveFilter,
    onClearAllFilters: handleClearAllFilters,
  }

  if (error) {
    return (
      <DashboardLayout {...layoutProps}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h3 className="text-lg text-slate-950 mb-2">Error Loading Events</h3>
            <p className="text-slate-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <ErrorBoundary>
      <DashboardLayout
        {...layoutProps}
        onAddEventClick={() => setIsSubmitModalOpen(true)}
      >
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} isAuthenticated={isAuthenticated} />

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

        <SubmitEventModal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} />
      </DashboardLayout>
    </ErrorBoundary>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-screen bg-slate-100 dark:bg-slate-900" />}>
      <DashboardContent />
    </Suspense>
  )
}
