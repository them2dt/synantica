'use client'

import { Search, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

/**
 * Props for the filters sidebar component
 */
interface FiltersSidebarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  categories: Array<{ value: string; label: string; icon: React.ComponentType<{ className?: string }> }>
}

/**
 * Filters sidebar component with search and category filtering
 */
export function FiltersSidebar({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories
}: FiltersSidebarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div>
                                <label className="text-sm font-medium mb-2 block">Category</label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue />
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
      </CardContent>
    </Card>
  )
}
