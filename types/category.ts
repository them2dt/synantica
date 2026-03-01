/**
 * Category-related types and interfaces
 */



/**
 * Category with icon component type
 * Used in components that need to render category icons
 */
export interface CategoryWithIcon {
  value: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}


