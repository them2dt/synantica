import { Users, Briefcase, Trophy, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <div className="flex flex-col gap-0 items-center w-full">
      {/* Main Hero Section */}
      <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 text-center h-[85vh] sm:h-[90vh] px-4 sm:px-6">
        
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight font-heading">
            The Swiss Database for
            <span className="text-primary block">Opportunities in STEM and Research</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mx-auto max-w-3xl leading-relaxed">
            Discover contests, hackathons, events and workshops to discover your potential and grow your network.  
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto">
          <Button asChild size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-accent text-accent-foreground hover:bg-accent/90 hover:text-white transition-colors w-full sm:w-auto">
            <Link href="/dashboard">
              Explore Opportunities
            </Link>
          </Button>
        </div>
      </div>

      {/* Border above features */}
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-6 sm:my-8" />
      
      {/* Event Categories Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl w-full px-4 sm:px-6">
        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-xl bg-card/50 hover:bg-card/80 transition-colors touch-manipulation">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-xs sm:text-sm font-heading">Contests</h3>
        </div>

        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-xl bg-card/50 hover:bg-card/80 transition-colors touch-manipulation">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-xs sm:text-sm font-heading">Events</h3>
        </div>

        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-xl bg-card/50 hover:bg-card/80 transition-colors touch-manipulation">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Network className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-xs sm:text-sm font-heading">Hackathons</h3>
        </div>

        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-xl bg-card/50 hover:bg-card/80 transition-colors touch-manipulation">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-xs sm:text-sm font-heading leading-tight">Workshops & Study weeks</h3>
        </div>
      </div>

      {/* Border below features */}
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-6 sm:my-8" />
    </div>
  );
}
