import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CustomerPreferencesProps {
  userId: string;
}

const CustomerPreferences = ({ userId }: CustomerPreferencesProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    preferred_product_types: [] as string[],
    preferred_sizes: [] as string[],
    notes: "",
  });

  const productTypes = ["D Cut", "W Cut", "PP Woven", "BOPP"];
  const sizes = ["12x15", "15x18", "15x21", "18x24"];

  useEffect(() => {
    const fetchPreferences = async () => {
      const { data, error } = await supabase
        .from("customer_preferences")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (!error && data) {
        setPreferences({
          preferred_product_types: data.preferred_product_types || [],
          preferred_sizes: data.preferred_sizes || [],
          notes: data.notes || "",
        });
      }
      setLoading(false);
    };

    fetchPreferences();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("customer_preferences")
      .upsert({
        user_id: userId,
        preferred_product_types: preferences.preferred_product_types,
        preferred_sizes: preferences.preferred_sizes,
        notes: preferences.notes.trim() || null,
      });

    if (error) {
      toast.error("Error saving preferences");
    } else {
      toast.success("Preferences saved successfully!");
    }
    setSaving(false);
  };

  const toggleType = (type: string) => {
    setPreferences((prev) => ({
      ...prev,
      preferred_product_types: prev.preferred_product_types.includes(type)
        ? prev.preferred_product_types.filter((t) => t !== type)
        : [...prev.preferred_product_types, type],
    }));
  };

  const toggleSize = (size: string) => {
    setPreferences((prev) => ({
      ...prev,
      preferred_sizes: prev.preferred_sizes.includes(size)
        ? prev.preferred_sizes.filter((s) => s !== size)
        : [...prev.preferred_sizes, size],
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-semibold mb-3 block">
            Preferred Product Types
          </Label>
          <div className="space-y-3">
            {productTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={preferences.preferred_product_types.includes(type)}
                  onCheckedChange={() => toggleType(type)}
                />
                <Label htmlFor={`type-${type}`} className="font-normal cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold mb-3 block">
            Preferred Sizes
          </Label>
          <div className="space-y-3">
            {sizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={preferences.preferred_sizes.includes(size)}
                  onCheckedChange={() => toggleSize(size)}
                />
                <Label htmlFor={`size-${size}`} className="font-normal cursor-pointer">
                  {size}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            value={preferences.notes}
            onChange={(e) =>
              setPreferences((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Any specific requirements or preferences..."
            className="mt-2"
            rows={4}
          />
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-primary to-accent"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CustomerPreferences;
