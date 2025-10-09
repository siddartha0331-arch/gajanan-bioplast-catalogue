import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Building2, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your trusted partner in eco-friendly packaging solutions
          </p>
        </div>

        {/* Company Info */}
        <div className="max-w-4xl mx-auto mb-16 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <Card className="border-none shadow-lg">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Gajanan Bioplast
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Gajanan Bioplast is a leading manufacturer and wholesaler of high-quality,
                eco-friendly non-woven bags, PP woven bags, and BOPP laminated bags. Based in
                Ahmednagar, we are committed to providing sustainable packaging solutions that
                meet the diverse needs of our clients while protecting our environment.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With years of experience in the industry, we pride ourselves on delivering
                products that combine durability, functionality, and environmental
                responsibility. Our bags are perfect for retail, grocery, industrial, and
                promotional use.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Location</h3>
                  <p className="text-muted-foreground">
                    5 No.148, Shop No.3, Shanta Kunj,<br />
                    Near Videocon, Vakodi Road,<br />
                    Doctor Colony, Ahmednagar 414001
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Contact</h3>
                  <p className="text-muted-foreground mb-2">
                    <a href="tel:9834711168" className="hover:text-primary transition-colors">
                      9834711168
                    </a>
                  </p>
                  <p className="text-muted-foreground">
                    <a href="tel:9975070068" className="hover:text-primary transition-colors">
                      9975070068
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">GSTIN</h3>
                  <p className="text-muted-foreground font-mono">
                    27DCPPG5295F1Z6
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Business Type</h3>
                  <p className="text-muted-foreground">
                    Manufacturer & Wholesaler<br />
                    Eco-Friendly Packaging Solutions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Special Message */}
        <div className="max-w-2xl mx-auto text-center animate-fade-up" style={{ animationDelay: "0.6s" }}>
          <Card className="border-none shadow-lg bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <p className="text-muted-foreground italic">
                "This website is created as a special gift with love by Siddartha 💜"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
