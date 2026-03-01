'use client'

import { ReactNode } from 'react'
// import { Users } from 'lucide-react' // Unused for now
// import { Badge } from '@/components/ui/badge' // Unused for now
import { FiltersTopBar } from '@/components/dashboard/filters-top-bar'
import { Footer } from '@/components/layout/footer'
import { NavigationSpacer } from '@/components/layout/navigation-spacer'

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
  isListView?: boolean
  onViewChange?: (isList: boolean) => void
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
  isListView,
  onViewChange,
}: DashboardLayoutProps) {

  return (
    <main className="mx-auto min-h-screen max-w-[1100px] border-x border-slate-200 flex flex-col">
      <div className="flex-1">
        {/* Hero Section */}
        <section className="p-6 pt-16">
          <NavigationSpacer />
          <div className="space-y-4">
            <h1 className="text-5xl">Dashboard</h1>
            <p className="text-sm text-slate-500 max-w-2xl">
              Search and filter through the directory of stem activities.
            </p>
          </div>
        </section>

        {/* Filters Top Bar */}
        <section className="border-t border-slate-200">
          <FiltersTopBar
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            selectedType={selectedType}
            onTypeChange={onTypeChange}
            eventTypes={eventTypes}
            isListView={isListView}
            onViewChange={onViewChange}
          />
        </section>

        {/* Main Content Area */}
        <section className="border-t border-slate-200">
          {children}
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}
