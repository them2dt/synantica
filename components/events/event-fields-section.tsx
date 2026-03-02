'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function EventFieldsSection({ fields }: { fields: string[] }) {
    if (!fields || fields.length === 0) return null

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle className="text-base font-medium">Fields</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {fields.map((field, index) => (
                        <Badge key={index} variant="outline" className="text-slate-500 font-normal">
                            {field}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
