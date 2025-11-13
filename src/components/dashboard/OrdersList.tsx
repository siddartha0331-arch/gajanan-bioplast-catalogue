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
import { Loader2 } from "lucide-react";

interface OrdersListProps {
  userId: string;
  isAdmin: boolean;
}

const OrdersList = ({ userId, isAdmin }: OrdersListProps) => {
  const [orders, setOrders] = useState<any[]>([]);
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
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [userId, isAdmin]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      toast.error("Error updating order");
    } else {
      toast.success("Order status updated");
      fetchOrders();
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
