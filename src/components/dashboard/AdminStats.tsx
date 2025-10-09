import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, CheckCircle, Users } from "lucide-react";

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Total orders
      const { count: totalOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      // Pending orders
      const { count: pendingOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Completed orders
      const { count: completedOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed");

      // Total customers
      const { count: totalCustomers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      setStats({
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        completedOrders: completedOrders || 0,
        totalCustomers: totalCustomers || 0,
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Package,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bg}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStats;
