'use client'

interface DashboardTabsProps {
    activeTab: 'all' | 'mine'
    onTabChange: (tab: 'all' | 'mine') => void
    isAuthenticated: boolean
}

export function DashboardTabs({ activeTab, onTabChange, isAuthenticated }: DashboardTabsProps) {
    if (!isAuthenticated) return null

    return (
        <div className="flex gap-1 border-b border-slate-100">
            <button
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                onClick={() => onTabChange('all')}
            >
                All Events
            </button>
            <button
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'mine' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                onClick={() => onTabChange('mine')}
            >
                My Events
            </button>
        </div>
    )
}
