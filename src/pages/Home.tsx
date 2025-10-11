import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Package, Leaf, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroBags from "@/assets/hero-bags.jpg";
import dcutBag from "@/assets/dcut-bag.jpg";
import wcutBag from "@/assets/wcut-bag.jpg";
import ppBag from "@/assets/pp-bag.jpg";
import boppBag from "@/assets/bopp-bag.jpg";
import { products } from "@/data/products";
import { InteractiveCarousel } from "@/components/ui/interactive-carousel";
import { useParallax } from "@/hooks/useParallax";
import { useMagneticHover } from "@/hooks/useMagneticHover";
import { useEffect, useRef } from "react";

const Home = () => {
  const featuredProducts = products.slice(0, 4);
  const parallaxRef1 = useParallax<HTMLDivElement>({ speed: 0.3 });
  const parallaxRef2 = useParallax<HTMLDivElement>({ speed: 0.5, direction: "down" });
  const magneticRef1 = useMagneticHover<HTMLButtonElement>({ strength: 0.4 });
  const magneticRef2 = useMagneticHover<HTMLButtonElement>({ strength: 0.4 });
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 }
    );

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const carouselItems = [
    {
      image: heroBags,
      title: "Eco-Friendly Bag Solutions",
      description: "Premium quality bags crafted with sustainability in mind. Join us in making the planet greener."
    },
    {
      image: dcutBag,
      title: "D-Cut Bags",
      description: "Versatile and durable D-cut bags perfect for retail and everyday use."
    },
    {
      image: wcutBag,
      title: "W-Cut Bags", 
      description: "Strong and reliable W-cut bags for heavy-duty applications."
    },
    {
      image: ppBag,
      title: "PP Woven Bags",
      description: "Industrial-grade woven bags built to last and protect your products."
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section - Morphing Shapes with Diagonal Layout */}
      <section className="relative min-h-screen flex items-center shape-morph bg-background pt-20">
        <div className="absolute inset-0 bg-mesh opacity-70" />
        
        {/* Morphing Background Shapes */}
        <div className="absolute top-20 right-0 w-[700px] h-[700px] animate-morph bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] animate-morph bg-gradient-to-tr from-accent/25 via-primary/15 to-secondary/25" style={{ animationDelay: "2s" }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content - Diagonal Flow */}
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-glass rounded-full border-2 border-primary/30 animate-scale-in">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-black tracking-wider text-primary">NEXT-GEN ECO SOLUTIONS</span>
              </div>
              
              <div className="space-y-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter">
                  <span className="text-stroke">Gajanan</span>
                  <br />
                  <span className="text-gradient">Bioplast</span>
                </h1>
                
                <div className="w-32 h-2 bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-pulse" />
              </div>
              
              <p className="text-2xl md:text-3xl font-medium text-muted-foreground max-w-xl leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
                Revolutionary eco-friendly packaging that{" "}
                <span className="text-gradient-accent font-bold">redefines sustainability</span>
              </p>
              
              <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                {["D Cut", "W Cut", "BOPP", "PP Woven"].map((type, i) => (
                  <div
                    key={type}
                    className="px-6 py-3 bg-glass rounded-2xl border-2 border-primary/20 font-bold hover:border-primary hover:scale-105 transition-all duration-300 cursor-pointer"
                    style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                  >
                    {type}
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-5 pt-4 animate-fade-up" style={{ animationDelay: "0.5s" }}>
                <Button
                  ref={magneticRef1}
                  asChild
                  size="lg"
                  className="magnetic-area bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-[var(--shadow-glow)] text-lg px-10 py-7 h-auto rounded-2xl font-bold group"
                >
                  <Link to="/products">
                    Explore Collection
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
                <Button
                  ref={magneticRef2}
                  asChild
                  size="lg"
                  variant="outline"
                  className="magnetic-area border-3 border-primary hover:bg-primary hover:text-primary-foreground text-lg px-10 py-7 h-auto rounded-2xl font-bold"
                >
                  <a
                    href="https://wa.me/919834711168?text=Hello%20Gajanan%20Bioplast,%20I%20would%20like%20to%20enquire%20about%20your%20products."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Start Conversation
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Image - Parallax with Shine Effect */}
            <div ref={parallaxRef1} className="relative animate-fade-up parallax-layer" style={{ animationDelay: "0.2s" }}>
              <div className="relative aspect-square overflow-hidden card-glass rounded-[3rem] shadow-[var(--shadow-morph)] image-shine">
                <img
                  src={heroBags}
                  alt="Premium sustainable packaging solutions"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/30 mix-blend-overlay" />
              </div>
              
              {/* Floating Glass Card */}
              <div className="absolute -bottom-8 -right-8 bg-glass p-8 rounded-3xl shadow-[var(--shadow-morph)] border-2 border-accent/30 animate-scale-in backdrop-blur-xl" style={{ animationDelay: "0.6s" }}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center animate-morph">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-4xl font-black text-gradient">100%</p>
                    <p className="text-sm font-bold text-muted-foreground">Eco-Certified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Carousel */}
          <div className="mt-24 reveal-image" ref={(el) => (revealRefs.current[0] = el)}>
            <InteractiveCarousel items={carouselItems} />
          </div>
        </div>
      </section>

      {/* Features Section - Diagonal Clip & Brutalist Cards */}
      <section className="py-32 relative section-diagonal bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-6xl md:text-7xl font-black tracking-tighter">
              Why We're <span className="text-gradient-secondary">Different</span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
              Breaking boundaries in sustainable packaging innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Package,
                title: "Vast Arsenal",
                desc: "Complete spectrum of D Cut, W Cut, PP Woven, and BOPP bags engineered for every industrial application.",
                gradient: "from-primary to-purple-500"
              },
              {
                icon: Leaf,
                title: "Planet First",
                desc: "Carbon-neutral manufacturing processes with biodegradable materials for a regenerative future.",
                gradient: "from-secondary to-orange-500"
              },
              {
                icon: Zap,
                title: "Ultra Quality",
                desc: "Military-grade durability standards with cutting-edge material science and rigorous testing.",
                gradient: "from-accent to-teal-500"
              }
            ].map((feature, index) => (
              <Card
                key={feature.title}
                className="border-4 border-foreground card-brutal bg-card overflow-hidden group reveal-image"
                ref={(el) => (revealRefs.current[index + 1] = el)}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-10">
                  <div className={`w-20 h-20 mb-8 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    <feature.icon className="h-10 w-10 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-3xl font-black mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div ref={parallaxRef2} className="parallax-layer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-5">
          <Package className="w-96 h-96" />
        </div>
      </section>

      {/* Featured Products - Glass Morphism Grid */}
      <section className="py-32 bg-background relative">
        <div className="absolute inset-0 bg-mesh opacity-40" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-6xl md:text-7xl font-black tracking-tighter">
              Premium <span className="text-gradient">Catalog</span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
              Handpicked eco-solutions for conscious businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <Card
                key={product.id}
                className="group border-3 border-primary/30 card-glass overflow-hidden"
                style={{ 
                  animationDelay: `${index * 0.12}s`,
                  animation: "fade-up 0.8s ease-out forwards"
                }}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-3 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-accent/40 mix-blend-overlay" />
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-2 rounded-full bg-glass border-2 border-primary/50 text-primary text-xs font-black backdrop-blur-md">
                        {product.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 space-y-5 bg-glass">
                    <div>
                      <h3 className="font-black text-2xl mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground font-bold">{product.size}</p>
                    </div>
                    <p className="text-4xl font-black text-gradient">₹{product.price}</p>
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-[var(--shadow-glow)] rounded-xl font-bold text-base py-6"
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

          <div className="text-center mt-20">
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="border-4 border-primary hover:bg-primary hover:text-primary-foreground rounded-2xl font-black text-xl px-12 py-8 h-auto"
            >
              <Link to="/products">
                View Full Range <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section - Diagonal Reverse with Conic Gradient */}
      <section className="py-40 relative overflow-hidden section-diagonal-reverse">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl animate-morph" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="inline-block px-8 py-4 bg-white/10 backdrop-blur-xl rounded-full border-2 border-white/30 mb-6">
              <span className="text-lg font-black tracking-wider">MAKE THE SWITCH TODAY</span>
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
              Transform Your
              <br />
              <span className="text-stroke">Business Future</span>
            </h2>
            
            <p className="text-2xl md:text-3xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed">
              Join the sustainability revolution with bulk orders, custom designs, and unbeatable pricing
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-[var(--shadow-glow)] text-xl px-12 py-8 h-auto font-black rounded-2xl"
              >
                <a
                  href="https://wa.me/919834711168?text=Hello%20Gajanan%20Bioplast,%20I%20would%20like%20to%20place%20a%20bulk%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Sales Team
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-4 border-white text-white hover:bg-white hover:text-primary rounded-2xl font-black text-xl px-12 py-8 h-auto"
              >
                <Link to="/products">
                  Explore Products
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
