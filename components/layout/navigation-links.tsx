'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function NavigationLinks() {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === '/') {
            return pathname === '/'
        }
        return pathname.startsWith(path)
    }

    return (
        <div className="flex items-center gap-4">
            <Link
                href="/"
                className={cn(
                    'text-sm transition-colors',
                    isActive('/') ? 'text-slate-950' : 'text-slate-500 hover:text-slate-950'
                )}
            >
                Home
            </Link>
            <Link
                href="/dashboard"
                className={cn(
                    'text-sm transition-colors',
                    isActive('/dashboard') ? 'text-slate-950' : 'text-slate-500 hover:text-slate-950'
                )}
            >
                Dashboard
            </Link>
        </div>
    )
}
