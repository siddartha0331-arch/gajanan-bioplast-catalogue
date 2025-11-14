import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, TrendingUp, Package, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTiltEffect } from "@/hooks/useTiltEffect";
import { useEffect, useRef, useState } from "react";

const Home = () => {
  const [activeProduct, setActiveProduct] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  
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

  // New arrivals (latest 6 products)
  const newArrivals = products.slice(0, 6);
  
  // Featured products (mix of different types)
  const featuredProducts = products.filter((_, index) => index % 2 === 0).slice(0, 4);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % Math.min(4, products.length));
    }, 4000);
    return () => clearInterval(interval);
  }, [products.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Split Screen Product Showcase */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary">Eco-Friendly Packaging</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
                  <span className="block text-foreground">Gajanan</span>
                  <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Bioplast
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-xl">
                  Crafting sustainable packaging solutions that protect your products and our planet
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/products">
                    <Button size="lg" className="group text-lg px-8 py-6 rounded-full">
                      Explore Products
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full">
                      Get Quote
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="space-y-1">
                  <div className="text-3xl font-black text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Eco-Friendly</div>
                </div>
              </div>
            </div>

            {/* Right - Product Showcase */}
            <div className="relative h-[600px] lg:h-[700px]">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isActive={activeProduct === index}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals - Bento Grid */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-5xl font-black">New Arrivals</h2>
              </div>
              <p className="text-muted-foreground text-lg">Latest additions to our collection</p>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.map((product, index) => (
              <NewArrivalCard key={product.id} product={product} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Product Wall - Masonry Layout */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full">
              <Package className="w-4 h-4 text-secondary" />
              <span className="text-sm font-bold text-secondary">Our Range</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black">Product Gallery</h2>
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

// Floating Product Card Component
const ProductCard = ({ product, isActive, index }: any) => {
  const tiltRef = useTiltEffect<HTMLDivElement>();
  
  const positions = [
    { top: "10%", right: "10%", rotate: "12deg" },
    { top: "25%", right: "25%", rotate: "-8deg" },
    { top: "40%", right: "15%", rotate: "6deg" },
    { top: "55%", right: "30%", rotate: "-10deg" },
  ];

  const position = positions[index % 4];

  return (
    <div
      ref={tiltRef}
      className={`absolute transition-all duration-1000 ${
        isActive ? "opacity-100 scale-100 z-20" : "opacity-0 scale-90 z-10"
      }`}
      style={{ ...position }}
    >
      <Card className="w-80 overflow-hidden shadow-2xl border-2 border-primary/20 tilt-card">
        <div className="relative h-80 group">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
            <div className="inline-block px-3 py-1 bg-primary/90 rounded-full text-xs font-bold text-primary-foreground">
              {product.type}
            </div>
            <h3 className="text-2xl font-black text-white">{product.name}</h3>
            <p className="text-white/80 text-sm line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-2xl font-black text-white">₹{product.price}</span>
              <Link to="/products">
                <Button size="sm" className="rounded-full">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// New Arrival Card
const NewArrivalCard = ({ product, delay }: any) => {
  const tiltRef = useTiltEffect<HTMLDivElement>();
  
  return (
    <div
      ref={tiltRef}
      className="animate-fade-in tilt-card"
      style={{ animationDelay: `${delay}s` }}
    >
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/20">
        <div className="relative h-72 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 px-3 py-1 bg-primary rounded-full text-xs font-bold text-primary-foreground">
            NEW
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">{product.type}</span>
              <span className="text-sm text-muted-foreground">{product.size}</span>
            </div>
            <h3 className="text-xl font-black line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-black text-primary">₹{product.price}</span>
            <Link to="/products">
              <Button size="sm" variant="outline" className="rounded-full">
                View
                <ArrowRight className="ml-1 w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
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
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-white">₹{product.price}</span>
            <Link to="/products">
              <Button size="sm" variant="secondary" className="rounded-full">
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
