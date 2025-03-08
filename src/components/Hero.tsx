
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Hero = () => {
  const [trackingId, setTrackingId] = useState("");
  const navigate = useNavigate();

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingId.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }
    
    navigate(`/track?id=${trackingId}`);
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50 via-white to-white"></div>
      
      {/* Abstract shapes */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-100/50 blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-50/50 blur-3xl -z-10 animate-pulse"></div>
      
      <div className="container px-4 text-center max-w-3xl animate-fade-in">
        <div className="inline-block mb-6">
          <div className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium animate-slide-in">
            Fast, Reliable, Transparent
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-balance animate-slide-in animate-delay-100">
          Track your packages with precision
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-in animate-delay-200">
          Real-time tracking and notifications keep you informed every step of the way. Enter your tracking ID to get started.
        </p>
        
        <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto animate-slide-in animate-delay-300">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Enter tracking number"
              className="pl-10 w-full h-12 subtle-glass"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto h-12 px-6">
            Track <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Hero;
