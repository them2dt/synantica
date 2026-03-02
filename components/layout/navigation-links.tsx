'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NavigationLinksProps {
    vertical?: boolean
}

export function NavigationLinks({ vertical = false }: NavigationLinksProps = {}) {
    const pathname = usePathname()
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        fetch('/api/admin/check')
            .then((res) => res.json())
            .then((data) => setIsAdmin(data.isAdmin === true))
            .catch(() => setIsAdmin(false))
    }, [])

    const isActive = (path: string) => {
        if (path === '/') {
            return pathname === '/'
        }
        return pathname.startsWith(path)
    }

    return (
        <div className={cn('flex items-center gap-4', vertical && 'flex-col items-start')}>
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
            {isAdmin && (
                <Link
                    href="/admin"
                    className={cn(
                        'text-sm transition-colors',
                        isActive('/admin') ? 'text-slate-950' : 'text-slate-500 hover:text-slate-950'
                    )}
                >
                    Admin
                </Link>
            )}
        </div>
    )
}
