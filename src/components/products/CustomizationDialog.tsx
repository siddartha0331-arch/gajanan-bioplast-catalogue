import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Palette, Type, Image as ImageIcon, Sparkles, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

interface CustomizationDialogProps {
  product: Product;
  children: React.ReactNode;
}

export const CustomizationDialog = ({ product, children }: CustomizationDialogProps) => {
  const navigate = useNavigate();
  const [printType, setPrintType] = useState(product.printing_options?.[0] || "Screen Printing");
  const [quantity, setQuantity] = useState(product.moq);
  const [logoFile, setLogoFile] = useState<string>("");
  const [customText, setCustomText] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  
  // Handle dimensions - ensure it's an array and has a default
  const productDimensions = Array.isArray(product.dimensions) && product.dimensions.length > 0 
    ? product.dimensions 
    : [product.size || "Standard"];
  
  const [selectedSize, setSelectedSize] = useState(productDimensions[0]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const colors = [
    { name: "Red", value: "bg-red-500" },
    { name: "Blue", value: "bg-blue-500" },
    { name: "Green", value: "bg-green-500" },
    { name: "Yellow", value: "bg-yellow-500" },
    { name: "Purple", value: "bg-purple-500" },
    { name: "Orange", value: "bg-orange-500" },
  ];

  const toggleColor = (colorName: string) => {
    setSelectedColors(prev =>
      prev.includes(colorName)
        ? prev.filter(c => c !== colorName)
        : [...prev, colorName]
    );
  };

  const addToCart = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to add items to cart");
        navigate("/auth");
        return;
      }

      const notes = `Colors: ${selectedColors.join(", ")}, Print: ${printType}, Text: ${customText}, Logo: ${logoFile}`;

      const { error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: product.id,
        product_name: product.name,
        product_type: product.type,
        product_size: selectedSize,
        quantity,
        notes,
      });

      if (error) throw error;

      toast.success("Added to cart!");
      setOpen(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient">
            Customize Your {product.name}
          </DialogTitle>
          <DialogDescription>
            Personalize your bags with custom printing and branding options
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Left Column - Product Preview */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted relative group">
              <img
                src={product.images?.[0] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-semibold">Preview Mode</p>
                  <p className="text-sm opacity-90">Your customizations will appear here</p>
                </div>
              </div>
            </div>

            <div className="card-glass p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">MOQ</span>
                <Badge variant="secondary">{product.moq} units</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Delivery</span>
                <Badge variant="outline">{product.delivery_days}</Badge>
              </div>
            </div>
          </div>

          {/* Right Column - Customization Options */}
          <div className="space-y-6">
            {/* Size Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Size
              </Label>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                {productDimensions.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <RadioGroupItem value={size} id={`size-${size}`} />
                    <Label htmlFor={`size-${size}`} className="cursor-pointer">
                      {size}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Quantity
              </Label>
              <Input
                type="number"
                min={product.moq}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="card-glass"
              />
              <p className="text-xs text-muted-foreground">
                Minimum order: {product.moq} units
              </p>
            </div>

            {/* Printing Type */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                Printing Type
              </Label>
              <RadioGroup value={printType} onValueChange={setPrintType}>
                {product.printing_options && product.printing_options.length > 0 ? (
                  product.printing_options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No printing options available</p>
                )}
              </RadioGroup>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                Bag Colors
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => toggleColor(color.name)}
                    className={`h-12 rounded-lg ${color.value} relative transition-all hover:scale-105 ${
                      selectedColors.includes(color.name)
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold mix-blend-difference">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Text */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Type className="w-4 h-4 text-primary" />
                Custom Text/Slogan
              </Label>
              <Textarea
                placeholder="Enter your brand slogan or message..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="card-glass resize-none"
                rows={3}
              />
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                Upload Logo
              </Label>
              <div className="card-glass p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="logo-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setLogoFile(file.name);
                  }}
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {logoFile || "Click to upload your logo"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, SVG (Max 5MB)
                  </p>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={addToCart}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-glow"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {loading ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
