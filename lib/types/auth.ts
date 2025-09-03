import { User, Session } from '@supabase/supabase-js'

/**
 * Authentication context interface
 * Provides user session state and authentication methods
 */
export interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

/**
 * Authentication form data interface
 */
export interface AuthFormData {
  email: string
  password: string
  confirmPassword?: string
}

/**
 * Authentication form props interface
 */
export interface AuthFormProps {
  mode: 'signin' | 'signup'
  onModeChange: (mode: 'signin' | 'signup') => void
}

/**
 * Message interface for form feedback
 */
export interface AuthMessage {
  type: 'success' | 'error'
  text: string
}
