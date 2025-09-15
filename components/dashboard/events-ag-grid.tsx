'use client'

import { useMemo, useCallback, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridReadyEvent, ICellRendererParams, ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { Calendar, Clock, MapPin, Tag, FileText, Type } from 'lucide-react'

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule])
import { Badge } from '@/components/ui/badge'
import { Event, EventDirectory } from '@/types/event'
import { formatEventDate } from '@/lib/utils/date-formatting'

/**
 * Props for the AG Grid events component
 */
interface EventsAGGridProps {
  events: Event[] | EventDirectory[]
  onEventClick: (event: Event | EventDirectory) => void
  loading?: boolean
  height?: number | string
  enablePagination?: boolean
  pageSize?: number
  enableSorting?: boolean
  enableFiltering?: boolean
  enableColumnResizing?: boolean
  showLoadingOverlay?: boolean
}

/**
 * Custom cell renderer for event title - clickable to navigate to event
 */
const TitleCellRenderer = (params: ICellRendererParams) => {
  const handleClick = () => {
    if (params.context?.onEventClick) {
      params.context.onEventClick(params.data)
    }
  }

  return (
    <div 
      className="py-1 cursor-pointer hover:bg-muted/50 rounded px-2 -mx-2 transition-colors" 
      onClick={handleClick}
      title={`Click to view ${params.value}`}
    >
      <span className="font-medium text-primary hover:text-primary/80 truncate underline-offset-4 hover:underline">
        {params.value}
      </span>
    </div>
  )
}

/**
 * Custom cell renderer for date
 */
const DateCellRenderer = (params: ICellRendererParams) => {
  return (
    <span className="text-sm">
      {formatEventDate(params.value)}
    </span>
  )
}

/**
 * Custom cell renderer for time
 */
const TimeCellRenderer = (params: ICellRendererParams) => {
  return (
    <span className="text-sm">{params.value}</span>
  )
}

/**
 * Custom cell renderer for location
 */
const LocationCellRenderer = (params: ICellRendererParams) => {
  return (
    <span className="text-sm truncate" title={params.value}>
      {params.value}
    </span>
  )
}

/**
 * Custom cell renderer for category
 */
const CategoryCellRenderer = (params: ICellRendererParams) => {
  return (
    <span className="text-sm capitalize">{params.value}</span>
  )
}

/**
 * Custom cell renderer for field
 */
const FieldCellRenderer = (params: ICellRendererParams) => {
  return (
    <span className="text-sm truncate" title={params.value}>
      {params.value}
    </span>
  )
}

/**
 * Custom cell renderer for tags
 */
const TagsCellRenderer = (params: ICellRendererParams) => {
  const tags = params.value || []
  
  return (
    <div className="flex flex-wrap gap-1.5 min-w-0">
      {tags.slice(0, 2).map((tag: string, index: number) => (
        <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5 font-normal border-border">
          {tag}
        </Badge>
      ))}
      {tags.length > 2 && (
        <Badge variant="outline" className="text-xs px-1.5 py-0.5 font-normal border-border">
          +{tags.length - 2}
        </Badge>
      )}
    </div>
  )
}


/**
 * Professional AG Grid component for events dashboard
 * Provides advanced sorting, filtering, and pagination capabilities
 */
