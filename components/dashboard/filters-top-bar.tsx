'use client'

import { Search, Grid3X3, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

import { DateRange } from 'react-day-picker'

interface FiltersTopBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedType: string
  onTypeChange: (value: string) => void
  eventTypes: Array<{ value: string; label: string; icon: React.ComponentType<{ className?: string }> }>
  selectedDateRange?: DateRange
  onDateRangeChange?: (range: DateRange | undefined) => void
  selectedAgeRange?: [number, number]
  onAgeRangeChange?: (value: [number, number]) => void
  selectedCountry?: string
  onCountryChange?: (value: string) => void
  selectedField?: string
  onFieldChange?: (value: string) => void
  isListView?: boolean
  onViewChange?: (isList: boolean) => void
  sortBy?: string
  onSortChange?: (value: string) => void
}

export function FiltersTopBar({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  eventTypes,
  selectedDateRange,
  onDateRangeChange = () => { },
  selectedAgeRange = [0, 99],
  onAgeRangeChange = () => { },
  selectedCountry = 'all',
  onCountryChange = () => { },
  selectedField = 'all',
  onFieldChange = () => { },
  isListView = false,
  onViewChange = () => { },
  sortBy = 'date-asc',
  onSortChange = () => { },
}: FiltersTopBarProps) {
  // Minimal setup: We only use search and type internally for this lean redesign


  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search by title, location, or organizers..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 border-0 border-b border-slate-200 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-slate-950 px-0 h-10 shadow-none text-lg"
        />
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-40 border-0 border-b border-slate-200 rounded-none bg-transparent focus:ring-0 px-0 shadow-none">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-slate-200 shadow-sm">
            {eventTypes.map((eventType) => {
              const Icon = eventType.icon
              return (
                <SelectItem key={eventType.value} value={eventType.value} className="rounded-none focus:bg-slate-100">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-500" />
                    {eventType.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1">
          <Button
            variant={!isListView ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange(false)}
            className="h-8 px-2 rounded-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={isListView ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange(true)}
            className="h-8 px-2 rounded-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
