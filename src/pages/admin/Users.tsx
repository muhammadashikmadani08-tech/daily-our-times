import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const Users = () => {
  const { isSuperAdmin, isAdmin, user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "moderator" as AppRole
  });

  const { data: usersWithRoles, isLoading } = useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");
      
      if (rolesError) throw rolesError;

      const userIds = [...new Set(roles?.map(r => r.user_id) || [])];
      
      if (userIds.length === 0) return [];

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);
      
      if (profilesError) throw profilesError;

      return profiles?.map(profile => ({
        ...profile,
        roles: roles?.filter(r => r.user_id === profile.id).map(r => r.role) || []
      })) || [];
    },
    enabled: isAdmin
  });

  const resetForm = () => {
    setFormData({ email: "", password: "", name: "", role: "moderator" });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      toast({ title: "সব ফিল্ড পূরণ করুন", variant: "destructive" });
      return;
    }

    if (!isSuperAdmin) {
      toast({ title: "শুধুমাত্র সুপার অ্যাডমিন নতুন ইউজার তৈরি করতে পারে", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create user via signUp
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

      // Add role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: authData.user.id,
          role: formData.role
        });

      if (roleError) throw roleError;

      toast({ title: "ইউজার তৈরি হয়েছে" });
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: "এরর", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (userId: string, role: AppRole) => {
    if (!isSuperAdmin) {
      toast({ title: "শুধুমাত্র সুপার অ্যাডমিন রোল মুছতে পারে", variant: "destructive" });
      return;
    }

    if (userId === currentUser?.id) {
      toast({ title: "নিজের রোল মুছতে পারবেন না", variant: "destructive" });
      return;
    }

    if (confirm("আপনি কি নিশ্চিত?")) {
      try {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", role);

        if (error) throw error;
        toast({ title: "রোল মুছে ফেলা হয়েছে" });
        queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      } catch (error: any) {
        toast({ title: "এরর", description: error.message, variant: "destructive" });
      }
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case "super_admin": return "destructive";
      case "admin": return "default";
      case "moderator": return "secondary";
      default: return "outline";
    }
  };

  const getRoleLabel = (role: AppRole) => {
    switch (role) {
      case "super_admin": return "সুপার অ্যাডমিন";
      case "admin": return "অ্যাডমিন";
      case "moderator": return "মডারেটর";
      default: return role;
    }
  };

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">এই পেজ দেখার অনুমতি নেই</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">ইউজার ম্যানেজমেন্ট</h1>
          {isSuperAdmin && (
            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  নতুন স্টাফ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>নতুন স্টাফ যোগ করুন</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>নাম *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="নাম"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ইমেইল *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>পাসওয়ার্ড *</Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="পাসওয়ার্ড"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>রোল</Label>
                    <Select value={formData.role} onValueChange={(v: AppRole) => setFormData({ ...formData, role: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moderator">মডারেটর</SelectItem>
                        <SelectItem value="admin">অ্যাডমিন</SelectItem>
                        <SelectItem value="super_admin">সুপার অ্যাডমিন</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                      বাতিল
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      তৈরি করুন
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>নাম</TableHead>
                    <TableHead>ইমেইল</TableHead>
                    <TableHead>রোল</TableHead>
                    {isSuperAdmin && <TableHead className="text-right">অ্যাকশন</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersWithRoles?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {user.roles.map((role: AppRole) => (
                            <Badge key={role} variant={getRoleBadgeVariant(role)}>
                              {getRoleLabel(role)}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      {isSuperAdmin && (
                        <TableCell className="text-right">
                          {user.id !== currentUser?.id && user.roles.map((role: AppRole) => (
                            <Button
                              key={role}
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRole(user.id, role)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          ))}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Users;
