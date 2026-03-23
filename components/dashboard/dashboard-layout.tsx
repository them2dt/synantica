'use client'

import { ReactNode } from 'react'
import { FiltersTopBar, SortOption, DateRangeOption, AgeOption } from '@/components/dashboard/filters-top-bar'
import { FilterChips, ActiveFilter } from '@/components/dashboard/filter-chips'
import { Footer } from '@/components/layout/footer'
import { NavigationSpacer } from '@/components/layout/navigation-spacer'
import { FloatingAddEvent } from '@/components/dashboard/floating-add-event'
import { ThemedText } from '@/components/ui/themed-text'
import { CategoryWithIcon } from '@/types/category'

interface DashboardLayoutProps {
  children: ReactNode
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedType: string
  onTypeChange: (value: string) => void
  eventTypes: CategoryWithIcon[]
  isListView?: boolean
  onViewChange?: (isList: boolean) => void
  onAddEventClick?: () => void
  // Advanced filters
  selectedSort: SortOption
  onSortChange: (value: SortOption) => void
  selectedCountry: string
  onCountryChange: (value: string) => void
  selectedDateRange: DateRangeOption
  onDateRangeChange: (value: DateRangeOption) => void
  selectedAge: AgeOption
  onAgeChange: (value: AgeOption) => void
  activeFilters: ActiveFilter[]
  onRemoveFilter: (key: string) => void
  onClearAllFilters: () => void
}

export function DashboardLayout({
  children,
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  eventTypes,
  isListView,
  onViewChange,
  onAddEventClick,
  selectedSort,
  onSortChange,
  selectedCountry,
  onCountryChange,
  selectedDateRange,
  onDateRangeChange,
  selectedAge,
  onAgeChange,
  activeFilters,
  onRemoveFilter,
  onClearAllFilters,
}: DashboardLayoutProps) {

  return (
    <main className="mx-auto min-h-screen max-w-[1100px] md:border-x border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-slate-950">
      <div className="flex-1">
        {/* Hero Section */}
        <section className="p-6 pt-16">
          <NavigationSpacer />
          <div className="space-y-4">
            <ThemedText variant="h1">Dashboard</ThemedText>
            <ThemedText variant="sm" color="muted" className="max-w-2xl block">
              Search and filter through the directory of STEM activities.
            </ThemedText>
          </div>
        </section>

        {/* Filters */}
        <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <FiltersTopBar
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            selectedType={selectedType}
            onTypeChange={onTypeChange}
            eventTypes={eventTypes}
            isListView={isListView}
            onViewChange={onViewChange}
            selectedSort={selectedSort}
            onSortChange={onSortChange}
            selectedCountry={selectedCountry}
            onCountryChange={onCountryChange}
            selectedDateRange={selectedDateRange}
            onDateRangeChange={onDateRangeChange}
            selectedAge={selectedAge}
            onAgeChange={onAgeChange}
            activeFilterCount={activeFilters.length}
          />
          <FilterChips
            filters={activeFilters}
            onRemove={onRemoveFilter}
            onClearAll={onClearAllFilters}
          />
        </section>

        {/* Main Content */}
        <section className="border-t border-slate-200 dark:border-slate-800 min-h-[calc(100vh-65px)] bg-slate-50 dark:bg-slate-950">
          <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            {children}
          </div>
        </section>
      </div>

      {onAddEventClick && <FloatingAddEvent onClick={onAddEventClick} />}
      <Footer />
    </main>
  )
}
