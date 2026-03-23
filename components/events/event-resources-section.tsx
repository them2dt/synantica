'use client'

import { Globe, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

function getLinkLabel(url: string): string {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')
    // Capitalize first letter and clean up
    return host.charAt(0).toUpperCase() + host.slice(1)
  } catch {
    return url
  }
}

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
              <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-sm text-slate-950 dark:text-slate-50 flex-1 truncate">
                {getLinkLabel(link)}
              </span>
              <span className="text-xs text-slate-400 truncate max-w-[200px] hidden sm:block">{link}</span>
              <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
