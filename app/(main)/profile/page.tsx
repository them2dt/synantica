'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, Settings, BarChart3, ExternalLink } from 'lucide-react'
import { DeleteAccountModal } from '@/components/modals/delete-account-modal'
import { Footer } from '@/components/layout/footer'
import { NavigationSpacer } from '@/components/layout/navigation-spacer'
import { formatEventDate } from '@/lib/utils/date-formatting'
import { useAuth } from '@/lib/hooks/use-auth'
import { useMyEvents } from '@/lib/hooks/use-events'

export default function ProfilePage() {
  const { user, loading } = useAuth('/', true)
  const { events: myEvents, loading: eventsLoading } = useMyEvents()
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)

  if (loading) {
    return (
      <main className="mx-auto min-h-screen max-w-[1100px] md:border-x border-slate-200 dark:border-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-950 dark:border-slate-50 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading profile...</p>
        </div>
      </main>
    )
  }

  if (!user) return null

  const publishedCount = myEvents.filter(e => e.status === 'published').length
  const totalCount = myEvents.length

  const memberSince = user.created_at
    ? new Date(user.created_at).getFullYear()
    : new Date().getFullYear()

  return (
    <main className="mx-auto min-h-screen max-w-[1100px] md:border-x border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-slate-950">
      <NavigationSpacer />

      {/* Profile Header */}
      <section className="border-t border-slate-200 dark:border-slate-800 px-6 py-8">
        <h1 className="text-xl font-semibold text-slate-950 dark:text-slate-50">Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Your Synantica account and activity.
        </p>
      </section>

      {/* Activity Summary */}
      <section className="border-t border-slate-200 dark:border-slate-800">
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4" />
            Activity Summary
          </h2>
        </div>
        <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800 border-t border-slate-200 dark:border-slate-800">
          <div className="px-6 py-5 text-center">
            <p className="text-2xl font-semibold text-slate-950 dark:text-slate-50">
              {eventsLoading ? '—' : totalCount}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Events submitted</p>
          </div>
          <div className="px-6 py-5 text-center">
            <p className="text-2xl font-semibold text-slate-950 dark:text-slate-50">
              {eventsLoading ? '—' : publishedCount}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Currently live</p>
          </div>
          <div className="px-6 py-5 text-center">
            <p className="text-2xl font-semibold text-slate-950 dark:text-slate-50">
              {memberSince}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Member since</p>
          </div>
        </div>
      </section>

      {/* Account Information */}
      <section className="border-t border-slate-200 dark:border-slate-800 px-6 py-8">
        <h2 className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-5 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Account Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <label className="text-xs text-slate-400 dark:text-slate-500 block mb-1">Email address</label>
            <p className="text-sm font-medium text-slate-950 dark:text-slate-50">{user.email}</p>
          </div>
          <div>
            <label className="text-xs text-slate-400 dark:text-slate-500 block mb-1">Account created</label>
            <p className="text-sm font-medium text-slate-950 dark:text-slate-50">
              {user.created_at ? formatEventDate(user.created_at, 'medium') : 'Unknown'}
            </p>
          </div>
          <div>
            <label className="text-xs text-slate-400 dark:text-slate-500 block mb-1">Last sign in</label>
            <p className="text-sm font-medium text-slate-950 dark:text-slate-50">
              {user.last_sign_in_at ? formatEventDate(user.last_sign_in_at, 'medium') : 'Never'}
            </p>
          </div>
          <div>
            <label className="text-xs text-slate-400 dark:text-slate-500 block mb-1">Sign-in method</label>
            <p className="text-sm font-medium text-slate-950 dark:text-slate-50">Google</p>
          </div>
        </div>

        <div className="flex items-center gap-5 pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className={`w-1.5 h-1.5 rounded-full ${user.email_confirmed_at ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            {user.email_confirmed_at ? 'Email verified' : 'Email not verified'}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className={`w-1.5 h-1.5 rounded-full ${user.phone ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            {user.phone ? 'Phone verified' : 'No phone linked'}
          </span>
        </div>
      </section>

      {/* Account Management */}
      <section className="border-t border-slate-200 dark:border-slate-800 px-6 py-8">
        <h2 className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-5 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Account Management
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Your account is linked to Google. Manage your Google account to change your email or password.
            </p>
            <a
              href="https://myaccount.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mt-2 transition-colors"
            >
              Manage Google Account <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <Button variant="destructive" onClick={() => setDeleteAccountOpen(true)} className="shrink-0">
            Delete Account
          </Button>
        </div>
      </section>

      <div className="flex-1" />
      <Footer />

      <DeleteAccountModal
        isOpen={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
        userEmail={user.email || ''}
      />
    </main>
  )
}
