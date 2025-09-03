import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-3xl font-header-bold text-primary">S</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-header-bold mb-6">
            Ready to Accelerate Your Career?
          </h2>
          
          <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students who are already discovering opportunities, 
            building networks, and advancing their careers through Synentica.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="h-14 px-8 text-lg">
              <Link href="/auth/sign-up">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg">
              <Link href="/auth/login">
                Sign In to Your Account
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Free for all students • Join in under 2 minutes
          </p>
        </div>
      </div>
    </section>
  );
}
