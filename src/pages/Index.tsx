
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Package, Truck, Clock, MapPin, Shield, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "E-commerce Owner",
      content: "TrackletHub has transformed our delivery experience. Our customers love the transparent tracking updates.",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Retail Manager",
      content: "The real-time tracking feature has reduced our customer support inquiries by 45%. Excellent service!",
      avatar: "MC",
    },
    {
      name: "Jessica Williams",
      role: "Online Seller",
      content: "I can finally offer premium shipping experience to my customers without the premium cost.",
      avatar: "JW",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-1 pt-16"> {/* pt-16 accounts for fixed header */}
        <Hero />
        
        {/* Features Section */}
        <section className="py-24 bg-gradient-to-b from-white to-blue-50">
          <div className="container px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">Shipping That You Can Trust</h2>
              <p className="text-slate-600 text-lg">
                Our advanced tracking system provides complete visibility and peace of mind for all your shipping needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all border border-slate-100">
                <div className="mb-5 inline-block p-4 rounded-xl bg-blue-50 text-blue-600">
                  <Package className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-Time Tracking</h3>
                <p className="text-slate-500">Follow your package's journey with precision from dispatch to delivery with minute-by-minute updates.</p>
              </div>
              
              <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all border border-slate-100">
                <div className="mb-5 inline-block p-4 rounded-xl bg-blue-50 text-blue-600">
                  <Truck className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Nationwide Coverage</h3>
                <p className="text-slate-500">Reliable shipping across the entire country with extensive coverage, even to remote areas.</p>
              </div>
              
              <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all border border-slate-100">
                <div className="mb-5 inline-block p-4 rounded-xl bg-blue-50 text-blue-600">
                  <Clock className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Timely Delivery</h3>
                <p className="text-slate-500">Commitment to punctuality with accurate delivery estimates and expedited options when you need them.</p>
              </div>
              
              <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all border border-slate-100">
                <div className="mb-5 inline-block p-4 rounded-xl bg-blue-50 text-blue-600">
                  <MapPin className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Location Updates</h3>
                <p className="text-slate-500">Know exactly where your package is at each step of its journey with detailed location information.</p>
              </div>
              
              <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all border border-slate-100">
                <div className="mb-5 inline-block p-4 rounded-xl bg-blue-50 text-blue-600">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure Shipping</h3>
                <p className="text-slate-500">Your packages are handled with care, with insurance options available for high-value items.</p>
              </div>
              
              <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all border border-slate-100">
                <div className="mb-5 inline-block p-4 rounded-xl bg-blue-50 text-blue-600">
                  <Phone className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
                <p className="text-slate-500">Our customer service team is available around the clock to address any concerns about your shipments.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-24 bg-white">
          <div className="container px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Businesses Nationwide</h2>
              <p className="text-slate-600 text-lg">
                Join thousands of satisfied customers who rely on our courier services every day.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="p-8 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-medium">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 italic">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Ship with Confidence?</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Experience premium courier services with transparent tracking and reliable delivery times.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/track">
                  <Button size="lg" variant="secondary" className="h-14 px-8 text-base font-medium rounded-full">
                    Track a Package
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" className="h-14 px-8 text-base font-medium bg-white text-blue-700 hover:bg-blue-50 rounded-full">
                    Create Shipment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-12 bg-blue-900 text-white">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-6 w-6" />
                <span className="text-xl font-medium tracking-tight">TrackletHub</span>
              </div>
              <p className="text-blue-200 text-sm">
                Premium courier services with real-time tracking and nationwide coverage.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Contact</h4>
              <ul className="space-y-2 text-blue-200">
                <li>1234 Shipping Lane</li>
                <li>Los Angeles, CA 90001</li>
                <li>contact@tracklethub.com</li>
                <li>(555) 123-4567</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Connect With Us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-blue-800 text-center text-sm text-blue-300">
            <p>© {new Date().getFullYear()} TrackletHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
