import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, User, Mail, Phone, MapPin } from "lucide-react";

interface CustomerProfileProps {
  userId: string;
}

const CustomerProfile = ({ userId }: CustomerProfileProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    address: "",
  });
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      // Fetch user email
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
      }

      // Fetch profile data
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name.trim() || null,
        phone: profile.phone.trim() || null,
        address: profile.address.trim() || null,
      })
      .eq("id", userId);

    if (error) {
      toast.error("Error saving profile");
    } else {
      toast.success("Profile updated successfully!");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="card-glass border-2 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <User className="h-6 w-6 text-primary" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email Address
            </Label>
            <Input
              id="email"
              value={email}
              disabled
              className="bg-muted/50 cursor-not-allowed h-11"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name" className="flex items-center gap-2 text-sm font-semibold">
              <User className="h-4 w-4 text-muted-foreground" />
              Full Name
            </Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, full_name: e.target.value }))
              }
              placeholder="Enter your full name"
              className="h-11 bg-background/50 border-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone Number
            </Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="Enter your phone number"
              className="h-11 bg-background/50 border-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Address
            </Label>
            <Textarea
              id="address"
              value={profile.address}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Enter your full address"
              className="bg-background/50 border-primary/20 focus:border-primary transition-all resize-none"
              rows={4}
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full h-12 text-base font-bold bg-gradient-primary hover:shadow-morph transition-all duration-500 hover:scale-105"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerProfile;
