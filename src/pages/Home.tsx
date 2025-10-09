import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Package, Leaf, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import heroBags from "@/assets/hero-bags.jpg";
import { products } from "@/data/products";

const Home = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroBags})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/90" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center text-primary-foreground">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-up">
            Gajanan Bioplast
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            All Types of Non-Woven & PP Bags
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            D Cut • W Cut • BOPP Bags • PP Woven Bags
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button
              asChild
              size="lg"
              className="bg-background text-primary hover:bg-background/90 shadow-lg"
            >
              <Link to="/products">
                View Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              <a
                href="https://wa.me/919834711168?text=Hello%20Gajanan%20Bioplast,%20I%20would%20like%20to%20enquire%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Wide Range</h3>
                <p className="text-muted-foreground">
                  Complete collection of D Cut, W Cut, PP Woven, and BOPP bags for all your needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
                <p className="text-muted-foreground">
                  Sustainable and environmentally conscious products for a greener future.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <BadgeCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-muted-foreground">
                  Manufactured with highest quality standards for durability and performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground text-lg">
              Explore our popular eco-friendly bag solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 border-none shadow-md animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {product.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{product.size}</span>
                    </div>
                    <h3 className="font-semibold mb-2 text-lg">{product.name}</h3>
                    <p className="text-2xl font-bold text-primary mb-4">₹{product.price}</p>
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    >
                      <a
                        href={`https://wa.me/919834711168?text=Hello%20Gajanan%20Bioplast,%20I%20want%20to%20enquire%20about%20${encodeURIComponent(
                          product.name
                        )}%20(${product.size})%20priced%20at%20₹${product.price}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Enquire on WhatsApp
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link to="/products">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Place Your Order?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Contact us today for bulk orders and customized solutions
          </p>
          <Button
            asChild
            size="lg"
            className="bg-background text-primary hover:bg-background/90"
          >
            <a
              href="https://wa.me/919834711168?text=Hello%20Gajanan%20Bioplast,%20I%20would%20like%20to%20place%20a%20bulk%20order."
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us Now
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
