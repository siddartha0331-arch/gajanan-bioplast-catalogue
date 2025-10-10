import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative border-t border-border bg-gradient-to-br from-muted/30 via-background to-muted/30">
      {/* Top Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gradient">
              Gajanan Bioplast
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Leading manufacturer and wholesaler of eco-friendly non-woven bags, PP woven bags, and BOPP bags.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xs font-medium text-primary">GSTIN: 27DCPPG5295F1Z6</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 lg:col-span-2">
            <h4 className="text-lg font-bold">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Address</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    5 No.148, Shop No.3, Shanta Kunj, Near Videocon, Vakodi Road, Doctor Colony, Ahmednagar 414001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Phone</p>
                  <div className="space-y-1">
                    <a
                      href="tel:9834711168"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                    >
                      9834711168
                    </a>
                    <a
                      href="tel:9975070068"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                    >
                      9975070068
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Gajanan Bioplast. All rights reserved.</p>
            <p className="flex items-center gap-2">
              Made with <span className="text-accent">❤</span> by Siddartha
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
