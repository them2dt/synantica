'use client'

import { Search, Grid3X3, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

/**
 * Props for the filters top bar component
 */
interface FiltersTopBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  categories: Array<{ value: string; label: string; icon: React.ComponentType<{ className?: string }> }>
  selectedDate?: string
  onDateChange?: (value: string) => void
  selectedAge?: string
  onAgeChange?: (value: string) => void
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
 * Filters top bar component with search and category filtering
 * Displays filters horizontally at the top of the dashboard
 */
export function FiltersTopBar({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedDate = 'all',
  onDateChange = () => {},
  selectedAge = 'all',
  onAgeChange = () => {},
  selectedRegion = 'all',
  onRegionChange = () => {},
  selectedField = 'all',
  onFieldChange = () => {},
  isListView = false,
  onViewChange = () => {},
  sortBy = 'date-asc',
  onSortChange = () => {}
}: FiltersTopBarProps) {

  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'this-week', label: 'This Week' },
    { value: 'next-week', label: 'Next Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'next-month', label: 'Next Month' }
  ]

  const ageOptions = [
    { value: 'all', label: 'All Ages' },
    { value: '16-18', label: '16-18' },
    { value: '18-21', label: '18-21' },
    { value: '21-25', label: '21-25' },
    { value: '25-30', label: '25-30' },
    { value: '30+', label: '30+' }
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
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
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
            <SelectTrigger className="w-48">
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

          {/* Filter Options - Split up like the image */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* First Row of Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
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

              {/* Date Filter */}
              <Select value={selectedDate} onValueChange={onDateChange}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Date" />
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

            {/* Second Row of New Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Age Filter */}
              <Select value={selectedAge} onValueChange={onAgeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Age" />
                </SelectTrigger>
                <SelectContent>
                  {ageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Region Filter */}
              <Select value={selectedRegion} onValueChange={onRegionChange}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {regionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Field Filter */}
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

        {/* Right Side - View Switch */}
        <div className="flex items-center gap-2">
          <Grid3X3 className={`w-4 h-4 ${!isListView ? 'text-accent' : 'text-muted-foreground'}`} />
          <Switch
            checked={isListView}
            onCheckedChange={onViewChange}
          />
          <List className={`w-4 h-4 ${isListView ? 'text-accent' : 'text-muted-foreground'}`} />
        </div>
      </div>
    </div>
  )
}
