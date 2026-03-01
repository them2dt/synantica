import { Footer } from '@/components/layout/footer'
import { NavigationSpacer } from '@/components/layout/navigation-spacer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-[1100px] border-x border-slate-200 flex flex-col">
      <div className="flex-1">
        {/* Hero Section */}
        <section className="p-6 pt-16">
          <NavigationSpacer />
          <div className="space-y-4">
            <p className="text-xs uppercase text-slate-500">
              Swiss STEM Directory
            </p>
            <h1 className="text-6xl">
              The Swiss database for
              <span className="block">STEM and research opportunities</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              A calm, organized view of contests, hackathons, events, and workshops.
              Built for fast scanning, clear totals, and dependable timelines.
            </p>
          </div>
        </section>
        <section className="border-t border-slate-200">

          <div className="flex flex-row">
            {[
              { title: 'Contests', copy: 'National and international competitions.' },
              { title: 'Events', copy: 'Career fairs and networking sessions.' },
              { title: 'Hackathons', copy: 'Intensive, short-format challenges.' },
              { title: 'Workshops', copy: 'Skill-focused deep dives.' },
            ].map((item) => (
              <div key={item.title} className="flex-1 border-r border-slate-200 p-4 pt-12 last:border-r-0">
                <div className="text-sm text-slate-950">{item.title}</div>
                <div className="text-xs text-slate-500">{item.copy}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-slate-200 px-6 py-12 flex items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-3xl">
              Ready to find your next opportunity?
            </h2>
            <p className="text-sm text-slate-600">
              Keep the search focused and the details close. The dashboard is built for clarity.
            </p>
          </div>
          <div className="flex gap-3">
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
