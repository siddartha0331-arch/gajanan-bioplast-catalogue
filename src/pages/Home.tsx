import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Package, Leaf, Shield, Award, Users, Recycle, CheckCircle2, Target, Heart, TrendingUp, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Testimonials } from "@/components/home/Testimonials";

const Home = () => {
  // Fetch all products
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const scrollToProducts = () => {
    const element = document.getElementById("product-gallery");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Brand Story */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Sustainable Packaging Solutions</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span className="block text-foreground mb-2">Gajanan Bioplast</span>
                <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Redefining Packaging Standards
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We craft premium eco-friendly packaging that doesn't just protect your products—it reflects your commitment to sustainability and quality.
              </p>

              <div className="flex flex-wrap gap-4 justify-center pt-6">
                <Link to="/products">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                    Explore Products
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full">
                    Get Custom Quote
                  </Button>
                </Link>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="text-4xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground font-medium">Satisfied Clients</div>
              </div>
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="text-4xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground font-medium">Years Experience</div>
              </div>
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="text-4xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground font-medium">Product Variants</div>
              </div>
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="text-4xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground font-medium">Eco-Friendly</div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <button 
              onClick={scrollToProducts}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
            >
              <ChevronDown className="w-8 h-8 text-muted-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* Values & Quality Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on trust, driven by quality, committed to sustainability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Quality Commitment */}
            <Card className="p-8 space-y-4 border-2 hover:border-primary/50 transition-colors animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Quality First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every product undergoes rigorous quality checks. We maintain the highest standards in manufacturing, ensuring durability and reliability in every piece.
              </p>
            </Card>

            {/* Eco-Friendly */}
            <Card className="p-8 space-y-4 border-2 hover:border-primary/50 transition-colors animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Recycle className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">100% Sustainable</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our biodegradable materials break down naturally, leaving zero environmental footprint. We're not just selling bags—we're protecting our planet.
              </p>
            </Card>

            {/* Certified Excellence */}
            <Card className="p-8 space-y-4 border-2 hover:border-primary/50 transition-colors animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Award className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Certified & Trusted</h3>
              <p className="text-muted-foreground leading-relaxed">
                ISO certified and compliant with all environmental regulations. Our certifications speak to our commitment to excellence and transparency.
              </p>
            </Card>

            {/* Custom Solutions */}
            <Card className="p-8 space-y-4 border-2 hover:border-primary/50 transition-colors animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Custom Solutions</h3>
              <p className="text-muted-foreground leading-relaxed">
                From custom sizes to branded printing, we tailor our products to match your exact specifications. Your vision, our expertise.
              </p>
            </Card>

            {/* Customer First */}
            <Card className="p-8 space-y-4 border-2 hover:border-primary/50 transition-colors animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Users className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Client Focused</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our 500+ satisfied clients trust us for consistent quality, timely delivery, and exceptional service. Your success is our priority.
              </p>
            </Card>

            {/* Reliable Partner */}
            <Card className="p-8 space-y-4 border-2 hover:border-primary/50 transition-colors animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Heart className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Built to Last</h3>
              <p className="text-muted-foreground leading-relaxed">
                Over a decade of experience in sustainable packaging. We've grown with our clients, building lasting relationships based on trust and quality.
              </p>
            </Card>
          </div>

          {/* Process Overview */}
          <div className="mt-24 max-w-4xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">Our Promise</h3>
              <p className="text-lg text-muted-foreground">
                Simple, transparent, and reliable
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold text-lg text-foreground">Premium Materials</h4>
                <p className="text-sm text-muted-foreground">
                  Only the finest biodegradable materials that meet international standards
                </p>
              </div>
              
              <div className="text-center space-y-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold text-lg text-foreground">Timely Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  Efficient production and logistics ensure your orders arrive on schedule
                </p>
              </div>
              
              <div className="text-center space-y-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold text-lg text-foreground">Dedicated Support</h4>
                <p className="text-sm text-muted-foreground">
                  Our team is always ready to assist with orders, customization, and inquiries
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Product Wall - Masonry Layout */}
      <section id="product-gallery" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full">
              <Package className="w-4 h-4 text-secondary" />
              <span className="text-sm font-bold text-secondary">Our Range</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-foreground">Product Gallery</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our complete range of eco-friendly packaging solutions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <ProductWallCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" className="rounded-full px-8">
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur rounded-full">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">Make the Switch Today</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Packaging?
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of businesses making the sustainable choice. Get a custom quote today.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link to="/contact">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full">
                  Contact Sales Team
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full">
                  Explore Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Product Wall Card
const ProductWallCard = ({ product, index }: any) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (!ref) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ref.classList.add("active");
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(ref);
    return () => observer.unobserve(ref);
  }, [ref]);

  const isLarge = index % 7 === 0;

  return (
    <div
      ref={setRef}
      className={`group relative overflow-hidden rounded-2xl opacity-0 translate-y-8 transition-all duration-700 ${
        isLarge ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <div className={`relative ${isLarge ? "h-96" : "h-64"} overflow-hidden`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
          <span className="text-xs font-bold text-white/80 mb-2">{product.type}</span>
          <h3 className="text-lg font-black text-white mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-end">
            <Link to="/products">
              <Button size="sm" variant="secondary" className="rounded-full">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
