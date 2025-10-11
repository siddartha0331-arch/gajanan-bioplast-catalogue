import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { products, Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useTiltEffect } from "@/hooks/useTiltEffect";
import { useMagneticHover } from "@/hooks/useMagneticHover";

const ProductCard = ({ product, index, user, navigate }: { 
  product: Product; 
  index: number; 
  user: User | null;
  navigate: (path: string) => void;
}) => {
  const tiltRef = useTiltEffect<HTMLDivElement>();
  const magneticRef = useMagneticHover<HTMLButtonElement>({ strength: 0.2 });

  return (
    <Card
      ref={tiltRef}
      className="tilt-card group border-none shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="tilt-glow" />
      <div className="tilt-card-inner">
        <CardContent className="p-0">
          <div className="aspect-square overflow-hidden rounded-t-lg bg-muted image-shine">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-gradient-to-r from-primary to-accent text-white border-none">
                {product.type}
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">
                {product.size}
              </span>
            </div>
            <h3 className="font-semibold mb-2 text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {product.description}
            </p>
            <p className="text-2xl font-bold mb-4">
              <span className="text-gradient">₹{product.price}</span>
            </p>
            {user ? (
              <Button
                ref={magneticRef}
                onClick={() => navigate("/dashboard")}
                className="w-full magnetic-area bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-glow text-white"
              >
                Book Now
              </Button>
            ) : (
              <Button
                ref={magneticRef}
                asChild
                className="w-full magnetic-area bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-glow text-white"
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
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

const Products = () => {
  const [selectedType, setSelectedType] = useState<string>("All");
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const types = ["All", "D Cut", "W Cut", "PP Woven", "BOPP"];

  const filteredProducts =
    selectedType === "All"
      ? products
      : products.filter((p) => p.type === selectedType);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our complete range of eco-friendly bags and packaging solutions
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {types.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type)}
              className={
                selectedType === type
                  ? "bg-gradient-to-r from-primary to-accent"
                  : ""
              }
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              user={user}
              navigate={navigate}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
