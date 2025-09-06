/**
 * Password validation utilities
 * Provides comprehensive password strength checking and validation
 */

/**
 * Password strength levels
 */
export enum PasswordStrength {
  WEAK = 'weak',
  FAIR = 'fair',
  GOOD = 'good',
  STRONG = 'strong',
}

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  strength: PasswordStrength;
  score: number; // 0-100
  feedback: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
    noCommonPatterns: boolean;
  };
}

/**
 * Common weak passwords to check against
 */
const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123',
  'password123', 'admin', 'letmein', 'welcome', 'monkey',
  '1234567890', 'password1', 'qwerty123', 'dragon', 'master',
  'hello', 'login', 'princess', 'rockyou', '1234567',
  '123123', 'welcome123', 'password1234', '12345678', 'qwertyuiop'
];

/**
 * Common patterns to check for
 */
const COMMON_PATTERNS = [
  /(.)\1{2,}/, // Repeated characters (aaa, 111, etc.)
  /123456/, // Sequential numbers
  /qwerty/, // Keyboard patterns
  /abcdef/, // Alphabetical sequences
  /password/i, // Contains "password"
  /admin/i, // Contains "admin"
  /user/i, // Contains "user"
];

/**
 * Calculate password strength score
 * @param password - The password to analyze
 * @returns Score from 0-100
 */
export function calculatePasswordScore(password: string): number {
  let score = 0;
  const length = password.length;

  // Length scoring (0-25 points)
  if (length >= 8) score += 10;
  if (length >= 12) score += 10;
  if (length >= 16) score += 5;

  // Character variety scoring (0-40 points)
  if (/[a-z]/.test(password)) score += 5; // Lowercase
  if (/[A-Z]/.test(password)) score += 5; // Uppercase
  if (/[0-9]/.test(password)) score += 5; // Numbers
  if (/[^a-zA-Z0-9]/.test(password)) score += 10; // Special chars
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 5; // Mixed case
  if (/[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) score += 10; // Numbers + special

  // Complexity scoring (0-20 points)
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= 8) score += 10;
  if (uniqueChars >= 12) score += 10;

  // Penalty for common patterns (0-15 points penalty)
  let penalty = 0;
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) penalty += 15;
  if (COMMON_PATTERNS.some(pattern => pattern.test(password))) penalty += 10;
  if (password.length < 8) penalty += 10;

  score = Math.max(0, score - penalty);
  return Math.min(100, score);
}

/**
 * Get password strength level based on score
 * @param score - Password strength score (0-100)
 * @returns Password strength level
 */
export function getPasswordStrength(score: number): PasswordStrength {
  if (score < 30) return PasswordStrength.WEAK;
  if (score < 50) return PasswordStrength.FAIR;
  if (score < 70) return PasswordStrength.GOOD;
  return PasswordStrength.STRONG;
}

/**
 * Get strength color for UI display
 * @param strength - Password strength level
 * @returns Tailwind CSS color class
 */
export function getStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case PasswordStrength.WEAK:
      return 'text-red-500';
    case PasswordStrength.FAIR:
      return 'text-orange-500';
    case PasswordStrength.GOOD:
      return 'text-yellow-500';
    case PasswordStrength.STRONG:
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
}

/**
 * Get strength background color for UI display
 * @param strength - Password strength level
 * @returns Tailwind CSS background color class
 */
export function getStrengthBgColor(strength: PasswordStrength): string {
  switch (strength) {
    case PasswordStrength.WEAK:
      return 'bg-red-500';
    case PasswordStrength.FAIR:
      return 'bg-orange-500';
    case PasswordStrength.GOOD:
      return 'bg-yellow-500';
    case PasswordStrength.STRONG:
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}

/**
 * Validate password and return comprehensive result
 * @param password - The password to validate
 * @param minLength - Minimum required length (default: 8)
 * @returns Password validation result
 */
export function validatePassword(
  password: string, 
  minLength: number = 8
): PasswordValidationResult {
  const score = calculatePasswordScore(password);
  const strength = getPasswordStrength(score);
  
  const requirements = {
    minLength: password.length >= minLength,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSpecialChars: /[^a-zA-Z0-9]/.test(password),
    noCommonPatterns: !COMMON_PATTERNS.some(pattern => pattern.test(password)) && 
                      !COMMON_PASSWORDS.includes(password.toLowerCase()),
  };

  const feedback: string[] = [];
  
  if (!requirements.minLength) {
    feedback.push(`Password must be at least ${minLength} characters long`);
  }
  if (!requirements.hasUppercase) {
    feedback.push('Add uppercase letters');
  }
  if (!requirements.hasLowercase) {
    feedback.push('Add lowercase letters');
  }
  if (!requirements.hasNumbers) {
    feedback.push('Add numbers');
  }
  if (!requirements.hasSpecialChars) {
    feedback.push('Add special characters (!@#$%^&*)');
  }
  if (!requirements.noCommonPatterns) {
    feedback.push('Avoid common patterns and words');
  }

  const isValid = Object.values(requirements).every(req => req) && score >= 50;

  return {
    isValid,
    strength,
    score,
    feedback,
    requirements,
  };
}

/**
 * Generate a secure random password
 * @param length - Desired password length (default: 16)
 * @param includeSpecialChars - Whether to include special characters (default: true)
 * @returns Generated secure password
 */
export function generateSecurePassword(
  length: number = 16, 
  includeSpecialChars: boolean = true
): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let charset = lowercase + uppercase + numbers;
  if (includeSpecialChars) {
    charset += special;
  }
  
  let password = '';
  
  // Ensure at least one character from each required category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  if (includeSpecialChars) {
    password += special[Math.floor(Math.random() * special.length)];
  }
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Check if password is commonly used
 * @param password - The password to check
 * @returns True if password is commonly used
 */
export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.includes(password.toLowerCase());
}

/**
 * Get password strength description
 * @param strength - Password strength level
 * @returns Human-readable description
 */
export function getStrengthDescription(strength: PasswordStrength): string {
  switch (strength) {
    case PasswordStrength.WEAK:
      return 'Weak - Easy to guess';
    case PasswordStrength.FAIR:
      return 'Fair - Could be stronger';
    case PasswordStrength.GOOD:
      return 'Good - Reasonably secure';
    case PasswordStrength.STRONG:
      return 'Strong - Very secure';
    default:
      return 'Unknown';
  }
}
