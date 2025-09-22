'use client'

import { UserMenu } from '@/components/user/user-menu'
import { Logo } from '@/components/ui/logo'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <div className="flex items-center space-x-4">
            <Logo />
            <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <UserMenu />
          </div>
        </div>
      </header>
      <main>
        <div className="w-full px-5">
          {children}
        </div>
      </main>
    </div>
  )
}
