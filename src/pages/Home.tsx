import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Package, Leaf, BadgeCheck, Sparkles, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import heroBags from "@/assets/hero-bags.jpg";
import { products } from "@/data/products";

const Home = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Asymmetric Modern Design */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-muted">
        {/* Background Mesh Gradient */}
        <div className="absolute inset-0 bg-mesh opacity-60" />
        
        {/* Animated Blob */}
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-accent/20 to-primary/20 blur-3xl" style={{ animation: "float 8s ease-in-out infinite reverse" }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-fade-up">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Eco-Friendly Solutions</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <span className="text-gradient">Gajanan</span>
                <br />
                <span className="text-foreground">Bioplast</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
                Premium quality non-woven & PP bags designed for a sustainable future
              </p>
              
              <div className="flex flex-wrap gap-3 text-sm font-medium animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <span className="px-4 py-2 rounded-full bg-card border border-border">D Cut Bags</span>
                <span className="px-4 py-2 rounded-full bg-card border border-border">W Cut Bags</span>
                <span className="px-4 py-2 rounded-full bg-card border border-border">BOPP Bags</span>
                <span className="px-4 py-2 rounded-full bg-card border border-border">PP Woven</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-[var(--shadow-elegant)] transition-all duration-300 text-lg px-8 py-6 h-auto"
                >
                  <Link to="/products">
                    Explore Products <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 text-lg px-8 py-6 h-auto"
                >
                  <a
                    href="https://wa.me/919834711168?text=Hello%20Gajanan%20Bioplast,%20I%20would%20like%20to%20enquire%20about%20your%20products."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get in Touch
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-[var(--shadow-elegant)]">
                <img
                  src={heroBags}
                  alt="Premium quality bags"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 mix-blend-overlay" />
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-[var(--shadow-card)] border border-border animate-scale-in" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gradient">100%</p>
                    <p className="text-sm text-muted-foreground">Quality Assured</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid Style */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold">
              Why Choose <span className="text-gradient-secondary">Us</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Industry-leading quality meets environmental responsibility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-border hover:border-primary card-hover bg-gradient-to-br from-card to-muted/30 overflow-hidden group">
              <CardContent className="p-8">
                <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Extensive Range</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Complete collection of D Cut, W Cut, PP Woven, and BOPP bags tailored for every industry need.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border hover:border-accent card-hover bg-gradient-to-br from-card to-muted/30 overflow-hidden group">
              <CardContent className="p-8">
                <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Eco-Conscious</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sustainable materials and manufacturing processes for a greener tomorrow and cleaner planet.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border hover:border-primary card-hover bg-gradient-to-br from-card to-muted/30 overflow-hidden group">
              <CardContent className="p-8">
                <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BadgeCheck className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Premium Quality</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Manufactured with highest quality standards ensuring unmatched durability and performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products - Modern Grid */}
      <section className="py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold">
              Featured <span className="text-gradient">Products</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular eco-friendly bag solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <Card
                key={product.id}
                className="group border-2 border-border hover:border-primary card-hover overflow-hidden bg-card"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: "fade-up 0.6s ease-out forwards"
                }}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg">
                        {product.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-xl mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.size}</p>
                    </div>
                    <p className="text-3xl font-bold text-gradient">₹{product.price}</p>
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-[var(--shadow-elegant)] transition-all duration-300"
                    >
                      <a
                        href={`https://wa.me/919834711168?text=Hello%20Gajanan%20Bioplast,%20I%20want%20to%20enquire%20about%20${encodeURIComponent(
                          product.name
                        )}%20(${product.size})%20priced%20at%20₹${product.price}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Enquire Now
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 text-lg px-8 py-6 h-auto"
            >
              <Link to="/products">
                View All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section - Bold & Modern */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary" />
        <div className="absolute inset-0 bg-mesh opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Ready to Make Your <br />
              <span className="text-white/90">Business Sustainable?</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Get in touch for bulk orders, custom solutions, and competitive pricing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-[var(--shadow-glow)] text-lg px-8 py-6 h-auto font-bold"
              >
                <a
                  href="https://wa.me/919834711168?text=Hello%20Gajanan%20Bioplast,%20I%20would%20like%20to%20place%20a%20bulk%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Us Today
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300 text-lg px-8 py-6 h-auto"
              >
                <Link to="/products">
                  Browse Catalog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
