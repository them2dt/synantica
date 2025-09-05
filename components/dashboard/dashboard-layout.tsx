'use client'

import { ReactNode } from 'react'
// import { Users } from 'lucide-react' // Unused for now
// import { Badge } from '@/components/ui/badge' // Unused for now
import { FiltersTopBar } from '@/components/dashboard/filters-top-bar'
import { Footer } from '@/components/layout/footer'

/**
 * Props for the dashboard layout component
 */
interface DashboardLayoutProps {
  children: ReactNode
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  categories: Array<{ value: string; label: string; icon: React.ComponentType<{ className?: string }> }>
  totalEvents: number
  selectedDate?: string
  onDateChange?: (value: string) => void
  selectedAgeRange?: [number, number]
  onAgeRangeChange?: (value: [number, number]) => void
  selectedRegion?: string
  onRegionChange?: (value: string) => void
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
  selectedCategory,
  onCategoryChange,
  categories,
  totalEvents, // For future use in header stats
  selectedDate,
  onDateChange,
  selectedAgeRange,
  onAgeRangeChange,
  selectedRegion,
  onRegionChange,
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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Filters Top Bar */}
          <div className="mb-8">
            <FiltersTopBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
              categories={categories}
              selectedDate={selectedDate}
              onDateChange={onDateChange}
              selectedAgeRange={selectedAgeRange}
              onAgeRangeChange={onAgeRangeChange}
              selectedRegion={selectedRegion}
              onRegionChange={onRegionChange}
              selectedField={selectedField}
              onFieldChange={onFieldChange}
              isListView={isListView}
              onViewChange={onViewChange}
              sortBy={sortBy}
              onSortChange={onSortChange}
            />
          </div>

          {/* Main Content Area */}
          <main>
            {children}
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
