/**
 * Database error handling utilities
 * Provides consistent error handling across all database operations
 */

/**
 * Database error types
 */
export enum DatabaseErrorType {
  AUTHENTICATION = 'AUTHENTICATION',
  PERMISSION = 'PERMISSION',
  NOT_FOUND = 'NOT_FOUND',
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Database error result
 */
export interface DatabaseError {
  type: DatabaseErrorType;
  message: string;
  originalError?: unknown;
  retryable: boolean;
}

/**
 * Handle Supabase errors and convert to standardized format
 * @param error - The error from Supabase
 * @param operation - The operation that failed (for context)
 * @returns Standardized database error
 */
export function handleDatabaseError(error: unknown, operation: string = 'database operation'): DatabaseError {
  console.error(`Database error in ${operation}:`, error);

  // Handle Supabase specific errors
  if (error && typeof error === 'object' && 'code' in error) {
    switch (error.code) {
      case 'PGRST116':
        return {
          type: DatabaseErrorType.NOT_FOUND,
          message: 'No records found',
          originalError: error,
          retryable: false
        };

      case 'PGRST301':
        return {
          type: DatabaseErrorType.PERMISSION,
          message: 'You do not have permission to perform this action',
          originalError: error,
          retryable: false
        };

      case 'PGRST302':
        return {
          type: DatabaseErrorType.AUTHENTICATION,
          message: 'Authentication required. Please log in again.',
          originalError: error,
          retryable: false
        };

      case 'PGRST400':
        return {
          type: DatabaseErrorType.VALIDATION,
          message: 'Invalid request. Please check your input.',
          originalError: error,
          retryable: false
        };

      case 'PGRST500':
        return {
          type: DatabaseErrorType.UNKNOWN,
          message: 'Server error. Please try again later.',
          originalError: error,
          retryable: true
        };

      default:
        break;
    }
  }

  // Handle error messages
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    const message = error.message.toLowerCase();

    if (message.includes('jwt') || message.includes('token') || message.includes('auth')) {
      return {
        type: DatabaseErrorType.AUTHENTICATION,
        message: 'Authentication required. Please log in again.',
        originalError: error,
        retryable: false
      };
    }

    if (message.includes('permission') || message.includes('forbidden')) {
      return {
        type: DatabaseErrorType.PERMISSION,
        message: 'You do not have permission to perform this action',
        originalError: error,
        retryable: false
      };
    }

    if (message.includes('timeout') || message.includes('network') || message.includes('connection')) {
      return {
        type: DatabaseErrorType.NETWORK,
        message: 'Network error. Please check your connection and try again.',
        originalError: error,
        retryable: true
      };
    }

    if (message.includes('not found') || message.includes('no rows')) {
      return {
        type: DatabaseErrorType.NOT_FOUND,
        message: 'The requested resource was not found',
        originalError: error,
        retryable: false
      };
    }
  }

  // Default unknown error
  return {
    type: DatabaseErrorType.UNKNOWN,
    message: `An unexpected error occurred during ${operation}`,
    originalError: error,
    retryable: true
  };
}

/**
 * Retry function with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param baseDelay - Base delay in milliseconds
 * @returns Promise with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if it's not a retryable error
      const dbError = handleDatabaseError(error, 'retry operation');
      if (!dbError.retryable) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Safe database operation wrapper
 * @param operation - The database operation function
 * @param operationName - Name of the operation for error context
 * @param retryable - Whether the operation should be retried on failure
 * @returns Promise with error handling
 */
export async function safeDatabaseOperation<T>(
  operation: () => Promise<T>,
  operationName: string = 'database operation',
  retryable: boolean = true
): Promise<T> {
  try {
    if (retryable) {
      return await withRetry(operation, 3, 1000);
    } else {
      return await operation();
    }
  } catch (error) {
    const dbError = handleDatabaseError(error, operationName);
    
    // Log error for debugging
    console.error(`Database operation failed: ${operationName}`, {
      error: dbError,
      originalError: error
    });

    // Throw user-friendly error
    throw new Error(dbError.message);
  }
}

/**
 * Check if an error is retryable
 * @param error - The error to check
 * @returns True if the error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  const dbError = handleDatabaseError(error);
  return dbError.retryable;
}

/**
 * Get user-friendly error message
 * @param error - The error to process
 * @param fallbackMessage - Fallback message if error can't be processed
 * @returns User-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown, fallbackMessage: string = 'An unexpected error occurred'): string {
  const dbError = handleDatabaseError(error);
  return dbError.message || fallbackMessage;
}
