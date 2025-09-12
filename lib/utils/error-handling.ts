/**
 * Centralized error handling utilities for consistent error management
 * across the application. Provides standardized error processing,
 * user-friendly messages, and logging.
 */

/**
 * Error context types for different parts of the application
 */
export type ErrorContext =
  | 'events'
  | 'event'
  | 'popular-events'
  | 'categories'
  | 'tags'
  | 'auth'
  | 'network'
  | 'database'
  | 'validation';

/**
 * Standardized error response interface
 */
export interface ErrorResult {
  message: string;
  originalError?: Error;
  context: ErrorContext;
  userFriendly: boolean;
}

/**
 * Maps technical errors to user-friendly messages based on context
 */
const ERROR_MESSAGE_MAP: Record<ErrorContext, Record<string, string>> = {
  events: {
    'Authentication required': 'Please log in to view events',
    'permission': 'You do not have permission to view events',
    'Network error': 'Network error. Please check your connection and try again.',
    'Database error': 'Unable to load events. Please try again later.',
  },
  event: {
    'Authentication required': 'Please log in to view this event',
    'permission': 'You do not have permission to view this event',
    'Network error': 'Network error. Please check your connection and try again.',
    'not found': 'Event not found',
    'Database error': 'Unable to load event details. Please try again later.',
  },
  'popular-events': {
    'Authentication required': 'Please log in to view popular events',
    'permission': 'You do not have permission to view popular events',
    'Network error': 'Network error. Please check your connection and try again.',
    'Database error': 'Unable to load popular events. Please try again later.',
  },
  categories: {
    'Authentication required': 'Please log in to view categories',
    'permission': 'You do not have permission to view categories',
    'Network error': 'Network error. Please check your connection and try again.',
    'Database error': 'Unable to load categories. Please try again later.',
  },
  tags: {
    'Authentication required': 'Please log in to view tags',
    'permission': 'You do not have permission to view tags',
    'Network error': 'Network error. Please check your connection and try again.',
    'Database error': 'Unable to load tags. Please try again later.',
  },
  auth: {
    'Invalid credentials': 'Invalid email or password',
    'Email not confirmed': 'Please check your email and confirm your account',
    'Too many requests': 'Too many login attempts. Please try again later.',
    'Network error': 'Network error. Please check your connection and try again.',
  },
  network: {
    'Failed to fetch': 'Network error. Please check your connection and try again.',
    'timeout': 'Request timed out. Please try again.',
    'offline': 'You appear to be offline. Please check your connection.',
  },
  database: {
    'connection': 'Database connection error. Please try again later.',
    'timeout': 'Database request timed out. Please try again.',
    'constraint': 'Data validation error. Please check your input.',
  },
  validation: {
    'required': 'This field is required',
    'invalid': 'Invalid input format',
    'length': 'Input length is invalid',
    'format': 'Invalid format',
  },
};

/**
 * Default fallback messages for each context
 */
const DEFAULT_MESSAGES: Record<ErrorContext, string> = {
  events: 'Failed to fetch events',
  event: 'Failed to fetch event',
  'popular-events': 'Failed to fetch popular events',
  categories: 'Failed to fetch categories',
  tags: 'Failed to fetch tags',
  auth: 'Authentication error occurred',
  network: 'Network error occurred',
  database: 'Database error occurred',
  validation: 'Validation error occurred',
};

/**
 * Processes an error and returns a standardized error result
 * @param error - The original error (can be Error, string, or unknown)
 * @param context - The context where the error occurred
 * @param shouldLog - Whether to log the error to console (default: true in development)
 * @returns Standardized error result with user-friendly message
 */
export function handleDatabaseError(
  error: unknown,
  context: ErrorContext,
  shouldLog: boolean = process.env.NODE_ENV !== 'production'
): ErrorResult {
  // Log error if requested
  if (shouldLog) {
    console.error(`Error in ${context}:`, error);
  }

  // Handle different error types
  let errorMessage = '';
  let originalError: Error | undefined;

  if (error instanceof Error) {
    originalError = error;
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'An unexpected error occurred';
  }

  // Try to map to user-friendly message
  const contextMessages = ERROR_MESSAGE_MAP[context];
  let userFriendlyMessage = DEFAULT_MESSAGES[context];
  let userFriendly = false;

  if (contextMessages) {
    // Check for exact matches first
    if (contextMessages[errorMessage]) {
      userFriendlyMessage = contextMessages[errorMessage];
      userFriendly = true;
    } else {
      // Check for partial matches
      for (const [key, message] of Object.entries(contextMessages)) {
        if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
          userFriendlyMessage = message;
          userFriendly = true;
          break;
        }
      }
    }
  }

  return {
    message: userFriendlyMessage,
    originalError,
    context,
    userFriendly,
  };
}

/**
 * Creates a standardized error for throwing in database operations
 * @param message - Error message
 * @param context - Error context
 * @returns Error with standardized message
 */
export function createDatabaseError(message: string, context: ErrorContext): Error {
  const errorResult = handleDatabaseError(message, context);
  const error = new Error(errorResult.message);
  error.name = `${context.charAt(0).toUpperCase() + context.slice(1)}Error`;
  return error;
}

/**
 * Hook-friendly error handler for React components
 * @param error - The error to handle
 * @param context - Error context
 * @param setError - State setter for error message
 * @param setLoading - Optional state setter for loading state
 */
export function handleAsyncError(
  error: unknown,
  context: ErrorContext,
  setError: (message: string) => void,
  setLoading?: (loading: boolean) => void
): void {
  const errorResult = handleDatabaseError(error, context);

  setError(errorResult.message);

  if (setLoading) {
    setLoading(false);
  }
}

/**
 * Validates if an error should trigger a retry
 * @param error - The error to check
 * @param retryCount - Current retry count
 * @param maxRetries - Maximum allowed retries
 * @returns Whether the operation should be retried
 */
export function shouldRetry(
  error: unknown,
  retryCount: number,
  maxRetries: number = 3
): boolean {
  if (retryCount >= maxRetries) {
    return false;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    // Retry on network errors, timeouts, but not on auth/permission errors
    return (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('connection') ||
      message.includes('fetch')
    ) && !(
      message.includes('authentication') ||
      message.includes('permission') ||
      message.includes('forbidden') ||
      message.includes('unauthorized')
    );
  }

  return false;
}

/**
 * Utility for consistent error logging
 */
export const errorLogger = {
  database: (error: unknown, operation: string) => {
    console.error(`Database operation failed: ${operation}`, error);
  },

  network: (error: unknown, endpoint: string) => {
    console.error(`Network request failed: ${endpoint}`, error);
  },

  auth: (error: unknown, action: string) => {
    console.error(`Authentication failed: ${action}`, error);
  },

  validation: (error: unknown, field: string) => {
    console.warn(`Validation failed for field: ${field}`, error);
  },
};
