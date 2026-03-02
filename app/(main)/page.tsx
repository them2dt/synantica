import { Footer } from '@/components/layout/footer'
import { NavigationSpacer } from '@/components/layout/navigation-spacer'
import { Button } from '@/components/ui/button'
import { ThemedText } from '@/components/ui/themed-text'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-[1100px] md:border-x border-slate-200 flex flex-col">
      <div className="flex-1">
        {/* Hero Section */}
        <section className="p-6 pt-16">
          <NavigationSpacer />
          <div className="space-y-4">
            <ThemedText variant="xs" color="muted" className="uppercase block">
              Swiss STEM Directory
            </ThemedText>
            <ThemedText variant="h1" as="h1">
              The Swiss database for
              <span className="block">STEM and research opportunities</span>
            </ThemedText>
            <ThemedText variant="lg" color="secondary" className="max-w-2xl block">
              A calm, organized view of contests, hackathons, events, and workshops.
              Built for fast scanning, clear totals, and dependable timelines.
            </ThemedText>
          </div>
        </section>

        <section className="border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { title: 'Contests', copy: 'National and international competitions.' },
              { title: 'Events', copy: 'Career fairs and networking sessions.' },
              { title: 'Hackathons', copy: 'Intensive, short-format challenges.' },
              { title: 'Workshops', copy: 'Skill-focused deep dives.' },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`border-slate-200 p-4 pt-8 sm:pt-12 ${i % 2 === 0 ? 'border-r' : ''
                  } md:border-r last:border-r-0 ${i < 2 ? 'border-b md:border-b-0' : ''
                  }`}
              >
                <ThemedText variant="sm" className="block">{item.title}</ThemedText>
                <ThemedText variant="xs" color="muted" className="block">{item.copy}</ThemedText>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-slate-200 px-6 py-10 sm:py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <ThemedText variant="h2" as="h2">
              Ready to find your next opportunity?
            </ThemedText>
            <ThemedText variant="sm" color="secondary" className="block">
              Keep the search focused and the details close. The dashboard is built for clarity.
            </ThemedText>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">Explore Opportunities</Link>
            </Button>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
