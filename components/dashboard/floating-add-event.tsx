'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemedText } from '@/components/ui/themed-text'

interface FloatingAddEventProps {
    onClick: () => void
}

export function FloatingAddEvent({ onClick }: FloatingAddEventProps) {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <Button onClick={onClick} className='shadow-lg shadow-slate-950/25 dark:shadow-slate-950/50'>
                <Plus className="w-5 h-5" />
                <ThemedText variant="base">Create Event</ThemedText>
            </Button>
        </div>
    )
}
