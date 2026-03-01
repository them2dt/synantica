'use client'

import { UserMenu } from '@/components/user/user-menu'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-[1100px] border-x border-slate-200 items-center px-6">
          <div className="flex items-center space-x-4">
            <span className="font-heading text-xl text-slate-950">
              synantica
            </span>
            <h1 className="text-lg text-slate-950">Admin Panel</h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <UserMenu />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1100px] border-x border-slate-200 bg-white min-h-[calc(100vh-64px)]">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
