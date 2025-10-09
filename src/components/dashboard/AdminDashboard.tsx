import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Package, Users } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import OrdersList from "./OrdersList";
import AdminStats from "./AdminStats";

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const navigate = useNavigate();

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
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage orders and view statistics
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList>
            <TabsTrigger value="stats">
              <Users className="mr-2 h-4 w-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="mr-2 h-4 w-4" />
              All Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-6">
            <AdminStats />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <OrdersList userId={user.id} isAdmin={true} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
