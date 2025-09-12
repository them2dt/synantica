/**
 * Input sanitization utilities for XSS protection
 * Provides secure string sanitization using DOMPurify
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes a string input to prevent XSS attacks
 * Trims whitespace and converts to lowercase for consistency
 * 
 * @param input - The raw string input to sanitize
 * @returns Sanitized string safe for use in the application
 * 
 * @example
 * ```typescript
 * const userInput = "<script>alert('xss')</script>Hello World";
 * const sanitized = sanitizeString(userInput);
 * // Returns: "hello world"
 * ```
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Sanitize HTML and remove potentially dangerous content
  const sanitized = DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], // Remove all HTML tags
    ALLOWED_ATTR: []  // Remove all attributes
  });
  
  // Trim whitespace and convert to lowercase for consistency
  return sanitized.trim().toLowerCase();
}

/**
 * Sanitizes email input specifically
 * Ensures email format is preserved while removing dangerous content
 * 
 * @param email - The email string to sanitize
 * @returns Sanitized email string
 * 
 * @example
 * ```typescript
 * const email = "  USER@EXAMPLE.COM  ";
 * const sanitized = sanitizeEmail(email);
 * // Returns: "user@example.com"
 * ```
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }
  
  // Sanitize and normalize email
  const sanitized = DOMPurify.sanitize(email, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  });
  
  // Trim and convert to lowercase, but preserve email format
  return sanitized.trim().toLowerCase();
}

/**
 * Sanitizes password input
 * Removes dangerous content while preserving password characters
 * 
 * @param password - The password string to sanitize
 * @returns Sanitized password string
 * 
 * @example
 * ```typescript
 * const password = "  MyPass123!  ";
 * const sanitized = sanitizePassword(password);
 * // Returns: "mypass123!" (trimmed but case preserved)
 * ```
 */
export function sanitizePassword(password: string): string {
  if (typeof password !== 'string') {
    return '';
  }
  
  // Sanitize HTML content but preserve password case and special characters
  const sanitized = DOMPurify.sanitize(password, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  });
  
  // Only trim whitespace, preserve case for passwords
  return sanitized.trim();
}

/**
 * Sanitizes general text input for display
 * Removes HTML tags and dangerous content
 * 
 * @param text - The text to sanitize
 * @returns Sanitized text safe for display
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }
  
  const sanitized = DOMPurify.sanitize(text, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  });
  
  return sanitized.trim();
}

/**
 * Validates if a string contains only safe characters
 * Useful for additional validation before processing
 * 
 * @param input - The string to validate
 * @returns True if the string contains only safe characters
 */
export function isSafeString(input: string): boolean {
  if (typeof input !== 'string') {
    return false;
  }
  
  // Check for common XSS patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<link/i,
    /<meta/i
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
}
