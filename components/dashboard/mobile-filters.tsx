'use client'

import { useState } from 'react'
import { Search, Grid3X3, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CompactAgeFilterDropdown } from '@/components/ui/age-filter-dropdown'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { getAllCountries } from '@/lib/utils/country-flags'
import { DateRange } from 'react-day-picker'

/**
 * Props for the mobile filters component
 */
interface MobileFiltersProps {
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

/**
 * Mobile-optimized filters component
 * Provides collapsible filter sections for better mobile UX
 */
export function MobileFilters({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  eventTypes,
  selectedDateRange,
  onDateRangeChange = () => {},
  selectedAgeRange = [0, 99],
  onAgeRangeChange = () => {},
  selectedCountry = 'all',
  onCountryChange = () => {},
  selectedField = 'all',
  onFieldChange = () => {},
  isListView = false,
  onViewChange = () => {},
  sortBy = 'date-asc',
  onSortChange = () => {}
}: MobileFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)


  const countryOptions = [
    { value: 'all', label: 'All Countries', flag: undefined },
    ...getAllCountries()
  ]

  const fieldOptions = [
    { value: 'all', label: 'All Fields' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'medicine', label: 'Medicine' },
    { value: 'business', label: 'Business' },
    { value: 'economics', label: 'Economics' },
    { value: 'psychology', label: 'Psychology' },
    { value: 'art', label: 'Art' },
    { value: 'design', label: 'Design' },
    { value: 'music', label: 'Music' },
    { value: 'literature', label: 'Literature' },
    { value: 'history', label: 'History' },
    { value: 'geography', label: 'Geography' },
    { value: 'sports', label: 'Sports' },
    { value: 'environment', label: 'Environment' },
    { value: 'technology', label: 'Technology' }
  ]

  const sortOptions = [
    { value: 'date-asc', label: 'Date (Earliest First)' },
    { value: 'date-desc', label: 'Date (Latest First)' },
    { value: 'title-asc', label: 'Name (A-Z)' },
    { value: 'title-desc', label: 'Name (Z-A)' },
    { value: 'age-asc', label: 'Min Age (Lowest First)' },
    { value: 'age-desc', label: 'Min Age (Highest First)' },
    { value: 'created-desc', label: 'Newest First' },
    { value: 'created-asc', label: 'Oldest First' }
  ]


  return (
    <div className="md:hidden space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* View Toggle */}
      <div className="space-y-3">
        <span className="text-sm font-medium text-muted-foreground">View Mode</span>
        <div className="flex gap-2">
          <Button
            variant={!isListView ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange(false)}
            className="flex-1 h-12 touch-manipulation"
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={isListView ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange(true)}
            className="flex-1 h-12 touch-manipulation"
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full h-12 justify-between touch-manipulation"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <span>Filters</span>
          <span className="text-sm text-muted-foreground">
            {isFiltersOpen ? 'Hide' : 'Show'}
          </span>
        </Button>

        {isFiltersOpen && (
          <div className="space-y-3 mt-3">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Event Type</label>
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((eventType) => {
                  const Icon = eventType.icon
                  return (
                    <SelectItem key={eventType.value} value={eventType.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {eventType.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Date Range</label>
            <DateRangePicker
              value={selectedDateRange}
              onChange={onDateRangeChange}
              placeholder="Select date range"
              className="w-full h-12"
            />
          </div>

          {/* Age Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Age Range</label>
            <CompactAgeFilterDropdown
              value={selectedAgeRange}
              onChange={onAgeRangeChange}
              min={0}
              max={99}
              placeholder="Select age range"
              className="w-full h-12"
            />
          </div>

          {/* Region Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Country</label>
            <Select value={selectedCountry} onValueChange={onCountryChange}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {countryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.flag && <span className="text-lg">{option.flag}</span>}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Field Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Field</label>
            <Select value={selectedField} onValueChange={onFieldChange}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {fieldOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Sort By</label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          </div>
        )}
      </div>
    </div>
  )
}
