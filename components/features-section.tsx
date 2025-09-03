import { Calendar, Users, FileText, Bell, Search, Filter } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: "Comprehensive Event Discovery",
      description: "Browse workshops, hackathons, career fairs, and networking events all in one place. Never miss an opportunity to advance your career.",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Users,
      title: "Easy RSVP & Networking",
      description: "Join events with one click and connect with like-minded students. Build your professional network while attending career-focused events.",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: FileText,
      title: "Event Resources & Materials",
      description: "Access PDFs, presentation slides, and other resources shared by event organizers. Download materials to continue learning after the event.",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Get notified about new events matching your interests, upcoming deadlines, and important updates from events you've joined.",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: Search,
      title: "Advanced Search & Filtering",
      description: "Find events by date, location, type, or relevant tags. Filter by your interests to discover the most relevant opportunities.",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: Filter,
      title: "Personalized Recommendations",
      description: "Get event suggestions based on your profile, past attendance, and career interests. Discover events tailored to your goals.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-header-bold mb-4">
            Everything You Need to Advance Your Career
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Synentica connects you with the events and opportunities that matter most for your professional development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl bg-background border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-header-medium mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
