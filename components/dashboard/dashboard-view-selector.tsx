'use client'

import { Button } from '@/components/ui/button'
import { Grid, List, Table } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * View mode types for dashboard
 */
export type DashboardViewMode = 'grid' | 'list' | 'ag-grid'

/**
 * Props for the dashboard view selector
 */
interface DashboardViewSelectorProps {
  currentView: DashboardViewMode
  onViewChange: (view: DashboardViewMode) => void
  className?: string
}

/**
 * Professional view selector component for dashboard
 * Allows switching between grid, list, and AG Grid views
 */
export function DashboardViewSelector({
  currentView,
  onViewChange,
  className
}: DashboardViewSelectorProps) {
  const viewOptions = [
    {
      id: 'grid' as const,
      label: 'Grid View',
      icon: Grid,
      description: 'Card-based grid layout'
    },
    {
      id: 'list' as const,
      label: 'List View',
      icon: List,
      description: 'Compact table layout'
    },
    {
      id: 'ag-grid' as const,
      label: 'Data Grid',
      icon: Table,
      description: 'Professional data grid with advanced features'
    }
  ]

  return (
    <div className={cn('flex items-center gap-1 p-1 bg-muted rounded-lg', className)}>
      {viewOptions.map(({ id, label, icon: Icon, description }) => (
        <Button
          key={id}
          variant={currentView === id ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange(id)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 h-8 transition-all',
            currentView === id
              ? 'bg-background shadow-sm'
              : 'hover:bg-background/50'
          )}
          title={description}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">{label}</span>
        </Button>
      ))}
    </div>
  )
}

/**
 * Compact version for mobile/smaller screens
 */
export function CompactDashboardViewSelector({
  currentView,
  onViewChange,
  className
}: DashboardViewSelectorProps) {
  const viewOptions = [
    { id: 'grid' as const, icon: Grid, label: 'Grid' },
    { id: 'list' as const, icon: List, label: 'List' },
    { id: 'ag-grid' as const, icon: Table, label: 'Data' }
  ]

  return (
    <div className={cn('flex items-center gap-0.5 p-0.5 bg-muted rounded-md', className)}>
      {viewOptions.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant={currentView === id ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange(id)}
          className={cn(
            'w-8 h-8 p-0 transition-all',
            currentView === id
              ? 'bg-background shadow-sm'
              : 'hover:bg-background/50'
          )}
          title={`${label} View`}
        >
          <Icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  )
}

