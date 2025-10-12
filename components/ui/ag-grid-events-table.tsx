'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
  ColDef,
  CellValueChangedEvent,
  GridApi,
  GridReadyEvent,
  SelectionChangedEvent,
  RowDoubleClickedEvent,
} from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { Event, EventStatus } from '@/types/event'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Edit } from 'lucide-react'
import { EventEditModal } from '@/components/admin/event-edit-modal'

/**
 * Props for the AGGridEventsTable component
 * 
 * @interface AGGridEventsTableProps
 */
interface AGGridEventsTableProps {
  /** Array of events to display in the table */
  events: Event[]
  /** Callback function to add a new event */
  onAddEvent: (eventData: Partial<Event>) => Promise<Event | null>
  /** Callback function to update an existing event */
  onUpdateEvent: (id: string, eventData: Partial<Event>) => Promise<Event | null>
  /** Callback function to delete an event */
  onDeleteEvent: (id: string) => Promise<boolean>
}

/**
 * AGGridEventsTable - Admin events management table component
 * 
 * This component provides a full-featured data grid for managing events in the admin panel.
 * It includes inline editing, sorting, filtering, bulk operations, and CRUD functionality.
 * 
 * @param {AGGridEventsTableProps} props - Component props
 * @returns {JSX.Element} The rendered events table
 * 
 * @features
 * - Inline editing of event properties
 * - Sorting and filtering capabilities
 * - Bulk selection and deletion
 * - Quick search/filter
 * - Add new events
 * - Real-time updates
 * 
 * @example
 * ```tsx
 * <AGGridEventsTable
 *   events={events}
 *   onAddEvent={handleAddEvent}
 *   onUpdateEvent={handleUpdateEvent}
 *   onDeleteEvent={handleDeleteEvent}
 * />
 * ```
 */
export function AGGridEventsTable({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}: AGGridEventsTableProps) {
  /** AG-Grid API instance for programmatic control */
  const [gridApi, setGridApi] = useState<GridApi<Event> | null>(null)
  /** Array of selected event IDs for bulk operations */
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([])
  /** Quick filter text for searching events */
  const [quickFilterText, setQuickFilterText] = useState('')
  /** Edit modal state */
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const handleOpenEditModal = useCallback((event: Event | null) => {
    setEditingEvent(event)
    setEditModalOpen(true)
  }, [])

  const columnDefs = useMemo<ColDef<Event>[]>(
    () => [
      {
        headerName: '',
        field: undefined,
        width: 70,
        pinned: 'left',
        cellRenderer: (params: { data: Event }) => {
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingEvent(params.data)
                setEditModalOpen(true)
              }}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )
        },
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Name',
        field: 'name',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        flex: 3,
        minWidth: 250,
        pinned: 'left',
      },
      {
        headerName: 'Description',
        field: 'description',
        editable: false,
        flex: 4,
        minWidth: 400,
        cellRenderer: (params: { data: Event; value: string }) => {
          const desc = params.value || ''
          return (
            <div className="truncate" title={desc}>
              {desc.substring(0, 150)}{desc.length > 150 ? '...' : ''}
            </div>
          )
        },
      },
      {
        headerName: 'Type',
        field: 'type',
        editable: false,
        flex: 1.5,
        minWidth: 130,
        cellRenderer: (params: { data: Event; value: string }) => {
          const type = params.value || ''
          return (
            <span className="capitalize">
              {type}
            </span>
          )
        },
      },
      {
        headerName: 'Status',
        field: 'status',
        editable: false,
        flex: 1.5,
        minWidth: 130,
        cellStyle: (params: { value: string }) => {
          if (params.value === EventStatus.PUBLISHED) return { color: 'green', fontWeight: 'bold' }
          if (params.value === EventStatus.CANCELLED) return { color: 'red', fontWeight: 'bold' }
          return { color: 'gray', fontWeight: 'normal' }
        },
        cellRenderer: (params: { data: Event; value: string }) => {
          const status = params.value || ''
          return (
            <span className="capitalize">
              {status}
            </span>
          )
        },
      },
    ],
    []
  )

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  )

  const onGridReady = useCallback((params: GridReadyEvent<Event>) => {
    setGridApi(params.api)
  }, [])

  const onCellValueChanged = useCallback(
    async (event: CellValueChangedEvent<Event>) => {
      const updatedEventData = event.data
      if (updatedEventData.id) {
        await onUpdateEvent(updatedEventData.id, updatedEventData)
      }
    },
    [onUpdateEvent]
  )

  const onSelectionChanged = useCallback((event: SelectionChangedEvent<Event>) => {
    const selectedNodes = event.api.getSelectedNodes()
    const ids = selectedNodes.map((node) => node.data?.id).filter(Boolean) as string[]
    setSelectedEventIds(ids)
  }, [])

  const handleDeleteSelected = useCallback(async () => {
    if (selectedEventIds.length === 0) return
    if (
      !confirm(
        `Are you sure you want to delete ${selectedEventIds.length} event(s)?`
      )
    )
      return

    const deletePromises = selectedEventIds.map(id => onDeleteEvent(id));
    const results = await Promise.all(deletePromises);
    
    if (gridApi) {
        const successfulDeletes = selectedEventIds.filter((_, index) => results[index]);
        const rowsToRemove = events.filter(event => successfulDeletes.includes(event.id));
        gridApi.applyTransaction({ remove: rowsToRemove });
    }
    setSelectedEventIds([])
  }, [selectedEventIds, onDeleteEvent, gridApi, events])

  const handleSaveEvent = useCallback(async (eventData: Partial<Event>) => {
    if (editingEvent?.id) {
      // Update existing event
      await onUpdateEvent(editingEvent.id, eventData)
    } else {
      // Create new event
      await onAddEvent(eventData)
    }
  }, [editingEvent, onAddEvent, onUpdateEvent])

  const handleRowDoubleClick = useCallback((event: RowDoubleClickedEvent<Event>) => {
    if (event.data) {
      handleOpenEditModal(event.data)
    }
  }, [handleOpenEditModal])


  return (
    <>
      <div className="space-y-4 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <Input
            type="text"
            placeholder="Search..."
            value={quickFilterText}
            onChange={(e) => setQuickFilterText(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex items-center space-x-2">
            {selectedEventIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedEventIds.length})
              </Button>
            )}
            <Button size="sm" onClick={() => handleOpenEditModal(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </div>
        <div className="ag-theme-alpine flex-grow">
          <AgGridReact<Event>
            rowData={events}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onCellValueChanged={onCellValueChanged}
            onSelectionChanged={onSelectionChanged}
            onRowDoubleClicked={handleRowDoubleClick}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            quickFilterText={quickFilterText}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <EventEditModal
        event={editingEvent}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleSaveEvent}
      />
    </>
  )
}
