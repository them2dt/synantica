import { Hero } from "@/components/hero";
import { FeaturesSection } from "@/components/features-section";
import { StatsSection } from "@/components/stats-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/layout";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="flex-1 w-full">
          <Hero />
          <FeaturesSection />
          <StatsSection />
          <CTASection />
        </div>

        <Footer />
      </div>
    </main>
  );
}
