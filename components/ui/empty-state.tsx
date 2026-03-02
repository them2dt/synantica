'use client'

import { LucideIcon } from 'lucide-react'
import { ThemedText } from './themed-text'

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description?: string
    className?: string
}

export function EmptyState({ icon: Icon, title, description, className = '' }: EmptyStateProps) {
    return (
        <div className={`py-16 flex flex-col items-center justify-center text-center space-y-4 ${className}`}>
            <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-none">
                <Icon className="h-12 w-12 text-slate-400 dark:text-slate-500" />
            </div>
            <div className="space-y-1">
                <ThemedText variant="lg" className="block font-medium">{title}</ThemedText>
                {description && (
                    <ThemedText color="muted" className="block text-sm max-w-xs mx-auto">
                        {description}
                    </ThemedText>
                )}
            </div>
        </div>
    )
}
