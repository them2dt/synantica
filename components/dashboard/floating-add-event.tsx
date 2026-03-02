'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FloatingAddEventProps {
    onClick: () => void
}

export function FloatingAddEvent({ onClick }: FloatingAddEventProps) {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <Button onClick={onClick} className='shadow-lg shadow-slate-950/25'>
                <Plus className="w-5 h-5" />
                <span>Create Event</span>
            </Button>
        </div>
    )
}
