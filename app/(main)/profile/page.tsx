'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, Mail, Calendar, Settings, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ChangePasswordModal } from '@/components/modals/change-password-modal'
import { ChangeEmailModal } from '@/components/modals/change-email-modal'
import { DeleteAccountModal } from '@/components/modals/delete-account-modal'
import { Footer } from '@/components/layout/footer'
import { formatEventDate } from '@/lib/utils/date-formatting'
import { useAuthContext } from '@/lib/contexts/auth-context'

/**
 * User profile page
 * Displays user account information and profile details
 */
export default function ProfilePage() {
  const { user, loading } = useAuthContext()
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [changeEmailOpen, setChangeEmailOpen] = useState(false)
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        {/* Add spacing for floating navbar */}
        <div className="h-20" />
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <Button variant="ghost" size="sm" asChild className="touch-manipulation">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-heading font-semibold">Profile</CardTitle>
                  <CardDescription className="text-sm">
                    Manage your account information and preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your account details and authentication information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                  <p className="text-sm">{user.created_at ? formatEventDate(user.created_at, 'full') : 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Sign In</label>
                  <p className="text-sm">
                    {user.last_sign_in_at ? formatEventDate(user.last_sign_in_at, 'full') : 'Never'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-4">
                <Badge variant="secondary">
                  {user.email_confirmed_at ? 'Email Verified' : 'Email Not Verified'}
                </Badge>
                <Badge variant="outline">
                  {user.phone ? 'Phone Verified' : 'No Phone'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Account Management
              </CardTitle>
              <CardDescription>
                Manage your account settings and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <Button 
                  variant="outline" 
                  className="w-full touch-manipulation"
                  onClick={() => setChangeEmailOpen(true)}
                >
                  Change Email
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full touch-manipulation"
                  onClick={() => setChangePasswordOpen(true)}
                >
                  Change Password
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full touch-manipulation sm:col-span-2 md:col-span-1"
                  onClick={() => setDeleteAccountOpen(true)}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Activity Summary
              </CardTitle>
              <CardDescription>
                Your recent activity and engagement on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Events Attended</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Events RSVP&apos;d</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Days Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
      
      <ChangeEmailModal
        isOpen={changeEmailOpen}
        onClose={() => setChangeEmailOpen(false)}
        currentEmail={user.email || ''}
      />
      
      <DeleteAccountModal
        isOpen={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
        userEmail={user.email || ''}
      />
    </div>
  )
}
