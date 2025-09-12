'use client'

import { useState } from 'react'
import { Search, Filter, ChevronDown, ChevronUp, Grid3X3, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { CompactAgeFilterDropdown } from '@/components/ui/age-filter-dropdown'

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
  isListView = false,
  onViewChange = () => {},
  sortBy = 'date-asc',
  onSortChange = () => {}
}: MobileFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null)

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

  const filterSections = [
    {
      id: 'category',
      label: 'Category',
      icon: Filter,
      content: (
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
      )
    },
    {
      id: 'date',
      label: 'Date',
      icon: Filter,
      content: (
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
      )
    },
    {
      id: 'age',
      label: 'Age Range',
      icon: Filter,
      content: (
        <CompactAgeFilterDropdown
          value={selectedAgeRange}
          onChange={onAgeRangeChange}
          min={0}
          max={99}
          placeholder="Select age range"
          className="w-full h-12"
        />
      )
    },
    {
      id: 'region',
      label: 'Region',
      icon: Filter,
      content: (
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
      )
    },
    {
      id: 'field',
      label: 'Field',
      icon: Filter,
      content: (
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
      )
    },
    {
      id: 'sort',
      label: 'Sort By',
      icon: Filter,
      content: (
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
      )
    }
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

      {/* Filters Collapsible */}
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-12 justify-between touch-manipulation"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </div>
            {isFiltersOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-3 mt-3">
          {filterSections.map((section) => (
            <Collapsible
              key={section.id}
              open={activeFilterSection === section.id}
              onOpenChange={(open) => setActiveFilterSection(open ? section.id : null)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full h-12 justify-between touch-manipulation"
                >
                  <div className="flex items-center gap-2">
                    <section.icon className="h-4 w-4" />
                    <span>{section.label}</span>
                  </div>
                  {activeFilterSection === section.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-2">
                <div className="p-3 bg-muted/50 rounded-lg">
                  {section.content}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Quick Filter Chips */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-muted-foreground">Quick Filters</span>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange('all')}
            className="h-8 touch-manipulation"
          >
            All Events
          </Button>
          <Button
            variant={selectedDate === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onDateChange('today')}
            className="h-8 touch-manipulation"
          >
            Today
          </Button>
          <Button
            variant={selectedDate === 'this-week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onDateChange('this-week')}
            className="h-8 touch-manipulation"
          >
            This Week
          </Button>
          <Button
            variant={selectedRegion === 'zurich' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRegionChange('zurich')}
            className="h-8 touch-manipulation"
          >
            Zurich
          </Button>
        </div>
      </div>
    </div>
  )
}
