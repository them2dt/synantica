/**
 * Common types and interfaces used across the application
 */

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
  error?: string
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number
  limit: number
  offset?: number
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc'

/**
 * Sort parameters
 */
export interface SortParams {
  field: string
  direction: SortDirection
}

/**
 * Filter parameters
 */
export interface FilterParams {
  [key: string]: any
}

/**
 * Search parameters
 */
export interface SearchParams {
  query: string
  fields?: string[]
  fuzzy?: boolean
}

/**
 * Loading state
 */
export interface LoadingState {
  isLoading: boolean
  error?: string
}

/**
 * Form state
 */
export interface FormState<T = any> {
  data: T
  errors: Record<string, string>
  isSubmitting: boolean
  isDirty: boolean
}

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean
  data?: any
}

/**
 * Theme type
 */
export type Theme = 'light' | 'dark' | 'system'

/**
 * View mode type
 */
export type ViewMode = 'grid' | 'list'

/**
 * Component variant type
 */
export type ComponentVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary'

/**
 * Component size type
 */
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Icon size type
 */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Color variant type
 */
export type ColorVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info'

/**
 * Status type
 */
export type Status = 'idle' | 'loading' | 'success' | 'error'

/**
 * File upload type
 */
export interface FileUpload {
  file: File
  preview?: string
  progress?: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

/**
 * Notification type
 */
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message?: string
  duration?: number
  isRead: boolean
  createdAt: string
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

/**
 * Navigation item
 */
export interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  isActive?: boolean
  children?: NavigationItem[]
}

/**
 * Table column definition
 */
export interface TableColumn<T = any> {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

/**
 * Select option
 */
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

/**
 * Tab item
 */
export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
}
