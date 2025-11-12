import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import { products } from "@/data/products";

interface PlaceOrderProps {
  userId: string;
}

const PlaceOrder = ({ userId }: PlaceOrderProps) => {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [deliveryDays, setDeliveryDays] = useState<number>(7);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const product = products.find((p) => p.id === selectedProduct);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);

    const expectedCompletionDate = new Date();
    expectedCompletionDate.setDate(expectedCompletionDate.getDate() + deliveryDays);

    const { error } = await supabase.from("orders").insert({
      user_id: userId,
      product_name: product.name,
      product_type: product.type,
      product_size: product.size,
      quantity,
      price_per_unit: 0,
      total_price: 0,
      delivery_days: deliveryDays,
      expected_completion_date: expectedCompletionDate.toISOString(),
      notes: notes.trim() || null,
    });

    if (error) {
      toast.error("Error placing order");
    } else {
      toast.success("Order placed successfully!");
      setSelectedProduct("");
      setQuantity(1);
      setDeliveryDays(7);
      setNotes("");
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place New Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="product">Select Product</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct} required>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.size})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {product && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">{product.name}</h4>
              <p className="text-sm text-muted-foreground mb-1">
                Type: {product.type} • Size: {product.size}
              </p>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>
          )}

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="deliveryDays">Expected Delivery Days</Label>
            <Input
              id="deliveryDays"
              type="number"
              min="1"
              max="365"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(Number(e.target.value))}
              required
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Expected completion: {new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>

          <div>
            <Label htmlFor="notes">Special Instructions (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements or customization..."
              className="mt-2"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent"
            disabled={!product || loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlaceOrder;
