'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, Mail, Calendar, Settings, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { DeleteAccountModal } from '@/components/modals/delete-account-modal'
import { Footer } from '@/components/layout/footer'
import { formatEventDate } from '@/lib/utils/date-formatting'
import { useAuth } from '@/lib/hooks/use-auth'

/**
 * User profile page
 * Displays user account information and profile details
 */
export default function ProfilePage() {
    const { user, loading } = useAuth('/auth/login', true)
    const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-none animate-spin mx-auto mb-4" />
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
                <div className="mx-auto w-full max-w-[1100px] px-6 py-10">
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
                                    <div className="w-14 h-14 bg-muted rounded-none flex items-center justify-center">
                                        <User className="w-7 h-7 text-foreground" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Profile</CardTitle>
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
                                <CardTitle className="flex items-center gap-2 text-base">
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
                                        <label className="text-xs text-muted-foreground">Email</label>
                                        <p className="text-sm text-foreground">{user.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground">Account Created</label>
                                        <p className="text-sm text-foreground">
                                            {user.created_at ? formatEventDate(user.created_at, 'full') : 'Unknown'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground">Last Sign In</label>
                                        <p className="text-sm text-foreground">
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
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Settings className="w-5 h-5" />
                                    Account Management
                                </CardTitle>
                                <CardDescription>
                                    Manage your account settings and security
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                    <div className="sm:col-span-2 flex items-center">
                                        <p className="text-sm text-muted-foreground">
                                            Account management is handled via your social provider.
                                        </p>
                                    </div>
                                    <Button variant="destructive" className="w-full" onClick={() => setDeleteAccountOpen(true)}>
                                        Delete Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Calendar className="w-5 h-5" />
                                    Activity Summary
                                </CardTitle>
                                <CardDescription>
                                    Your recent activity and engagement on the platform
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { label: "Events Attended", value: "0" },
                                        { label: "Events RSVP'd", value: "0" },
                                        { label: "Days Active", value: "0" },
                                    ].map((item) => (
                                        <div key={item.label} className="text-center p-4 border border-border rounded-none">
                                            <div className="text-2xl text-foreground">{item.value}</div>
                                            <div className="text-xs text-muted-foreground">{item.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />

            {/* Modals */}
            <DeleteAccountModal isOpen={deleteAccountOpen} onClose={() => setDeleteAccountOpen(false)} userEmail={user.email || ''} />
        </div>
    )
}
