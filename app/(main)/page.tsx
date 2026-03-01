import { Hero } from "@/components/marketing/hero";
import { CTASection } from "@/components/marketing/cta-section";
import { Footer } from "@/components/layout";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="flex-1 w-full">
          <Hero />
          <CTASection />
        </div>

        <Footer />
      </div>
    </main>
  );
}
