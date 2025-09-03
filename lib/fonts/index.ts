/**
 * Font utilities and exports
 * Centralized font configuration for the application
 */

export { satoshi } from './satoshi'

/**
 * Font class utilities for consistent typography
 */
export const fontClasses = {
  // Header fonts using Satoshi
  header: {
    light: 'font-header-light',
    regular: 'font-header',
    medium: 'font-header-medium',
    bold: 'font-header-bold',
    black: 'font-header-black',
  },
  
  // Content fonts using Geist Mono Light
  content: {
    light: 'font-content',
  },
  
  // Legacy mono font (for inputs, code, etc.)
  mono: {
    regular: 'font-mono',
  },
} as const

/**
 * Typography scale for consistent heading sizes
 */
export const typography = {
  h1: 'text-4xl font-header-bold',
  h2: 'text-3xl font-header-bold',
  h3: 'text-2xl font-header-bold',
  h4: 'text-xl font-header-medium',
  h5: 'text-lg font-header-medium',
  h6: 'text-base font-header-medium',
  body: 'text-base font-content',
  small: 'text-sm font-content',
  caption: 'text-xs font-content',
} as const
