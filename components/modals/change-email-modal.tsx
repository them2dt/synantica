'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2, Mail } from 'lucide-react'

/**
 * Props for the change email modal
 */
interface ChangeEmailModalProps {
  isOpen: boolean
  onClose: () => void
  currentEmail: string
}

/**
 * Modal component for changing user email
 */
export function ChangeEmailModal({ isOpen, onClose, currentEmail }: ChangeEmailModalProps) {
  const [newEmail, setNewEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Validation
    if (newEmail === currentEmail) {
      setError('New email must be different from current email')
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      // Update email using Supabase
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      })

      if (error) throw error

      setSuccess(true)
      setNewEmail('')
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 3000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to update email')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setError(null)
      setSuccess(false)
      setNewEmail('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Email Address</DialogTitle>
          <DialogDescription>
            Enter your new email address. You'll receive a confirmation email to verify the change.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-green-600 font-medium">Email update initiated!</div>
            <div className="text-sm text-muted-foreground">
              Please check your new email address for a confirmation link.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-email">Current Email</Label>
              <Input
                id="current-email"
                type="email"
                value={currentEmail}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-email">New Email Address</Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email address"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Email
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
