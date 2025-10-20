import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100),
  full_name: z.string().trim().min(1, { message: "Name is required" }).max(100).optional(),
});

const Auth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          navigate("/dashboard");
        }, 0);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const full_name = formData.get("full_name") as string;

    try {
      const validation = authSchema.parse({ email, password, full_name });

      const { error } = await supabase.auth.signUp({
        email: validation.email,
        password: validation.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: validation.full_name || "",
          },
        },
      });

      if (error) throw error;
      toast.success("Account created! Please check your email.");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Error creating account");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const validation = authSchema.pick({ email: true, password: true }).parse({ email, password });

      const { error } = await supabase.auth.signInWithPassword({
        email: validation.email,
        password: validation.password,
      });

      if (error) throw error;
      toast.success("Logged in successfully!");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Error signing in");
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Animated mesh background */}
      <div className="absolute inset-0 bg-mesh animate-diagonal-slide opacity-60" />
      
      {/* Morphing shapes */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-primary opacity-20 animate-morph blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-accent opacity-20 animate-morph blur-3xl" style={{ animationDelay: '4s' }} />
      
      {/* Glass card with brutal shadow */}
      <div className="relative w-full max-w-md">
        <Card className="card-glass border-2 border-primary/20 overflow-hidden backdrop-blur-xl">
          <CardHeader className="text-center space-y-4 pb-8 pt-10">
            <div className="relative inline-block">
              <h1 className="text-5xl font-black text-gradient tracking-tighter">
                Welcome Back
              </h1>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-primary rounded-full" />
            </div>
            <CardDescription className="text-base text-foreground/70">
              Enter the future of bag ordering
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-10">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-1.5 bg-muted/50 backdrop-blur-sm border border-primary/10">
                <TabsTrigger 
                  value="signin"
                  className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white transition-all duration-300"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white transition-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-8">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-sm font-semibold text-foreground/90">
                      Email Address
                    </Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="h-12 bg-background/50 border-primary/20 focus:border-primary transition-all duration-300 focus:shadow-glow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm font-semibold text-foreground/90">
                      Password
                    </Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="h-12 bg-background/50 border-primary/20 focus:border-primary transition-all duration-300 focus:shadow-glow"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-bold bg-gradient-primary hover:shadow-morph transition-all duration-500 hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In →"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-8">
                <form onSubmit={handleSignUp} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-sm font-semibold text-foreground/90">
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      name="full_name"
                      type="text"
                      placeholder="Your Name"
                      required
                      className="h-12 bg-background/50 border-primary/20 focus:border-primary transition-all duration-300 focus:shadow-glow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-semibold text-foreground/90">
                      Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="h-12 bg-background/50 border-primary/20 focus:border-primary transition-all duration-300 focus:shadow-glow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-semibold text-foreground/90">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="h-12 bg-background/50 border-primary/20 focus:border-primary transition-all duration-300 focus:shadow-glow"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-bold bg-gradient-primary hover:shadow-morph transition-all duration-500 hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create Account →"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
