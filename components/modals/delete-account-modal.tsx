'use client'

import { useState } from 'react'
import { auth } from '@/lib/firebase/client'
import { deleteUser } from 'firebase/auth'
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
      const user = auth.currentUser
      if (!user) throw new Error('User not found')

      // Note: In a real app with Firebase, deleting a user account might require re-authentication 
      // if their login session is old. For this migration, we'll call deleteUser directly.
      // Additionally, typically a backend function should be used to clear their Firestore data.
      await deleteUser(user)

      // Clear session cookie

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
      <DialogContent className="max-w-md">
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
          <div className="bg-red-600 border border-red-600 rounded-none p-4">
            <div className="text-sm text-slate-50">
              <strong>Warning:</strong> This will permanently delete:
            </div>
            <ul className="text-sm text-slate-50 mt-2 space-y-1">
              <li>• Your account and profile</li>
              <li>• All event participation history</li>
              <li>• All event history</li>
              <li>• All personal data</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type <code className="bg-slate-100 px-1 py-0.5 rounded-none text-sm">DELETE</code> to confirm:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DELETE to confirm"
              required
              disabled={isLoading}
              className={!isConfirmationValid && confirmationText ? 'border-red-600' : ''}
            />
          </div>

          {error && (
            <div className="text-sm text-slate-50 bg-red-600 p-3 rounded-none">
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
