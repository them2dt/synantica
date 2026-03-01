import { Hero } from "@/components/marketing/hero";
import { CTASection } from "@/components/marketing/cta-section";
import { Footer } from "@/components/layout";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="mx-auto w-full max-w-[1100px] px-6 py-12 space-y-16">
          <Hero />
          <CTASection />
        </div>
      </div>
      <Footer />
    </main>
  );
}
