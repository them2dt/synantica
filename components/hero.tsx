import { Users, TrendingUp, BookOpen, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <div className="flex flex-col gap-0 items-center">
      {/* Main Hero Section */}
      <div className="flex flex-col items-center justify-center gap-8 text-center h-[90vh]">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
          <span className="text-3xl font-bold text-primary">S</span>
        </div>
        
        <div className="space-y-4">
                                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
            The Swiss Database for
            <span className="text-primary block">Opportunities in STEM and Research</span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground mx-auto max-w-3xl leading-relaxed">
          Discover contests, hackathons, events and workshops todiscover your potential and grow your network.  
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild size="lg" className="h-14 px-8 text-lg">
            <Link href="/dashboard">
              Browse Events
            </Link>
          </Button>
        </div>
      </div>

      {/* Border above features */}
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      
      {/* Event Categories Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full">
        <div className="flex flex-col items-center text-center gap-3 p-6 rounded-xl bg-card/50 hover:bg-card/80 transition-colors">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
                                <h3 className="font-medium text-sm">Workshops</h3>
          <p className="text-xs text-muted-foreground">Skill-building sessions</p>
        </div>

        <div className="flex flex-col items-center text-center gap-3 p-6 rounded-xl bg-card/50 hover:bg-card/80 transition-colors">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600" />
          </div>
                                <h3 className="font-medium text-sm">Social Events</h3>
          <p className="text-xs text-muted-foreground">Networking & community</p>
        </div>

        <div className="flex flex-col items-center text-center gap-3 p-6 rounded-xl bg-card/50 hover:bg-card/80 transition-colors">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
                                <h3 className="font-medium text-sm">Hackathons</h3>
          <p className="text-xs text-muted-foreground">Innovation challenges</p>
        </div>

        <div className="flex flex-col items-center text-center gap-3 p-6 rounded-xl bg-card/50 hover:bg-card/80 transition-colors">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-orange-600" />
          </div>
                                <h3 className="font-medium text-sm">Career Fairs</h3>
          <p className="text-xs text-muted-foreground">Job opportunities</p>
        </div>
      </div>

      {/* Border below features */}
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
