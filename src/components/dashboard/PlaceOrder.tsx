import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { notifyAdminNewOrder } from "@/hooks/useNotifications";

interface PlaceOrderProps {
  userId: string;
}

const PlaceOrder = ({ userId }: PlaceOrderProps) => {
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    fetchCartItems();
  }, [userId]);

  const fetchCartItems = async () => {
    const { data } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId);
    setCartItems(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items first.");
      return;
    }

    setLoading(true);

    try {
      // Check if profile is complete
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!profile?.business_name || !profile?.phone || !profile?.address) {
        toast.error("Please complete your business profile before placing an order");
        setLoading(false);
        return;
      }

      // Create the main order
      const completionDate = new Date();
      completionDate.setDate(completionDate.getDate() + 7);

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          product_name: "Bulk Order",
          product_type: "Multiple Items",
          product_size: "Various",
          quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          price_per_unit: 0,
          total_price: 0,
          delivery_days: 7,
          expected_completion_date: completionDate.toISOString(),
          notes: `Order from cart with ${cartItems.length} items`,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_type: item.product_type,
        product_size: item.product_size,
        quantity: item.quantity,
        notes: item.notes,
        logo_url: item.logo_url,
        custom_text: item.notes?.split('Custom Text: ')[1]?.split(' | ')[0] || null,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      const { error: clearError } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId);

      if (clearError) throw clearError;

      // Send WhatsApp notification
      try {
        await supabase.functions.invoke('send-whatsapp-notification', {
          body: { orderId: order.id }
        });
      } catch (notifError) {
        console.error('WhatsApp notification error:', notifError);
        // Don't fail the order if notification fails
      }

      // Notify admins about new order
      const customerName = profile?.business_name || profile?.full_name || "A customer";
      await notifyAdminNewOrder(order.id, customerName);

      toast.success("Order placed successfully!");
      fetchCartItems();
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Your cart is empty. Browse products and add items to cart to place an order.
            </p>
            <Button onClick={() => window.location.href = "/products"}>
              Browse Products
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Order Summary</h3>
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 bg-muted rounded-lg">
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-muted-foreground">
                    Type: {item.product_type} • Size: {item.product_size}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {item.notes}
                    </p>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t">
                <p className="font-semibold">
                  Total Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Placing Order..." : "Confirm Order"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default PlaceOrder;