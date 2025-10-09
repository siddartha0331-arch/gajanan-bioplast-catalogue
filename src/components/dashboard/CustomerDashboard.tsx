import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, ShoppingBag, Settings, Package } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import OrdersList from "./OrdersList";
import PlaceOrder from "./PlaceOrder";
import CustomerPreferences from "./CustomerPreferences";

interface CustomerDashboardProps {
  user: User;
}

const CustomerDashboard = ({ user }: CustomerDashboardProps) => {
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      setProfile(data);
    };

    fetchProfile();
  }, [user.id]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Customer Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {profile?.full_name || user.email}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="orders">
              <Package className="mr-2 h-4 w-4" />
              My Orders
            </TabsTrigger>
            <TabsTrigger value="new">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Place Order
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <OrdersList userId={user.id} isAdmin={false} />
          </TabsContent>

          <TabsContent value="new" className="mt-6">
            <PlaceOrder userId={user.id} />
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <CustomerPreferences userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDashboard;
