'use client'

import { Search, Grid3X3, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CompactAgeFilterDropdown } from '@/components/ui/age-filter-dropdown'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { MobileFilters } from '@/components/dashboard/mobile-filters'
import { getAllCountries } from '@/lib/utils/country-flags'
import { DateRange } from 'react-day-picker'

/**
 * Props for the filters top bar component
 */
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

/**
 * Filters top bar component with search and category filtering
 * Displays filters horizontally at the top of the dashboard
 */
export function FiltersTopBar({
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
}: FiltersTopBarProps) {



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
    <div className="space-y-6">
      {/* Desktop Filters */}
      <div className="hidden md:block space-y-6">
        <div className="rounded-none border border-border bg-card p-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Controls Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Left Side - Sorter and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Sorter - First */}
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-52 [&>svg]:hidden">
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

              {/* Filter Options */}
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={selectedType} onValueChange={onTypeChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Type" />
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

                  <DateRangePicker
                    value={selectedDateRange}
                    onChange={onDateRangeChange}
                    placeholder="Select date range"
                    className="w-48 max-w-48"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <CompactAgeFilterDropdown
                    value={selectedAgeRange}
                    onChange={onAgeRangeChange}
                    min={0}
                    max={99}
                    placeholder="Age"
                    className="w-32"
                  />

                  <Select value={selectedCountry} onValueChange={onCountryChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Country" />
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

                  <Select value={selectedField} onValueChange={onFieldChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Field" />
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
              </div>
            </div>

            {/* Right Side - View Toggle */}
            <div className="flex items-center gap-1 rounded-none border border-border bg-background p-1">
              <Button
                variant={!isListView ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange(false)}
                className="h-8 px-3"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={isListView ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange(true)}
                className="h-8 px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <MobileFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectedType={selectedType}
        onTypeChange={onTypeChange}
        eventTypes={eventTypes}
        selectedDateRange={selectedDateRange}
        onDateRangeChange={onDateRangeChange}
        selectedAgeRange={selectedAgeRange}
        onAgeRangeChange={onAgeRangeChange}
        selectedCountry={selectedCountry}
        onCountryChange={onCountryChange}
        selectedField={selectedField}
        onFieldChange={onFieldChange}
        isListView={isListView}
        onViewChange={onViewChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
      />
    </div>
  )
}
