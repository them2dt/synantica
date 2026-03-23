'use client'

import { useState } from 'react'
import { Grid3X3, List, SlidersHorizontal, ChevronDown } from 'lucide-react'
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
import { getAllCountries } from '@/lib/utils/country-flags'

export type SortOption = 'date-asc' | 'date-desc' | 'name-asc' | 'recently-added'
export type DateRangeOption = 'all' | 'this-month' | 'next-3-months' | 'this-year' | 'past'
export type AgeOption = 'all' | 'under-14' | '14-18' | '18-plus'

interface FiltersTopBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedType: string
  onTypeChange: (value: string) => void
  eventTypes: CategoryWithIcon[]
  isListView?: boolean
  onViewChange?: (isList: boolean) => void
  // Advanced filters
  selectedSort: SortOption
  onSortChange: (value: SortOption) => void
  selectedCountry: string
  onCountryChange: (value: string) => void
  selectedDateRange: DateRangeOption
  onDateRangeChange: (value: DateRangeOption) => void
  selectedAge: AgeOption
  onAgeChange: (value: AgeOption) => void
  activeFilterCount: number
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'date-asc', label: 'Date: Soonest first' },
  { value: 'date-desc', label: 'Date: Latest first' },
  { value: 'name-asc', label: 'Name: A → Z' },
  { value: 'recently-added', label: 'Recently added' },
]

const DATE_RANGE_OPTIONS: { value: DateRangeOption; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'this-month', label: 'This month' },
  { value: 'next-3-months', label: 'Next 3 months' },
  { value: 'this-year', label: 'This year' },
  { value: 'past', label: 'Past events' },
]

const AGE_OPTIONS: { value: AgeOption; label: string }[] = [
  { value: 'all', label: 'All ages' },
  { value: 'under-14', label: 'Under 14' },
  { value: '14-18', label: '14 – 18' },
  { value: '18-plus', label: '18+' },
]

const countries = getAllCountries()

export function FiltersTopBar({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  eventTypes,
  isListView = false,
  onViewChange = () => {},
  selectedSort,
  onSortChange,
  selectedCountry,
  onCountryChange,
  selectedDateRange,
  onDateRangeChange,
  selectedAge,
  onAgeChange,
  activeFilterCount,
}: FiltersTopBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div>
      {/* Primary row */}
      <div className="flex flex-col md:flex-row">
        {/* Search */}
        <div className="flex-[2] border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex items-center h-14">
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-4 h-full w-full"
          />
        </div>

        {/* Type */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex items-center h-14">
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="border-0 focus:ring-0 text-sm h-full px-4 shadow-none w-full">
              <SelectValue placeholder="All Activities" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-slate-200 shadow-sm">
              {eventTypes.map((eventType) => (
                <SelectItem key={eventType.value} value={eventType.value} className="rounded-none focus:bg-slate-100 p-3">
                  <div className="flex items-center gap-3">
                    <eventType.icon className="w-4 h-4 text-slate-400 shrink-0" />
                    <ThemedText variant="sm">{eventType.label}</ThemedText>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex items-center h-14">
          <Select value={selectedSort} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger className="border-0 focus:ring-0 text-sm h-full px-4 shadow-none w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none border-slate-200 shadow-sm">
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="rounded-none focus:bg-slate-100 p-3">
                  <ThemedText variant="sm">{opt.label}</ThemedText>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* More filters + view toggles */}
        <div className="flex flex-row h-14">
          {/* More Filters button */}
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className={`flex items-center gap-1.5 px-4 border-r border-slate-200 dark:border-slate-800 text-sm transition-colors ${
              showAdvanced || activeFilterCount > 0
                ? 'bg-slate-950 dark:bg-slate-50 text-slate-50 dark:text-slate-950'
                : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
            aria-label="More filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline text-xs whitespace-nowrap">
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>

          {/* Grid */}
          <button
            onClick={() => onViewChange(false)}
            className={`w-12 border-r border-slate-200 dark:border-slate-800 flex items-center justify-center transition-colors ${
              !isListView ? 'bg-slate-100 dark:bg-slate-900' : 'hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
            aria-label="Grid view"
          >
            <Grid3X3 className={`w-4 h-4 ${!isListView ? 'text-slate-950 dark:text-slate-50' : 'text-slate-300 dark:text-slate-700'}`} />
          </button>

          {/* List */}
          <button
            onClick={() => onViewChange(true)}
            className={`w-12 flex items-center justify-center transition-colors ${
              isListView ? 'bg-slate-100 dark:bg-slate-900' : 'hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
            aria-label="List view"
          >
            <List className={`w-4 h-4 ${isListView ? 'text-slate-950 dark:text-slate-50' : 'text-slate-300 dark:text-slate-700'}`} />
          </button>
        </div>
      </div>

      {/* Advanced filter row */}
      {showAdvanced && (
        <div className="border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row bg-slate-50 dark:bg-slate-900/50">
          {/* Country */}
          <div className="flex-1 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800 h-12">
            <Select value={selectedCountry} onValueChange={onCountryChange}>
              <SelectTrigger className="border-0 focus:ring-0 text-sm h-full px-4 shadow-none w-full">
                <SelectValue placeholder="All countries" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-slate-200 shadow-sm max-h-64">
                <SelectItem value="all" className="rounded-none focus:bg-slate-100 p-3">
                  <ThemedText variant="sm">🌍 All countries</ThemedText>
                </SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c.value} value={c.value} className="rounded-none focus:bg-slate-100 p-3">
                    <ThemedText variant="sm">{c.flag} {c.label}</ThemedText>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date range */}
          <div className="flex-1 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800 h-12">
            <Select value={selectedDateRange} onValueChange={(v) => onDateRangeChange(v as DateRangeOption)}>
              <SelectTrigger className="border-0 focus:ring-0 text-sm h-full px-4 shadow-none w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-none border-slate-200 shadow-sm">
                {DATE_RANGE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="rounded-none focus:bg-slate-100 p-3">
                    <ThemedText variant="sm">{opt.label}</ThemedText>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Age */}
          <div className="flex-1 h-12">
            <Select value={selectedAge} onValueChange={(v) => onAgeChange(v as AgeOption)}>
              <SelectTrigger className="border-0 focus:ring-0 text-sm h-full px-4 shadow-none w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-none border-slate-200 shadow-sm">
                {AGE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="rounded-none focus:bg-slate-100 p-3">
                    <ThemedText variant="sm">{opt.label}</ThemedText>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
