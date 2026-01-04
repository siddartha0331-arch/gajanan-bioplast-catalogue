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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle, Send, User, Building2, Palette, Ruler } from "lucide-react";
import { notifyAdminQuoteRequest } from "@/hooks/useNotifications";

interface Product {
  id: string;
  name: string;
  type: string;
  size: string;
  description: string;
  moq: number;
  delivery_days: string;
  printing_options: string[];
  features: string[];
  dimensions: string[];
}

interface QuoteRequestDialogProps {
  product: Product;
  children: React.ReactNode;
}

export const QuoteRequestDialog = ({ product, children }: QuoteRequestDialogProps) => {
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [preferredColor, setPreferredColor] = useState("");
  const [preferredSize, setPreferredSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleSubmit = async () => {
    const features = product.features?.join(", ") || "N/A";
    const printingOptions = product.printing_options?.join(", ") || "N/A";
    const availableSizes = product.dimensions?.length > 0 ? product.dimensions.join(", ") : product.size;

    const message = `*QUOTE REQUEST*

*Customer Details:*
• Name: ${customerName}
• Company: ${companyName || "N/A"}

*Customer Preferences:*
• Preferred Color: ${preferredColor || "To be discussed"}
• Preferred Size: ${preferredSize || "To be discussed"}
• Quantity Required: ${quantity || "To be discussed"}
${additionalNotes ? `• Additional Notes: ${additionalNotes}` : ""}

*Product Details:*
• Product: ${product.name}
• Type: ${product.type}
• Current Size: ${product.size}
• Available Sizes: ${availableSizes}
• MOQ: ${product.moq} units
• Delivery: ${product.delivery_days}

*Features:* ${features}
*Printing Options:* ${printingOptions}

*Description:* ${product.description}

Please provide pricing and availability.`;

    // Notify admin about the quote request
    await notifyAdminQuoteRequest(customerName, companyName, product.name);

    window.open(
      `https://wa.me/919834711168?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    
    // Reset form and close dialog
    setCustomerName("");
    setCompanyName("");
    setPreferredColor("");
    setPreferredSize("");
    setQuantity("");
    setAdditionalNotes("");
    setOpen(false);
  };

  const isFormValid = customerName.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Request Quote
          </DialogTitle>
          <DialogDescription>
            Fill in your details and preferences for <strong>{product.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customerName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Your Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customerName"
              placeholder="Enter your full name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Company Name
            </Label>
            <Input
              id="companyName"
              placeholder="Enter your company name (optional)"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          {/* Preferred Color */}
          <div className="space-y-2">
            <Label htmlFor="preferredColor" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Preferred Color
            </Label>
            <Input
              id="preferredColor"
              placeholder="e.g., White, Green, Custom color..."
              value={preferredColor}
              onChange={(e) => setPreferredColor(e.target.value)}
            />
          </div>

          {/* Preferred Size */}
          <div className="space-y-2">
            <Label htmlFor="preferredSize" className="flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Preferred Size
            </Label>
            {product.dimensions && product.dimensions.length > 0 ? (
              <Select value={preferredSize} onValueChange={setPreferredSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  {product.dimensions.map((dim) => (
                    <SelectItem key={dim} value={dim}>
                      {dim}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Size</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="preferredSize"
                placeholder="Enter preferred size"
                value={preferredSize}
                onChange={(e) => setPreferredSize(e.target.value)}
              />
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">
              Quantity Required (Min: {product.moq})
            </Label>
            <Input
              id="quantity"
              type="number"
              min={product.moq}
              placeholder={`Minimum ${product.moq} units`}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Requirements</Label>
            <Textarea
              id="additionalNotes"
              placeholder="Any specific requirements, printing needs, or questions..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Product Summary */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
            <p className="font-medium">Product Summary:</p>
            <p className="text-muted-foreground">• {product.name} ({product.type})</p>
            <p className="text-muted-foreground">• MOQ: {product.moq} units</p>
            <p className="text-muted-foreground">• Delivery: {product.delivery_days}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-primary to-accent"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            <Send className="w-4 h-4 mr-2" />
            Send to WhatsApp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
