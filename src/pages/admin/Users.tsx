import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const Users = () => {
  const { data: usersWithRoles, isLoading } = useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");
      
      if (rolesError) throw rolesError;

      const userIds = [...new Set(roles?.map(r => r.user_id) || [])];
      
      if (userIds.length === 0) return [];

      // Only select name for non-admin display - email access is admin-only via RLS
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, email")
        .in("id", userIds);
      
      if (profilesError) throw profilesError;

      return profiles?.map(profile => ({
        ...profile,
        roles: roles?.filter(r => r.user_id === profile.id).map(r => r.role) || []
      })) || [];
    }
  });

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">ইউজার তালিকা</h1>
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
