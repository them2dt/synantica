'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, Settings } from 'lucide-react'
import Link from 'next/link'
import { DeleteAccountModal } from '@/components/modals/delete-account-modal'
import { Footer } from '@/components/layout/footer'
import { NavigationSpacer } from '@/components/layout/navigation-spacer'
import { formatEventDate } from '@/lib/utils/date-formatting'
import { useAuth } from '@/lib/hooks/use-auth'

/**
 * User profile page
 * Displays user account information and profile details
 */
export default function ProfilePage() {
    const { user, loading } = useAuth('/', true)
    const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)

    if (loading) {
        return (
            <main className="mx-auto min-h-screen max-w-[1100px] md:border-x border-slate-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-slate-950 border-t-transparent rounded-none animate-spin mx-auto mb-4" />
                    <p className="text-slate-500">Loading profile...</p>
                </div>
            </main>
        )
    }

    if (!user) {
        return null
    }

    return (
        <main className="mx-auto min-h-screen max-w-[1100px] md:border-x border-slate-200 flex flex-col">
            <NavigationSpacer />

            {/* Profile Header */}
            <section className="border-t border-slate-200 px-6 py-8">
                <div>
                    <h1 className="text-xl font-semibold text-slate-950">Profile</h1>
                    <p className="text-sm text-slate-500">Manage your account information and preferences</p>
                </div>
            </section>

            {/* Account Information */}
            <section className="border-t border-slate-200 px-6 py-8">
                <h2 className="text-sm text-slate-500 uppercase mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Account Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs text-slate-500">Email</label>
                        <p className="text-sm text-slate-950">{user.email}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500">Account Created</label>
                        <p className="text-sm text-slate-950">
                            {user.created_at ? formatEventDate(user.created_at, 'medium') : 'Unknown'}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500">Last Sign In</label>
                        <p className="text-sm text-slate-950">
                            {user.last_sign_in_at ? formatEventDate(user.last_sign_in_at, 'medium') : 'Never'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className={`w-1.5 h-1.5 rounded-full ${user.email_confirmed_at ? 'bg-green-500' : 'bg-slate-300'}`} />
                        {user.email_confirmed_at ? 'Email Verified' : 'Email Not Verified'}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className={`w-1.5 h-1.5 rounded-full ${user.phone ? 'bg-green-500' : 'bg-slate-300'}`} />
                        {user.phone ? 'Phone Verified' : 'No Phone'}
                    </span>
                </div>
            </section>

            {/* Account Management */}
            <section className="border-t border-slate-200 px-6 py-8">
                <h2 className="text-sm text-slate-500 uppercase mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Account Management
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        Account management is handled via your social provider.
                    </p>
                    <Button variant="destructive" onClick={() => setDeleteAccountOpen(true)}>
                        Delete Account
                    </Button>
                </div>
            </section>


            <div className="flex-1" />

            {/* Footer */}
            <Footer />

            {/* Modals */}
            <DeleteAccountModal isOpen={deleteAccountOpen} onClose={() => setDeleteAccountOpen(false)} userEmail={user.email || ''} />
        </main>
    )
}
