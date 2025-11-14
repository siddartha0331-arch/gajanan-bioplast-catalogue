import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Package, Mail, Phone, Building } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from "date-fns";

interface Customer {
  id: string;
  full_name: string | null;
  phone: string | null;
  business_name: string | null;
  business_type: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
}

interface Order {
  id: string;
  product_name: string;
  product_type: string;
  product_size: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
}

const CustomersList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerOrders, setCustomerOrders] = useState<Record<string, Order[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // Fetch all customer profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      setCustomers(profiles || []);

      // Fetch orders for all customers
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Group orders by customer
      const ordersMap: Record<string, Order[]> = {};
      orders?.forEach((order) => {
        if (!ordersMap[order.user_id]) {
          ordersMap[order.user_id] = [];
        }
        ordersMap[order.user_id].push(order);
      });

      setCustomerOrders(ordersMap);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "confirmed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "in_production":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">All Customers</h2>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {customers.length} Total Customers
        </Badge>
      </div>

      {customers.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No customers found
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {customers.map((customer) => {
            const orders = customerOrders[customer.id] || [];
            const totalOrders = orders.length;
            const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_price), 0);

            return (
              <AccordionItem key={customer.id} value={customer.id} className="border-0">
                <Card>
                  <AccordionTrigger className="hover:no-underline px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full text-left pr-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {customer.full_name || "Unknown Customer"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Joined {format(new Date(customer.created_at), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-4 sm:mt-0">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{totalOrders}</p>
                          <p className="text-xs text-muted-foreground">Orders</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-accent">₹{totalSpent.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Total Spent</p>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-6 pb-6 space-y-4">
                      {/* Customer Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{customer.phone || "No phone"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{customer.phone || "No phone"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {customer.business_name || "No business"} 
                            {customer.business_type && ` (${customer.business_type})`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {customer.city && customer.state 
                              ? `${customer.city}, ${customer.state}` 
                              : "No location"}
                          </span>
                        </div>
                      </div>

                      {/* Orders List */}
                      <div>
                        <h4 className="font-semibold mb-3">Order History</h4>
                        {orders.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No orders yet
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {orders.map((order) => (
                              <div
                                key={order.id}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border rounded-lg bg-card"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium">{order.product_name}</p>
                                    <Badge className={getStatusColor(order.status)}>
                                      {order.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {order.product_type} • {order.product_size} • Qty: {order.quantity}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {format(new Date(order.created_at), "MMM dd, yyyy")}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg">₹{Number(order.total_price).toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
};

export default CustomersList;
