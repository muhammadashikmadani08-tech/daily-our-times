import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "staff" | "admin" | "super_admin";
}

export const ProtectedRoute = ({ children, requiredRole = "staff" }: ProtectedRouteProps) => {
  const { user, isLoading, isStaff, isAdmin, isSuperAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check role-based access
  let hasAccess = false;
  
  switch (requiredRole) {
    case "super_admin":
      hasAccess = isSuperAdmin;
      break;
    case "admin":
      hasAccess = isAdmin || isSuperAdmin;
      break;
    case "staff":
      hasAccess = isStaff;
      break;
    default:
      hasAccess = false;
  }

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};