/**
 * Category-related types and interfaces
 */

/**
 * Event category interface
 */
export interface EventCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

/**
 * Tag interface
 */
export interface Tag {
  id: string
  name: string
  slug: string
  color?: string
  usageCount: number
  createdAt: string
  updatedAt: string
}

/**
 * Category with icon component type
 * Used in components that need to render category icons
 */
export interface CategoryWithIcon {
  value: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

/**
 * Common event categories
 */
export const EVENT_CATEGORIES = [
  'hackathon',
  'workshop',
  'seminar',
  'conference',
  'networking',
  'social',
  'sports',
  'cultural',
  'academic',
  'career',
  'volunteer',
  'other'
] as const

export type EventCategoryType = typeof EVENT_CATEGORIES[number]

/**
 * Common event subjects/topics
 */
export const EVENT_SUBJECTS = [
  'computer-science',
  'business',
  'engineering',
  'design',
  'marketing',
  'data-science',
  'artificial-intelligence',
  'cybersecurity',
  'web-development',
  'mobile-development',
  'blockchain',
  'startup',
  'entrepreneurship',
  'leadership',
  'communication',
  'other'
] as const

export type EventSubjectType = typeof EVENT_SUBJECTS[number]

/**
 * Date filter options
 */
export const DATE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'this-week', label: 'This Week' },
  { value: 'next-week', label: 'Next Week' },
  { value: 'this-month', label: 'This Month' },
  { value: 'next-month', label: 'Next Month' }
] as const

export type DateFilterType = typeof DATE_FILTER_OPTIONS[number]['value']
