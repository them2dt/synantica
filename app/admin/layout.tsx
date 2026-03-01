'use client'

import { UserMenu } from '@/components/user/user-menu'
import { Logo } from '@/components/ui/logo'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center px-6">
          <div className="flex items-center space-x-4">
            <Logo />
            <h1 className="text-lg text-neutral-950">Admin Panel</h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <UserMenu />
          </div>
        </div>
      </header>
      <main>
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
