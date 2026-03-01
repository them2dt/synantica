'use client'

import { ReactNode } from 'react'
// import { Users } from 'lucide-react' // Unused for now
// import { Badge } from '@/components/ui/badge' // Unused for now
import { FiltersTopBar } from '@/components/dashboard/filters-top-bar'
import { Footer } from '@/components/layout/footer'
import { DateRange } from 'react-day-picker'

/**
 * Props for the dashboard layout component
 */
interface DashboardLayoutProps {
  children: ReactNode
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedType: string
  onTypeChange: (value: string) => void
  eventTypes: Array<{ value: string; label: string; icon: React.ComponentType<{ className?: string }> }>
  totalEvents: number
  selectedDateRange?: DateRange
  onDateRangeChange?: (range: DateRange | undefined) => void
  selectedAgeRange?: [number, number]
  onAgeRangeChange?: (value: [number, number]) => void
  selectedCountry?: string
  onCountryChange?: (value: string) => void
  selectedField?: string
  onFieldChange?: (value: string) => void
  isListView?: boolean
  onViewChange?: (isList: boolean) => void
  sortBy?: string
  onSortChange?: (value: string) => void
}

/**
 * Dashboard layout component with header, sidebar, and main content
 * Matches the structure shown in the reference image
 */
export function DashboardLayout({
  children,
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  eventTypes,
  totalEvents, // For future use in header stats
  selectedDateRange,
  onDateRangeChange,
  selectedAgeRange,
  onAgeRangeChange,
  selectedCountry,
  onCountryChange,
  selectedField,
  onFieldChange,
  isListView,
  onViewChange,
  sortBy,
  onSortChange,
}: DashboardLayoutProps) {
  // Suppress unused parameter warning for now
  void totalEvents;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1">
        <div className="mx-auto w-full max-w-[1100px] px-6 py-10">
          {/* Filters Top Bar */}
          <div className="mb-10">
            <FiltersTopBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              selectedType={selectedType}
              onTypeChange={onTypeChange}
              eventTypes={eventTypes}
              selectedDateRange={selectedDateRange}
              onDateRangeChange={onDateRangeChange}
              selectedAgeRange={selectedAgeRange}
              onAgeRangeChange={onAgeRangeChange}
              selectedCountry={selectedCountry}
              onCountryChange={onCountryChange}
              selectedField={selectedField}
              onFieldChange={onFieldChange}
              isListView={isListView}
              onViewChange={onViewChange}
              sortBy={sortBy}
              onSortChange={onSortChange}
            />
          </div>

          {/* Main Content Area */}
          <main>{children}</main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