export function EventsAGGrid({
  events,
  onEventClick,
  loading = false,
  height = 600,
  enablePagination = true,
  pageSize = 25,
  enableSorting = true,
  enableFiltering = true,
  enableColumnResizing = true,
  showLoadingOverlay = true
}: EventsAGGridProps) {
  const gridRef = useRef<AgGridReact>(null)

  // Column definitions with professional styling and functionality
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Event',
      headerComponent: () => (
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-[color:var(--ag-accent-color)]" />
          <span>Event</span>
        </div>
      ),
      field: 'title',
      cellRenderer: TitleCellRenderer,
      sortable: enableSorting,
      filter: enableFiltering ? 'agTextColumnFilter' : false,
      filterParams: {
        filterOptions: ['contains', 'startsWith', 'endsWith'],
        suppressAndOrCondition: true,
      },
      flex: 2,
      minWidth: 200,
      resizable: enableColumnResizing,
      pinned: 'left', // Pin title column for better UX
    },
    {
      headerName: 'Date',
      headerComponent: () => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[color:var(--ag-accent-color)]" />
          <span>Date</span>
        </div>
      ),
      field: 'date',
      cellRenderer: DateCellRenderer,
      sortable: enableSorting,
      filter: enableFiltering ? 'agDateColumnFilter' : false,
      width: 160,
      resizable: enableColumnResizing,
    },
    {
      headerName: 'Time',
      headerComponent: () => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[color:var(--ag-accent-color)]" />
          <span>Time</span>
        </div>
      ),
      field: 'time',
      cellRenderer: TimeCellRenderer,
      sortable: enableSorting,
      filter: enableFiltering ? 'agTextColumnFilter' : false,
      width: 130,
      resizable: enableColumnResizing,
    },
    {
      headerName: 'Location',
      headerComponent: () => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[color:var(--ag-accent-color)]" />
          <span>Location</span>
        </div>
      ),
      field: 'location',
      cellRenderer: LocationCellRenderer,
      sortable: enableSorting,
      filter: enableFiltering ? 'agTextColumnFilter' : false,
      flex: 1,
      minWidth: 150,
      resizable: enableColumnResizing,
    },
    {
      headerName: 'Category',
      headerComponent: () => (
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[color:var(--ag-accent-color)]" />
          <span>Category</span>
        </div>
      ),
      field: 'category',
      cellRenderer: CategoryCellRenderer,
      sortable: enableSorting,
      filter: enableFiltering ? 'agTextColumnFilter' : false,
      width: 130,
      resizable: enableColumnResizing,
    },
    {
      headerName: 'Field',
      headerComponent: () => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[color:var(--ag-accent-color)]" />
          <span>Field</span>
        </div>
      ),
      field: 'field',
      cellRenderer: FieldCellRenderer,
      sortable: enableSorting,
      filter: enableFiltering ? 'agTextColumnFilter' : false,
      flex: 1,
      minWidth: 120,
      resizable: enableColumnResizing,
    },
    {
      headerName: 'Tags',
      headerComponent: () => (
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[color:var(--ag-accent-color)]" />
          <span>Tags</span>
        </div>
      ),
      field: 'tags',
      cellRenderer: TagsCellRenderer,
      sortable: false,
      filter: false,
      width: 150,
      resizable: enableColumnResizing,
    },
  ], [enableSorting, enableFiltering, enableColumnResizing])

  // Grid ready event handler
  const onGridReady = useCallback((params: GridReadyEvent) => {
    // Auto-size columns to fit content
    params.api.sizeColumnsToFit()
    
    // Set initial sort (by date ascending) - using applyColumnState for AG Grid v31+
    params.api.applyColumnState({
      state: [{ colId: 'date', sort: 'asc' }],
      defaultState: { sort: null }
    })
  }, [])

  // Default column definitions
  const defaultColDef: ColDef = useMemo(() => ({
    sortable: enableSorting,
    filter: enableFiltering,
    resizable: enableColumnResizing,
  }), [enableSorting, enableFiltering, enableColumnResizing])

  // Loading overlay component
  const loadingOverlayComponent = useMemo(() => {
    const LoadingOverlay = () => (
      <div className="flex items-center justify-center gap-3">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span>Loading events...</span>
      </div>
    )
    LoadingOverlay.displayName = 'LoadingOverlay'
    return LoadingOverlay
  }, [])

  // No rows overlay component
  const noRowsOverlayComponent = useMemo(() => {
    const NoRowsOverlay = () => (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-4 opacity-50">
          <svg
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium mb-2">No events found</p>
        <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
      </div>
    )
    NoRowsOverlay.displayName = 'NoRowsOverlay'
    return NoRowsOverlay
  }, [])

  return (
    <div className="w-full">
      <div 
        className="ag-theme-alpine ag-theme-student-events" 
        style={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={events}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          
          // Pagination settings
          pagination={enablePagination}
          paginationPageSize={pageSize}
          paginationPageSizeSelector={enablePagination ? [10, 25, 50, 100] : false}
          
          // Loading and overlay settings
          loading={loading}
          loadingOverlayComponent={showLoadingOverlay ? loadingOverlayComponent : undefined}
          noRowsOverlayComponent={noRowsOverlayComponent}
          
          // Performance settings
          suppressRowClickSelection={true}
          suppressCellFocus={true}
          enableCellTextSelection={true}
          
          // Animation settings
          animateRows={true}
          
          // Context for cell renderers
          context={{
            onEventClick
          }}
          
          // Accessibility
          getRowId={(params) => params.data.id}
          
          // Responsive settings
          suppressHorizontalScroll={false}
          suppressColumnVirtualisation={false}
          suppressRowVirtualisation={false}
          
          // Theme settings - use legacy theme
          theme="legacy"
          
          // Additional professional features (community only)
          suppressMenuHide={false}
          suppressMovableColumns={false}
        />
      </div>
    </div>
  )
}

/**
 * Export individual cell renderers for potential reuse
 */
export {
  TitleCellRenderer,
  DateCellRenderer,
  TimeCellRenderer,
  LocationCellRenderer,
  CategoryCellRenderer,
  FieldCellRenderer,
  TagsCellRenderer
}
