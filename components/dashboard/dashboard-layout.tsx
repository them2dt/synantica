'use client'

import { ReactNode } from 'react'
import { Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/ui/logo'
import { UserMenu } from '@/components/user/user-menu'
import { RoleIndicator } from '@/components/user/role-indicator'
import { FiltersSidebar } from './filters-sidebar'
import { QuickStats } from './quick-stats'

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
  thisWeekEvents: number
  totalAttendees: number
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
  totalEvents,
  thisWeekEvents,
  totalAttendees,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Logo size="lg" showIcon={false} />
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="hidden sm:flex">
                <Users className="w-3 h-3 mr-1" />
                {totalAttendees}
              </Badge>
              <RoleIndicator />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <FiltersSidebar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
              categories={categories}
            />
            <QuickStats
              totalEvents={totalEvents}
              thisWeekEvents={thisWeekEvents}
              totalAttendees={totalAttendees}
            />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
