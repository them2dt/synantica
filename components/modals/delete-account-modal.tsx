'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
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
import { AlertTriangle } from 'lucide-react'
import { InlineSpinner } from '@/components/ui/loading'

/**
 * Props for the delete account modal
 */
interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
}

/**
 * Modal component for confirming account deletion
 */
export function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const [confirmationText, setConfirmationText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const expectedText = 'DELETE'
  const isConfirmationValid = confirmationText === expectedText

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!isConfirmationValid) {
      setError('Please type DELETE to confirm')
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      // Delete user account using Supabase
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ''
      )

      if (error) throw error

      // Sign out and redirect
      await supabase.auth.signOut()
      router.push('/')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to delete account')
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setError(null)
      setConfirmationText('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-800">
              <strong>Warning:</strong> This will permanently delete:
            </div>
            <ul className="text-sm text-red-700 mt-2 space-y-1">
              <li>• Your account and profile</li>
              <li>• All event participation history</li>
              <li>• All event history</li>
              <li>• All personal data</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type <code className="bg-muted px-1 py-0.5 rounded text-sm">DELETE</code> to confirm:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DELETE to confirm"
              required
              disabled={isLoading}
              className={!isConfirmationValid && confirmationText ? 'border-red-500' : ''}
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
            <Button 
              type="submit" 
              variant="destructive" 
              disabled={isLoading || !isConfirmationValid}
            >
              {isLoading && <InlineSpinner className="mr-2" />}
              Delete Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
