
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import Navigation from "@/components/Navigation";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-16 flex items-center justify-center">
        <div className="container px-4 py-12 text-center max-w-md">
          <div className="mb-6 inline-flex items-center justify-center p-6 rounded-full bg-blue-50">
            <Package className="h-12 w-12 text-primary" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Oops! This page seems to have gotten lost in transit.
          </p>
          
          <Button asChild size="lg">
            <Link to="/">
              Return to Home
            </Link>
          </Button>
        </div>
      </main>
      
      <footer className="py-6 bg-white border-t">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TrackletHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
