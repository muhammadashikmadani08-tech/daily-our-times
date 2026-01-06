import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("সঠিক ইমেইল দিন");
const passwordSchema = z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");

const SetupAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(formData.email);
      passwordSchema.parse(formData.password);
      if (!formData.name.trim()) {
        throw new Error("নাম দিন");
      }
    } catch (err) {
      toast({
        title: "ভ্যালিডেশন এরর",
        description: err instanceof z.ZodError ? err.errors[0].message : (err as Error).message,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if any super_admin already exists
      const { data: existingRoles } = await supabase
        .from("user_roles")
        .select("id")
        .eq("role", "super_admin")
        .limit(1);

      if (existingRoles && existingRoles.length > 0) {
        toast({
          title: "সুপার অ্যাডমিন আগেই আছে",
          description: "এই সেটআপ শুধু প্রথমবার ব্যবহার করা যাবে",
          variant: "destructive"
        });
        navigate("/admin/login");
        return;
      }

      // Create user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { name: formData.name }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      // Add super_admin role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: authData.user.id,
          role: "super_admin"
        });

      if (roleError) throw roleError;

      toast({
        title: "সুপার অ্যাডমিন তৈরি হয়েছে",
        description: "এখন লগইন করুন"
      });
      
      navigate("/admin/login");
    } catch (error: any) {
      toast({
        title: "এরর",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">প্রথম সুপার অ্যাডমিন সেটআপ</CardTitle>
          <CardDescription>Daily Our Times - CMS সেটআপ</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">নাম</Label>
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
                placeholder="admin@example.com"
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
                placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              সুপার অ্যাডমিন তৈরি করুন
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupAdmin;
