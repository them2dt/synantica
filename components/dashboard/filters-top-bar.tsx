'use client'

import { Grid3X3, List, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ThemedText } from '@/components/ui/themed-text'
import { CategoryWithIcon } from '@/types/category'

interface FiltersTopBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedType: string
  onTypeChange: (value: string) => void
  eventTypes: CategoryWithIcon[]
  isListView?: boolean
  onViewChange?: (isList: boolean) => void
  onAddEventClick?: () => void
}

export function FiltersTopBar({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  eventTypes,
  isListView = false,
  onViewChange = () => { },
  onAddEventClick,
}: FiltersTopBarProps) {
  // Minimal setup: We only use search and type internally for this lean redesign


  return (
    <div className="flex flex-col md:flex-row">
      {/* Search Cell */}
      <div className="flex-[2] border-b md:border-b-0 md:border-r border-slate-200 flex items-center h-16 md:h-auto">
        <Input
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-0 text-sm sm:text-base focus-visible:ring-0 focus-visible:ring-offset-0 p-4 h-full w-full"
        />
      </div>

      {/* Category Cell */}
      <div className="flex-[1.5] border-b md:border-b-0 md:border-r border-slate-200 flex items-center h-16 md:h-auto">
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="border-0 focus:ring-0 text-sm sm:text-base h-full p-4 shadow-none w-full border-none outline-none focus:outline-none focus:bg-transparent">
            <SelectValue placeholder="All Activities" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-slate-200 shadow-sm">
            {eventTypes.map((eventType) => {
              return (
                <SelectItem key={eventType.value} value={eventType.value} className="rounded-none focus:bg-slate-100 p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <eventType.icon className="w-5 h-5 text-slate-400 shrink-0" />
                    <ThemedText variant="base">{eventType.label}</ThemedText>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons Group */}
      <div className="flex flex-row h-16 md:h-auto">
        {/* Grid View Toggle Cell */}
        <button
          onClick={() => onViewChange(false)}
          className={`flex-1 md:w-16 border-r border-slate-200 flex items-center justify-center transition-colors ${!isListView ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
          aria-label="Grid view"
        >
          <Grid3X3 className={`w-5 h-5 ${!isListView ? 'text-slate-950' : 'text-slate-300'}`} />
        </button>

        {/* List View Toggle Cell */}
        <button
          onClick={() => onViewChange(true)}
          className={`flex-1 md:w-16 flex items-center justify-center transition-colors ${isListView ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
          aria-label="List view"
        >
          <List className={`w-5 h-5 ${isListView ? 'text-slate-950' : 'text-slate-300'}`} />
        </button>
      </div>
    </div>
  )
}
