'use client'

import { ReactNode } from 'react'
// import { Users } from 'lucide-react' // Unused for now
// import { Badge } from '@/components/ui/badge' // Unused for now
import { FiltersTopBar } from '@/components/dashboard/filters-top-bar'
import { Footer } from '@/components/layout/footer'
import { NavigationSpacer } from '@/components/layout/navigation-spacer'
import { FloatingAddEvent } from '@/components/dashboard/floating-add-event'
import { ThemedText } from '@/components/ui/themed-text'

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
  onAddEventClick?: () => void
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
  onAddEventClick,
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
              Search and filter through the directory of stem activities.
            </ThemedText>
          </div>
        </section>

        {/* Filters Top Bar */}
        <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
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
        <section className="border-t border-slate-200 dark:border-slate-800 min-h-[calc(100vh-65px)] bg-slate-50 dark:bg-slate-950">
          <div className="px-6 py-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            {children}
          </div>
        </section>
      </div>

      {/* Floating Add Event Button */}
      {onAddEventClick && <FloatingAddEvent onClick={onAddEventClick} />}

      {/* Footer */}
      <Footer />
    </main>
  )
}
