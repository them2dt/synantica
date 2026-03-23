import { Footer } from '@/components/layout/footer'
import { NavigationSpacer } from '@/components/layout/navigation-spacer'
import { Button } from '@/components/ui/button'
import { ThemedText } from '@/components/ui/themed-text'
import Link from 'next/link'
import { Trophy, Calendar, Code2, BookOpen, ArrowRight } from 'lucide-react'

const CATEGORIES = [
  {
    title: 'Olympiads',
    copy: 'National and international science olympiads.',
    icon: Trophy,
    type: 'olympiads',
    accent: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
  },
  {
    title: 'Contests',
    copy: 'Ranked competitions across all STEM disciplines.',
    icon: Calendar,
    type: 'contests',
    accent: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    title: 'Hackathons',
    copy: 'Intensive, short-format team challenges.',
    icon: Code2,
    type: 'hackathons',
    accent: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
  },
  {
    title: 'Workshops',
    copy: 'Skill-focused deep dives and bootcamps.',
    icon: BookOpen,
    type: 'workshops',
    accent: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/20',
  },
]

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-[1100px] md:border-x border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-slate-950">
      <div className="flex-1">
        {/* Hero Section */}
        <section className="p-6 pt-16 pb-12">
          <NavigationSpacer />
          <div className="space-y-5">
            <ThemedText variant="xs" color="muted" className="uppercase tracking-widest block">
              Swiss STEM Directory
            </ThemedText>
            <ThemedText variant="h1" as="h1" className="leading-tight">
              The Swiss database for
              <span className="block">STEM and research opportunities</span>
            </ThemedText>
            <ThemedText variant="lg" color="secondary" className="max-w-2xl block">
              A calm, organized view of olympiads, contests, hackathons, and workshops.
              Built for fast scanning, clear totals, and dependable timelines.
            </ThemedText>
            <div className="pt-2">
              <Button asChild size="lg" variant="black">
                <Link href="/dashboard">
                  Explore Opportunities
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Category Grid */}
        <section className="border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {CATEGORIES.map((item, i) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.title}
                  href={`/dashboard?type=${item.type}`}
                  className={`group border-slate-200 dark:border-slate-800 p-5 pt-8 sm:pt-12 transition-colors hover:bg-slate-100 dark:hover:bg-slate-900 ${
                    i % 2 === 0 ? 'border-r' : ''
                  } md:border-r last:border-r-0 ${i < 2 ? 'border-b md:border-b-0' : ''}`}
                >
                  <div className={`inline-flex p-2 mb-3 ${item.bg}`}>
                    <Icon className={`w-5 h-5 ${item.accent}`} />
                  </div>
                  <ThemedText variant="sm" className="block font-medium">{item.title}</ThemedText>
                  <ThemedText variant="xs" color="muted" className="block mt-1">{item.copy}</ThemedText>
                  <span className={`inline-flex items-center gap-1 mt-3 text-xs ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Browse <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Stats/Info Strip */}
        <section className="border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800">
            {[
              { value: 'Free', label: 'Always free to browse' },
              { value: 'CH & EU', label: 'Focused on Switzerland & Europe' },
              { value: 'Live', label: 'Community-submitted listings' },
            ].map((stat) => (
              <div key={stat.label} className="px-4 py-6 text-center">
                <ThemedText variant="lg" className="block font-semibold">{stat.value}</ThemedText>
                <ThemedText variant="xs" color="muted" className="block">{stat.label}</ThemedText>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-slate-200 dark:border-slate-800 px-6 py-10 sm:py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <ThemedText variant="h2" as="h2">
              Know an event that&apos;s missing?
            </ThemedText>
            <ThemedText variant="sm" color="secondary" className="block">
              Submit it to the directory and help other STEM students discover it.
            </ThemedText>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">Open Dashboard</Link>
            </Button>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
