import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-12 border-t border-border">
      <div className="mx-auto w-full max-w-[1100px] px-6">
        <div className="flex items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Next Steps
            </div>
            <h2 className="text-3xl leading-tight">
              Ready to find your next opportunity?
            </h2>
            <p className="text-sm text-secondary-foreground">
              Keep the search focused and the details close. The dashboard is built for clarity.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">Explore Opportunities</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
