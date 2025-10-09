import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Gajanan Bioplast
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <Button asChild variant="default" className="bg-gradient-to-r from-primary to-accent">
                <Link to="/dashboard">
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild variant="default" className="bg-gradient-to-r from-primary to-accent">
                <Link to="/auth">Login / Sign Up</Link>
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              <a
                href="https://wa.me/919834711168?text=Hello%20Gajanan%20Bioplast,%20I%20would%20like%20to%20enquire%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Us
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <Button asChild className="w-full mt-2 bg-gradient-to-r from-primary to-accent">
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild className="w-full mt-2 bg-gradient-to-r from-primary to-accent">
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  Login / Sign Up
                </Link>
              </Button>
            )}
            <Button
              asChild
              className="w-full mt-2 bg-gradient-to-r from-primary to-accent"
            >
              <a
                href="https://wa.me/919834711168?text=Hello%20Gajanan%20Bioplast,%20I%20would%20like%20to%20enquire%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Us
              </a>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
