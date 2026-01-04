import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { CustomizationDialog } from "@/components/products/CustomizationDialog";
import { ProductSearch } from "@/components/products/ProductSearch";
import { QuoteRequestDialog } from "@/components/products/QuoteRequestDialog";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { 
  Palette, 
  Package, 
  Clock, 
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Printer,
  Ruler
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

const ProductCard = ({ product, user, navigate }: { 
  product: Product; 
  user: User | null;
  navigate: (path: string) => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleLoginRequired = (action: string) => {
    toast.error(`Please login to ${action}`);
    navigate("/auth");
  };

  return (
    <Card className="group border shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-card">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
          <img
            src={productImages[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* Image Navigation */}
          {productImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={nextImage}
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
          
          {/* Type Badge */}
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
        </div>

        {/* Product Details */}
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <span className="text-sm font-semibold text-muted-foreground">
                {product.size}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Available Sizes/Dimensions */}
          {product.dimensions && product.dimensions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Ruler className="w-3.5 h-3.5" />
                Available Sizes:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.dimensions.map((dim, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {dim}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                Features:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.features.map((feature, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Printing Options */}
          {product.printing_options && product.printing_options.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Printer className="w-3.5 h-3.5 text-accent" />
                Printing Options:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.printing_options.map((option, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs bg-accent/10">
                    {option}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Business Info */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t">
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
                <p className="text-muted-foreground">Min Order</p>
                <p className="font-semibold">{product.moq} units</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-2">
              {user ? (
                <CustomizationDialog product={product}>
                  <Button 
                    variant="outline"
                    className="flex-1 border-2 hover:border-primary"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </CustomizationDialog>
              ) : (
                <Button 
                  variant="outline"
                  className="flex-1 border-2 hover:border-primary"
                  onClick={() => handleLoginRequired("customize products")}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Customize
                </Button>
              )}

              {user ? (
                <QuoteRequestDialog product={product}>
                  <Button
                    className="flex-1 bg-gradient-to-r from-primary via-accent to-secondary text-white"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Get Quote
                  </Button>
                </QuoteRequestDialog>
              ) : (
                <Button
                  onClick={() => handleLoginRequired("get a quote")}
                  className="flex-1 bg-gradient-to-r from-primary via-accent to-secondary text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Get Quote
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
const Products = () => {
  const [selectedType, setSelectedType] = useState<string>("All");
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
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

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by type
    if (selectedType !== "All") {
      result = result.filter((p) => p.type === selectedType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.type.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.features && p.features.some((f) => f.toLowerCase().includes(query)))
      );
    }

    // Sort
    switch (sortBy) {
      case "oldest":
        result.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "moq_asc":
        result.sort((a, b) => (a.moq || 0) - (b.moq || 0));
        break;
      case "moq_desc":
        result.sort((a, b) => (b.moq || 0) - (a.moq || 0));
        break;
      case "newest":
      default:
        // Already sorted by newest from the query
        break;
    }

    return result;
  }, [products, selectedType, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse our complete range of eco-friendly bags and packaging solutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
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

        {/* Search and Sort */}
        <ProductSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              user={user}
              navigate={navigate}
            />
          ))}
        </div>

        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "No products match your search." : "No products found in this category."}
            </p>
            {searchQuery && (
              <Button
                variant="link"
                onClick={() => setSearchQuery("")}
                className="mt-2"
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
