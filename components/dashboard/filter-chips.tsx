'use client'

import { X } from 'lucide-react'
import { ThemedText } from '@/components/ui/themed-text'

export interface ActiveFilter {
  key: string
  label: string
}

interface FilterChipsProps {
  filters: ActiveFilter[]
  onRemove: (key: string) => void
  onClearAll: () => void
}

export function FilterChips({ filters, onRemove, onClearAll }: FilterChipsProps) {
  if (filters.length === 0) return null

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center gap-2 flex-wrap bg-slate-50 dark:bg-slate-950">
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1"
        >
          {filter.label}
          <button
            onClick={() => onRemove(filter.key)}
            className="hover:text-slate-950 dark:hover:text-slate-50 transition-colors"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      {filters.length >= 2 && (
        <button
          onClick={onClearAll}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors underline"
        >
          Clear all
        </button>
      )}
      <ThemedText variant="xs" color="muted" className="ml-auto">
        {filters.length} filter{filters.length > 1 ? 's' : ''} active
      </ThemedText>
    </div>
  )
}
