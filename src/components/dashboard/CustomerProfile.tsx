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
    business_name: "",
    business_type: "",
    gst_number: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
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
          business_name: data.business_name || "",
          business_type: data.business_type || "",
          gst_number: data.gst_number || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
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
        business_name: profile.business_name.trim() || null,
        business_type: profile.business_type.trim() || null,
        gst_number: profile.gst_number.trim() || null,
        phone: profile.phone.trim() || null,
        address: profile.address.trim() || null,
        city: profile.city.trim() || null,
        state: profile.state.trim() || null,
        pincode: profile.pincode.trim() || null,
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
              Full Name *
            </Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, full_name: e.target.value }))
              }
              placeholder="Enter your full name"
              className="h-11 bg-background/50 border-primary/20 focus:border-primary transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_name" className="flex items-center gap-2 text-sm font-semibold">
              Business Name *
            </Label>
            <Input
              id="business_name"
              value={profile.business_name}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, business_name: e.target.value }))
              }
              placeholder="Enter your business name"
              className="h-11 bg-background/50 border-primary/20 focus:border-primary transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_type" className="flex items-center gap-2 text-sm font-semibold">
              Business Type
            </Label>
            <Input
              id="business_type"
              value={profile.business_type}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, business_type: e.target.value }))
              }
              placeholder="e.g., Retail, Manufacturing, Trading"
              className="h-11 bg-background/50 border-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gst_number" className="flex items-center gap-2 text-sm font-semibold">
              GST Number
            </Label>
            <Input
              id="gst_number"
              value={profile.gst_number}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, gst_number: e.target.value }))
              }
              placeholder="e.g., 22AAAAA0000A1Z5"
              className="h-11 bg-background/50 border-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="Enter your phone number"
              className="h-11 bg-background/50 border-primary/20 focus:border-primary transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Complete Address *
            </Label>
            <Textarea
              id="address"
              value={profile.address}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Enter your full address"
              className="bg-background/50 border-primary/20 focus:border-primary transition-all resize-none"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-semibold">
                City *
              </Label>
              <Input
                id="city"
                value={profile.city}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder="City"
                className="h-11 bg-background/50 border-primary/20 focus:border-primary transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-semibold">
                State *
              </Label>
              <Input
                id="state"
                value={profile.state}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, state: e.target.value }))
                }
                placeholder="State"
                className="h-11 bg-background/50 border-primary/20 focus:border-primary transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode" className="text-sm font-semibold">
                Pincode *
              </Label>
              <Input
                id="pincode"
                value={profile.pincode}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, pincode: e.target.value }))
                }
                placeholder="Pincode"
                className="h-11 bg-background/50 border-primary/20 focus:border-primary transition-all"
                required
              />
            </div>
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
