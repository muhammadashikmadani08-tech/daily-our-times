import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const signupSchema = z.object({
  name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
  email: z.string().email("সঠিক ইমেইল দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
  confirmPassword: z.string(),
  role: z.enum(["admin", "moderator"] as const)
}).refine((data) => data.password === data.confirmPassword, {
  message: "পাসওয়ার্ড মিলছে না",
  path: ["confirmPassword"]
});

const AdminSignup = () => {
  const navigate = useNavigate();
  const { user, isSuperAdmin, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "moderator" as "admin" | "moderator"
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/admin/login");
      } else if (!isSuperAdmin) {
        toast({
          title: "অ্যাক্সেস নিষেধ",
          description: "শুধুমাত্র সুপার অ্যাডমিন নতুন অ্যাকাউন্ট তৈরি করতে পারেন",
          variant: "destructive"
        });
        navigate("/admin/dashboard");
      }
    }
  }, [user, isSuperAdmin, authLoading, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      signupSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "ভ্যালিডেশন এরর",
          description: err.errors[0].message,
          variant: "destructive"
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`,
          data: { name: formData.name }
        }
      });

      if (authError) {
        if (authError.message?.includes("already registered")) {
          throw new Error("এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে");
        }
        throw authError;
      }

      if (authData.user) {
        // Use RPC function to assign role (runs with SECURITY DEFINER)
        const { error: roleError } = await supabase.rpc("assign_user_role", {
          target_user_id: authData.user.id,
          target_role: formData.role
        });

        if (roleError) {
          console.error("Role assignment error:", roleError);
          toast({
            title: "আংশিক সফল",
            description: "অ্যাকাউন্ট তৈরি হয়েছে কিন্তু রোল সেট করতে সমস্যা হয়েছে। Users পেজ থেকে রোল সেট করুন।",
            variant: "destructive"
          });
          navigate("/admin/users");
          return;
        }

        toast({
          title: "সফল!",
          description: `নতুন ${formData.role === 'admin' ? 'অ্যাডমিন' : 'মডারেটর'} অ্যাকাউন্ট তৈরি হয়েছে`
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "moderator"
        });

        navigate("/admin/users");
      }
    } catch (error: any) {
      toast({
        title: "অ্যাকাউন্ট তৈরি ব্যর্থ",
        description: error.message || "কিছু সমস্যা হয়েছে",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">নতুন স্টাফ তৈরি করুন</CardTitle>
          <CardDescription>অ্যাডমিন বা মডারেটর অ্যাকাউন্ট তৈরি করুন</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">পূর্ণ নাম</Label>
              <Input
                id="name"
                type="text"
                placeholder="আপনার নাম"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল</Label>
              <Input
                id="email"
                type="email"
                placeholder="staff@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <Input
                id="password"
                type="password"
                placeholder="পাসওয়ার্ড দিন"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="পাসওয়ার্ড আবার দিন"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">রোল</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "moderator") => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="রোল নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">অ্যাডমিন</SelectItem>
                  <SelectItem value="moderator">মডারেটর</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              অ্যাকাউন্ট তৈরি করুন
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link 
              to="/admin/dashboard" 
              className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              ড্যাশবোর্ডে ফিরে যান
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSignup;
