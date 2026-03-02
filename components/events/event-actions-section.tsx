'use client'

import { Share2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Event } from '@/types/event'

export function EventActionsSection({ event }: { event: Event }) {
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: event.name,
                text: event.description,
                url: window.location.href,
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
        }
    }

    const handleContact = () => {
        window.location.href = `mailto:contact@visioncatalyzer.com?subject=Question about ${event.name}`
    }

    return (
        <div className="border border-slate-200 dark:border-slate-800 p-6 mb-8 bg-slate-50 dark:bg-slate-900">
            <div className="flex justify-center gap-3">
                <Button
                    variant="outline"
                    size="lg"
                    className="px-4 sm:px-8"
                    onClick={handleShare}
                >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Event
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    className="px-4 sm:px-8"
                    onClick={handleContact}
                >
                    <Mail className="w-4 h-4 mr-2" />
                    Ask Questions
                </Button>
            </div>
        </div>
    )
}
