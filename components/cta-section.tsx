import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-8">
            <Logo size="xxxl" showText={false} />
          </div>
          
                                <h2 className="text-3xl lg:text-5xl font-semibold mb-6 font-heading">
            Ready to find your next opportunity?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg">
              <Link href="/dashboard">
                Explore Opportunities
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
