
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Package, Truck, Clock } from "lucide-react";
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
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100 via-white to-white"></div>
      
      {/* Abstract shapes */}
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-indigo-50/40 blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-50/30 blur-3xl -z-10"></div>
      
      <div className="container px-4 text-center max-w-4xl animate-fade-in">
        <div className="inline-block mb-8">
          <div className="px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold tracking-wide uppercase animate-slide-in">
            Fast · Reliable · Transparent
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-balance bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 animate-slide-in animate-delay-100">
          Track your deliveries with precision
        </h1>
        
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto animate-slide-in animate-delay-200">
          Stay informed about your packages at every step of their journey with our real-time tracking system.
        </p>
        
        <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto mb-12 animate-slide-in animate-delay-300">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Enter tracking number"
              className="pl-12 w-full h-14 rounded-full text-base bg-white/80 backdrop-blur-sm border-slate-200 shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto h-14 px-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:shadow-blue-500/20 transition-all">
            Track <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
        
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 animate-fade-in animate-delay-300">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all">
            <div className="p-3 bg-blue-50 rounded-lg inline-block mb-4">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
            <p className="text-slate-500">Get instant notifications as your package moves through our delivery network</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all">
            <div className="p-3 bg-blue-50 rounded-lg inline-block mb-4">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nationwide Coverage</h3>
            <p className="text-slate-500">Extensive network reaching every corner of the country with reliable service</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all">
            <div className="p-3 bg-blue-50 rounded-lg inline-block mb-4">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Timely Delivery</h3>
            <p className="text-slate-500">Precise delivery estimates with our commitment to punctuality</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
