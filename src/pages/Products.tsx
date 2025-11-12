import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useTiltEffect } from "@/hooks/useTiltEffect";
import { useMagneticHover } from "@/hooks/useMagneticHover";
import { CustomizationDialog } from "@/components/products/CustomizationDialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Palette, 
  Package, 
  Clock, 
  CheckCircle2,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  type: string;
  size: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  moq: number;
  delivery_days: string;
  printing_options: string[];
  features: string[];
  dimensions: string[];
}

const ProductCard = ({ product, index, user, navigate }: { 
  product: Product; 
  index: number; 
  user: User | null;
  navigate: (path: string) => void;
}) => {
  const tiltRef = useTiltEffect<HTMLDivElement>();
  const magneticRef = useMagneticHover<HTMLButtonElement>({ strength: 0.2 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <Card
      ref={tiltRef}
      className="tilt-card group border-none shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-up overflow-hidden"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="tilt-glow" />
      <div className="tilt-card-inner">
        <CardContent className="p-0">
          {/* Product Image with Badge Overlay */}
          <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted image-shine">
            <img
              src={productImages[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Image Navigation */}
            {productImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                {/* Image indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {productImages.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex 
                          ? 'bg-white w-4' 
                          : 'bg-white/50 w-1.5'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Premium Badge */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-primary to-accent text-white border-none shadow-lg">
                {product.type}
              </Badge>
            </div>

            {/* MOQ Badge */}
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="shadow-lg">
                MOQ: {product.moq}+
              </Badge>
            </div>

            {/* Customization Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <CustomizationDialog product={product}>
                <Button 
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 font-bold shadow-2xl transform scale-90 group-hover:scale-100 transition-transform"
                >
                  <Palette className="w-5 h-5 mr-2" />
                  Customize Now
                </Button>
              </CustomizationDialog>
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <span className="text-sm font-semibold text-muted-foreground">
                  {product.size}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Key Features */}
            <div className="flex flex-wrap gap-1.5">
              {product.features && product.features.length > 0 ? (
                product.features.slice(0, 2).map((feature, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className="text-xs"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {feature}
                  </Badge>
                ))
              ) : null}
            </div>

            {/* Business Info */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-muted-foreground">Delivery</p>
                  <p className="font-semibold">{product.delivery_days}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Package className="w-4 h-4 text-accent" />
                <div>
                  <p className="text-muted-foreground">Print Options</p>
                  <p className="font-semibold">{product.printing_options?.length || 0}+</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Badge variant="secondary" className="w-full justify-center py-1.5">
                Bulk discounts available
              </Badge>
              <div className="flex gap-2">
                <CustomizationDialog product={product}>
                  <Button 
                    variant="outline"
                    className="flex-1 group/btn border-2 hover:border-primary"
                  >
                    <Sparkles className="w-4 h-4 mr-2 group-hover/btn:text-primary transition-colors" />
                    Customize
                  </Button>
                </CustomizationDialog>

                {user ? (
                  <Button
                    ref={magneticRef}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/dashboard");
                    }}
                    className="flex-1 magnetic-area bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-glow text-white"
                  >
                    Order Now
                  </Button>
                ) : (
                  <Button
                    ref={magneticRef}
                    asChild
                    className="flex-1 magnetic-area bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-glow text-white"
                  >
                    <a
                      href={`https://wa.me/919834711168?text=Hello%20Gajanan%20Bioplast,%20I%20want%20to%20enquire%20about%20${encodeURIComponent(
                        product.name
                      )}%20(${product.size})%20with%20custom%20printing.`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Quote
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

const Products = () => {
  const [selectedType, setSelectedType] = useState<string>("All");
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Database error:", error);
        toast({
          title: "Error loading products",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Fetched products:", data);
      setProducts((data || []) as Product[]);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Failed to load products",
        description: "Please refresh the page or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const types = ["All", "D Cut", "W Cut", "PP Woven", "BOPP"];

  const filteredProducts =
    selectedType === "All"
      ? products
      : products.filter((p) => p.type === selectedType);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
