'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
  ColDef,
  CellValueChangedEvent,
  GridApi,
  GridReadyEvent,
  SelectionChangedEvent,
} from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { Event } from '@/types/event'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'

interface AGGridEventsTableProps {
  events: Event[]
  onAddEvent: (eventData: Partial<Event>) => Promise<Event | null>
  onUpdateEvent: (id: string, eventData: Partial<Event>) => Promise<Event | null>
  onDeleteEvent: (id: string) => Promise<boolean>
}

export function AGGridEventsTable({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}: AGGridEventsTableProps) {
  const [gridApi, setGridApi] = useState<GridApi<Event> | null>(null)
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([])
  const [quickFilterText, setQuickFilterText] = useState('')

  const columnDefs = useMemo<ColDef<Event>[]>(
    () => [
      {
        headerName: 'Name',
        field: 'name',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: true,
        flex: 2,
        minWidth: 200,
      },
      {
        headerName: 'Type',
        field: 'type',
        editable: true,
        flex: 1,
        minWidth: 120,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['olympiads', 'contests', 'events', 'workshops'],
        },
      },
      {
        headerName: 'Status',
        field: 'status',
        editable: true,
        flex: 1,
        minWidth: 120,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['draft', 'published', 'cancelled'],
        },
      },
      {
        headerName: 'From',
        field: 'fromDate',
        editable: true,
        flex: 1,
        minWidth: 120,
      },
      {
        headerName: 'To',
        field: 'toDate',
        editable: true,
        flex: 1,
        minWidth: 120,
      },
      {
        headerName: 'Location',
        field: 'location',
        editable: true,
        flex: 1.5,
        minWidth: 150,
      },
      {
        headerName: 'Country',
        field: 'country',
        editable: true,
        flex: 1,
        minWidth: 120,
      },
      {
        headerName: 'Organizer',
        field: 'organizer',
        editable: true,
        flex: 1.5,
        minWidth: 150,
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
  
  const handleAddRow = useCallback(async () => {
    const newEvent = {
        name: 'New Event',
        description: 'Description',
        type: 'events' as Event['type'],
        status: 'draft' as Event['status'],
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0],
        location: 'Location',
        country: 'Country',
        organizer: 'Organizer',
    };
    const createdEvent = await onAddEvent(newEvent);
    if (createdEvent && gridApi) {
        gridApi.applyTransaction({ add: [createdEvent] });
    }
  }, [onAddEvent, gridApi])

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


  return (
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
          <Button size="sm" onClick={handleAddRow}>
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
          rowSelection="multiple"
          suppressRowClickSelection={true}
          quickFilterText={quickFilterText}
        />
      </div>
    </div>
  )
}
