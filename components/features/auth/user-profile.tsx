'use client'

import { useState } from 'react'
import { useUserDisplay } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, Shield } from 'lucide-react'

/**
 * User profile component
 * Displays user information and account details
 */
export function UserProfile() {
  const { user, initials, displayName, email, isEmailVerified } = useUserDisplay()
  const [isEditing, setIsEditing] = useState(false)

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground font-mono">No user data available</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={user.user_metadata?.avatar_url} 
                alt={user.email || 'User'} 
              />
              <AvatarFallback className="text-2xl font-mono">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl font-mono">
            {displayName}
          </CardTitle>
          <CardDescription className="font-mono">
            {email}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-mono">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium font-mono text-muted-foreground">
                Email Address
              </label>
              <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono">{email}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium font-mono text-muted-foreground">
                Account Status
              </label>
              <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Badge variant={isEmailVerified ? "default" : "secondary"} className="font-mono">
                  {isEmailVerified ? "Verified" : "Pending Verification"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium font-mono text-muted-foreground">
              Member Since
            </label>
            <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono">
                {formatDate(user.created_at)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="font-mono">Preferences</CardTitle>
          <CardDescription className="font-mono">
            Manage your account preferences and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium font-mono text-muted-foreground">
              Display Name
            </label>
            <div className="flex gap-2">
              <Input
                defaultValue={displayName}
                placeholder="Enter your display name"
                className="font-mono"
                disabled={!isEditing}
              />
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="font-mono"
              >
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
