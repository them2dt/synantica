'use client'

import { Globe, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function EventResourcesSection({ links }: { links?: string[] }) {
    if (!links || links.length === 0) return null

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Globe className="w-5 h-5 text-slate-500" />
                    Resources
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {links.map((link, index) => (
                        <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-900/60 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-950 dark:text-slate-50">Resource {index + 1}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500 ml-auto" />
                        </a>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
