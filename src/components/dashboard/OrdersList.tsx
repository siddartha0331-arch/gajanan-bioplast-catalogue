import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Download, Package } from "lucide-react";
import { createNotification } from "@/hooks/useNotifications";

interface OrdersListProps {
  userId: string;
  isAdmin: boolean;
}

const OrdersList = ({ userId, isAdmin }: OrdersListProps) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        profiles (
          full_name,
          business_name,
          business_type,
          gst_number,
          phone,
          address,
          city,
          state,
          pincode
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error loading orders");
    } else {
      setOrders(data || []);
      // Fetch order items for each order
      if (data) {
        const itemsMap: Record<string, any[]> = {};
        for (const order of data) {
          const { data: items } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", order.id);
          itemsMap[order.id] = items || [];
        }
        setOrderItems(itemsMap);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [userId, isAdmin]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    // Get order details first to notify the customer
    const order = orders.find(o => o.id === orderId);
    
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      toast.error("Error updating order");
    } else {
      toast.success("Order status updated");
      
      // Notify the customer about status change
      if (order) {
        const statusMessages: Record<string, string> = {
          pending: "Your order is pending review.",
          confirmed: "Great news! Your order has been confirmed.",
          processing: "Your order is now being processed.",
          completed: "Your order has been completed and is ready!",
          cancelled: "Your order has been cancelled. Please contact us for details.",
        };
        
        await createNotification(
          order.user_id,
          `Order Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          statusMessages[status] || `Your order status has been updated to ${status}.`,
          "order",
          orderId
        );
      }
      
      fetchOrders();
    }
  };

  const downloadLogo = async (logoUrl: string, productName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('customer-logos')
        .download(logoUrl);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${productName}-logo`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Logo downloaded successfully");
    } catch (error) {
      console.error("Error downloading logo:", error);
      toast.error("Failed to download logo");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500",
      confirmed: "bg-blue-500/10 text-blue-500",
      processing: "bg-purple-500/10 text-purple-500",
      completed: "bg-green-500/10 text-green-500",
      cancelled: "bg-red-500/10 text-red-500",
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No orders found
          </CardContent>
        </Card>
      ) : (
        orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order.product_name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.product_type} • {order.product_size} • Qty: {order.quantity}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Order Items */}
                {orderItems[order.id] && orderItems[order.id].length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      <p className="font-semibold text-sm">Order Items:</p>
                    </div>
                    {orderItems[order.id].map((item) => (
                      <div key={item.id} className="p-3 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{item.product_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.product_type} • Size: {item.product_size} • Qty: {item.quantity}
                            </p>
                            {item.custom_text && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Custom Text: {item.custom_text}
                              </p>
                            )}
                            {item.notes && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.notes}
                              </p>
                            )}
                          </div>
                          {isAdmin && item.logo_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadLogo(item.logo_url, item.product_name)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Logo
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  {order.notes && (
                    <p className="text-sm text-muted-foreground">
                      Note: {order.notes}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Ordered: {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>

                {isAdmin && order.profiles && (
                  <div className="pt-4 border-t">
                    <p className="font-semibold text-sm mb-2">Customer Information:</p>
                    <div className="space-y-1">
                      {order.profiles.business_name && (
                        <p className="text-sm text-muted-foreground">
                          Business: {order.profiles.business_name}
                          {order.profiles.business_type && ` (${order.profiles.business_type})`}
                        </p>
                      )}
                      {order.profiles.full_name && (
                        <p className="text-sm text-muted-foreground">
                          Contact: {order.profiles.full_name}
                        </p>
                      )}
                      {order.profiles.phone && (
                        <p className="text-sm text-muted-foreground">
                          Phone: {order.profiles.phone}
                        </p>
                      )}
                      {order.profiles.gst_number && (
                        <p className="text-sm text-muted-foreground">
                          GST: {order.profiles.gst_number}
                        </p>
                      )}
                      {order.profiles.address && (
                        <p className="text-sm text-muted-foreground">
                          Address: {order.profiles.address}
                          {order.profiles.city && `, ${order.profiles.city}`}
                          {order.profiles.state && `, ${order.profiles.state}`}
                          {order.profiles.pincode && ` - ${order.profiles.pincode}`}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {isAdmin && (
                  <div className="flex justify-end pt-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default OrdersList;