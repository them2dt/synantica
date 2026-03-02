'use client'

import { InlineSpinner } from '@/components/ui/loading'

export function DashboardLoading() {
    return (
        <div className="flex items-center justify-center py-20 text-slate-500">
            <div className="flex flex-col items-center gap-4">
                <InlineSpinner className="w-8 h-8" />
                <p>Loading directory...</p>
            </div>
        </div>
    )
}
