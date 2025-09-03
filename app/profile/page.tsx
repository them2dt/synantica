import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, Mail, Calendar, Settings, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

/**
 * User profile page
 * Displays user account information and profile details
 */
export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Profile</CardTitle>
                  <CardDescription>
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
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p className="text-sm font-mono text-xs">{user.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                  <p className="text-sm">{formatDate(user.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Sign In</label>
                  <p className="text-sm">
                    {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never'}
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

          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Customize your profile and account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button asChild className="w-full">
                  <Link href="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/update-password">
                    Change Password
                  </Link>
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
  )
}
