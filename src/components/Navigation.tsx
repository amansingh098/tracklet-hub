
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Package, Search, User, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      // Check if user has admin privileges - you would need to store this in your database
      // This is just a placeholder logic
      if (user) {
        // Example: check user's email to determine if admin
        setIsAdmin(user.email === "admin@example.com");
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { name: "Home", path: "/", icon: <Package className="h-5 w-5" /> },
    { name: "Track Order", path: "/track", icon: <Search className="h-5 w-5" /> },
    ...(isLoggedIn && isAdmin
      ? [{ name: "Dashboard", path: "/dashboard", icon: <User className="h-5 w-5" /> }]
      : []),
    ...(isLoggedIn
      ? []
      : [{ name: "Login", path: "/login", icon: <LogIn className="h-5 w-5" /> }]),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-morphism">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-xl font-medium tracking-tight">TrackletHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-standard",
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-morphism animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-2 py-2 text-sm font-medium transition-standard",
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={closeMenu}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
