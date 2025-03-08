
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Package, Truck, Clock, MapPin } from "lucide-react";

const Index = () => {
  const features = [
    {
      title: "Real-Time Tracking",
      description: "Follow your package's journey with precision from dispatch to delivery",
      icon: <Package className="h-6 w-6 text-primary" />,
    },
    {
      title: "Nationwide Coverage",
      description: "Reliable shipping across the entire country with extensive coverage",
      icon: <Truck className="h-6 w-6 text-primary" />,
    },
    {
      title: "Timely Delivery",
      description: "Commitment to punctuality with accurate delivery estimates",
      icon: <Clock className="h-6 w-6 text-primary" />,
    },
    {
      title: "Location Updates",
      description: "Know exactly where your package is at each step of its journey",
      icon: <MapPin className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-16"> {/* pt-16 accounts for fixed header */}
        <Hero />
        
        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Track with Confidence</h2>
              <p className="text-muted-foreground">
                Our advanced tracking system provides visibility and peace of mind for all your shipping needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl glass-morphism transition-standard hover:shadow-lg"
                >
                  <div className="mb-4 inline-block p-3 rounded-lg bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-blue-50">
          <div className="container px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Send a Package Today</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Experience premium courier services with transparent tracking and reliable delivery times.
            </p>
            <Button size="lg" className="h-12 px-8 text-base font-medium">
              Contact Us
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="py-8 bg-white border-t">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TrackletHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
