import { TrendingUp, Users, Calendar, Award } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: Calendar,
      number: "500+",
      label: "Events This Year",
      description: "Career-focused workshops, hackathons, and networking events"
    },
    {
      icon: Users,
      number: "2,500+",
      label: "Active Students",
      description: "Building their professional network and advancing their careers"
    },
    {
      icon: TrendingUp,
      number: "85%",
      label: "Career Impact",
      description: "Students report improved job prospects after attending events"
    },
    {
      icon: Award,
      number: "50+",
      label: "Partner Companies",
      description: "Leading organizations hosting career fairs and workshops"
    }
  ];

  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
                                <h2 className="text-3xl lg:text-4xl font-semibold mb-4 font-heading">
            Join Thousands of Students Advancing Their Careers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Synantica has helped students discover opportunities, build networks, and accelerate their professional growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-background border border-border"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <h3 className="text-lg font-semibold mb-2 font-heading">
                  {stat.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
