import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Gajanan Bioplast
            </h3>
            <p className="text-sm text-muted-foreground">
              Leading manufacturer and wholesaler of eco-friendly non-woven bags, PP woven bags, and BOPP bags.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              GSTIN: 27DCPPG5295F1Z6
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                <p>
                  5 No.148, Shop No.3, Shanta Kunj, Near Videocon, Vakodi Road, Doctor Colony, Ahmednagar 414001
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <p>9834711168, 9975070068</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-primary transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Gajanan Bioplast. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ by Siddartha</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
