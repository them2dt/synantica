import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="w-full">
      <div className="space-y-12">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Swiss STEM Directory
          </p>
          <h1 className="text-6xl leading-tight text-slate-950">
            The Swiss database for
            <span className="block">STEM and research opportunities</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            A calm, organized view of contests, hackathons, events, and workshops.
            Built for fast scanning, clear totals, and dependable timelines.
          </p>
        </div>

        <div className="flex flex-row gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard">Explore Opportunities</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/dashboard">Open Dashboard</Link>
          </Button>
        </div>

        <div className="border border-slate-200 bg-slate-950 text-slate-50 p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-50/70">
            Primary Block
          </p>
          <h2 className="mt-3 text-3xl">
            Prioritize the totals, then the deadlines.
          </h2>
          <p className="mt-2 text-base text-slate-50/70 max-w-2xl">
            The dashboard keeps attention on counts, dates, and status — with editing
            handled in focused sheets instead of scattered pages.
          </p>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <div className="grid gap-6 grid-cols-4">
            {[
              { title: 'Contests', copy: 'National and international competitions.' },
              { title: 'Events', copy: 'Career fairs and networking sessions.' },
              { title: 'Hackathons', copy: 'Intensive, short-format challenges.' },
              { title: 'Workshops', copy: 'Skill-focused deep dives.' },
            ].map((item) => (
              <div key={item.title} className="space-y-2">
                <div className="text-sm text-slate-950">{item.title}</div>
                <div className="text-xs text-slate-500">{item.copy}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
