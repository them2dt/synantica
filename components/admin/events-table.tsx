'use client'

import { useState } from 'react'
import { Event } from '@/types/event'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatEventDate } from '@/lib/utils/date-formatting'
import { Plus, Search, Trash2 } from 'lucide-react'
import { EventEditModal } from './event-edit-modal'

interface EventsTableProps {
    events: Event[]
    onAddEvent: (eventData: Partial<Event>) => Promise<Event | null>
    onUpdateEvent: (id: string, eventData: Partial<Event>) => Promise<Event | null>
    onDeleteEvent: (id: string) => Promise<boolean>
}

export function EventsTable({
    events,
    onAddEvent,
    onUpdateEvent,
    onDeleteEvent,
}: EventsTableProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'edit' | 'create'>('edit')
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Filter events based on search query
    const filteredEvents = events.filter((event) => {
        const query = searchQuery.toLowerCase()
        return (
            event.name.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query) ||
            event.organizer.toLowerCase().includes(query) ||
            event.location.toLowerCase().includes(query) ||
            event.country.toLowerCase().includes(query)
        )
    })

    const handleRowClick = (event: Event) => {
        setSelectedEvent(event)
        setModalMode('edit')
        setIsModalOpen(true)
    }

    const handleCreateNew = () => {
        setSelectedEvent(null)
        setModalMode('create')
        setIsModalOpen(true)
    }

    const handleSave = async (id: string, data: Partial<Event>) => {
        if (modalMode === 'edit') {
            await onUpdateEvent(id, data)
        } else {
            await onAddEvent(data)
        }
        setIsModalOpen(false)
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation() // Prevent row click
        if (confirm('Are you sure you want to delete this event?')) {
            await onDeleteEvent(id)
        }
    }

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return
        if (
            !confirm(
                `Are you sure you want to delete ${selectedIds.length} event(s)?`
            )
        )
            return
        for (const id of selectedIds) {
            await onDeleteEvent(id)
        }
        setSelectedIds([])
    }

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        )
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredEvents.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(filteredEvents.map((e) => e.id))
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'bg-emerald-500/15 text-emerald-600'
            case 'draft':
                return 'bg-amber-100 text-amber-800'
            case 'cancelled':
                return 'bg-red-50 text-red-600'
            default:
                return 'bg-slate-100 text-slate-600'
        }
    }

    const getTypeColor = (type: string) => {
        return 'bg-slate-100 text-slate-600'
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {selectedIds.length > 0 && (
                        <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedIds.length})
                        </Button>
                    )}
                    <Button size="sm" onClick={handleCreateNew}>
                        <Plus className="mr-2 h-4 w-4" /> Add Event
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="border border-slate-200 rounded-none overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedIds.length === filteredEvents.length &&
                                            filteredEvents.length > 0
                                        }
                                        onChange={toggleSelectAll}
                                        className="rounded-none border-slate-200"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-sm text-slate-500">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left text-sm text-slate-500">
                                    Type
                                </th>
                                <th className="px-4 py-3 text-left text-sm text-slate-500">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-sm text-slate-500">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-left text-sm text-slate-500">
                                    Location
                                </th>
                                <th className="px-4 py-3 text-left text-sm text-slate-500">
                                    Organizer
                                </th>
                                <th className="px-4 py-3 text-left text-sm text-slate-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredEvents.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-4 py-8 text-center text-slate-500"
                                    >
                                        {searchQuery
                                            ? 'No events found matching your search'
                                            : 'No events yet. Create your first event!'}
                                    </td>
                                </tr>
                            ) : (
                                filteredEvents.map((event) => (
                                    <tr
                                        key={event.id}
                                        onClick={() => handleRowClick(event)}
                                        className="hover:bg-slate-50/40 cursor-pointer transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(event.id)}
                                                onChange={() => toggleSelection(event.id)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="rounded-none border-slate-200"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-neutral-950">{event.name}</div>
                                            <div className="text-sm text-slate-500 truncate max-w-xs">
                                                {event.description}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="secondary" className={getTypeColor(event.type)}>
                                                {event.type}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="secondary" className={getStatusColor(event.status)}>
                                                {event.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            <div>{formatEventDate(event.fromDate, 'date-only')}</div>
                                            {event.fromDate !== event.toDate && (
                                                <div className="text-xs text-slate-500">
                                                    to {formatEventDate(event.toDate, 'date-only')}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            <div>{event.location}</div>
                                            <div className="text-xs text-slate-500">
                                                {event.country}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {event.organizer}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => handleDelete(event.id, e)}
                                                className="text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Results count */}
            <div className="text-sm text-slate-500">
                Showing {filteredEvents.length} of {events.length} events
            </div>
            {/* Edit Modal */}
            <EventEditModal
                event={selectedEvent}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                mode={modalMode}
            />
        </div>
    )
}
