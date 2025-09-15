'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CompactAgeFilterDropdown } from '@/components/ui/age-filter-dropdown'
import { CompactDashboardViewSelector, DashboardViewMode } from '@/components/dashboard/dashboard-view-selector'

/**
 * Props for the mobile filters component
 */
interface MobileFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  categories: Array<{ value: string; label: string; icon: React.ComponentType<{ className?: string }> }>
  selectedDate?: string
  onDateChange?: (value: string) => void
  selectedAgeRange?: [number, number]
  onAgeRangeChange?: (value: [number, number]) => void
  selectedRegion?: string
  onRegionChange?: (value: string) => void
  selectedField?: string
  onFieldChange?: (value: string) => void
  viewMode?: DashboardViewMode
  onViewModeChange?: (mode: DashboardViewMode) => void
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
  selectedCategory,
  onCategoryChange,
  categories,
  selectedDate = 'all',
  onDateChange = () => {},
  selectedAgeRange = [0, 99],
  onAgeRangeChange = () => {},
  selectedRegion = 'all',
  onRegionChange = () => {},
  selectedField = 'all',
  onFieldChange = () => {},
  viewMode = 'grid',
  onViewModeChange = () => {},
  sortBy = 'date-asc',
  onSortChange = () => {}
}: MobileFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'this-week', label: 'This Week' },
    { value: 'next-week', label: 'Next Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'next-month', label: 'Next Month' }
  ]

  const regionOptions = [
    { value: 'all', label: 'All Regions' },
    { value: 'zurich', label: 'Zurich' },
    { value: 'bern', label: 'Bern' },
    { value: 'basel', label: 'Basel' },
    { value: 'lausanne', label: 'Lausanne' },
    { value: 'geneva', label: 'Geneva' },
    { value: 'lucerne', label: 'Lucerne' },
    { value: 'st-gallen', label: 'St. Gallen' },
    { value: 'international', label: 'International' }
  ]

  const fieldOptions = [
    { value: 'all', label: 'All Fields' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'philosophy', label: 'Philosophy' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'medicine', label: 'Medicine' },
    { value: 'business', label: 'Business' },
    { value: 'economics', label: 'Economics' },
    { value: 'psychology', label: 'Psychology' }
  ]

  const sortOptions = [
    { value: 'date-asc', label: 'Date (Earliest First)' },
    { value: 'date-desc', label: 'Date (Latest First)' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
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
      {/* View Mode Section */}
      <div className="space-y-3">
        <span className="text-sm font-medium text-muted-foreground">View Mode</span>
        <CompactDashboardViewSelector
          currentView={viewMode}
          onViewChange={onViewModeChange}
          className="w-full"
        />
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
            <label className="text-sm font-medium text-muted-foreground">Category</label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {category.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Date Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Date</label>
            <Select value={selectedDate} onValueChange={onDateChange}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <label className="text-sm font-medium text-muted-foreground">Region</label>
            <Select value={selectedRegion} onValueChange={onRegionChange}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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

          {/* View Mode Selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              View Mode
            </label>
            <CompactDashboardViewSelector
              currentView={viewMode}
              onViewChange={onViewModeChange}
            />
          </div>
          </div>
        )}
      </div>
    </div>
  )
}
