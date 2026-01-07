import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NewsDetail from "./pages/NewsDetail";
import Category from "./pages/Category";
import SubmitNews from "./pages/SubmitNews";
import Dashboard from "./pages/admin/Dashboard";
import Posts from "./pages/admin/Posts";
import Categories from "./pages/admin/Categories";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import PhotoCards from "./pages/admin/PhotoCards";
import UserNews from "./pages/admin/UserNews";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Admin route path
const ADMIN_PATH = "admin";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/submit-news" element={<SubmitNews />} />
              <Route path="/news/:slug" element={<NewsDetail />} />
              <Route path="/category/:slug" element={<Category />} />
              
              {/* Admin routes - Protected by role-based access control */}
              <Route path={`/${ADMIN_PATH}`} element={<ProtectedRoute requiredRole="staff"><Dashboard /></ProtectedRoute>} />
              <Route path={`/${ADMIN_PATH}/posts`} element={<ProtectedRoute requiredRole="admin"><Posts /></ProtectedRoute>} />
              <Route path={`/${ADMIN_PATH}/categories`} element={<ProtectedRoute requiredRole="admin"><Categories /></ProtectedRoute>} />
              <Route path={`/${ADMIN_PATH}/photo-cards`} element={<ProtectedRoute requiredRole="staff"><PhotoCards /></ProtectedRoute>} />
              <Route path={`/${ADMIN_PATH}/user-news`} element={<ProtectedRoute requiredRole="staff"><UserNews /></ProtectedRoute>} />
              <Route path={`/${ADMIN_PATH}/users`} element={<ProtectedRoute requiredRole="super_admin"><Users /></ProtectedRoute>} />
              <Route path={`/${ADMIN_PATH}/settings`} element={<ProtectedRoute requiredRole="admin"><Settings /></ProtectedRoute>} />
              
              {/* Redirect old secret path to proper admin */}
              <Route path="/secure-admin-dashboard-9xK23/*" element={<Navigate to={`/${ADMIN_PATH}`} replace />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
