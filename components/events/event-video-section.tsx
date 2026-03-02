'use client'

import { ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { getYouTubeVideoId } from '@/lib/utils/youtube'

export function EventVideoSection({ videoLink, eventName }: { videoLink: string, eventName: string }) {
    const videoId = getYouTubeVideoId(videoLink)

    if (!videoId) return null

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <ExternalLink className="w-5 h-5 text-slate-500" />
                    Video
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="aspect-video w-full">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={`${eventName} - Video`}
                        className="w-full h-full rounded-none border border-slate-200 dark:border-slate-800"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </CardContent>
        </Card>
    )
}
