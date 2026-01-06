import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NewsDetail from "./pages/NewsDetail";
import Category from "./pages/Category";
import Dashboard from "./pages/admin/Dashboard";
import Posts from "./pages/admin/Posts";
import Categories from "./pages/admin/Categories";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import PhotoCards from "./pages/admin/PhotoCards";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Secret admin route
const SECRET_ADMIN_PATH = "secure-admin-dashboard-9xK23";

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
              <Route path="/news/:slug" element={<NewsDetail />} />
              <Route path="/category/:slug" element={<Category />} />
              
              {/* Secret admin routes */}
              <Route path={`/${SECRET_ADMIN_PATH}`} element={<Dashboard />} />
              <Route path={`/${SECRET_ADMIN_PATH}/posts`} element={<Posts />} />
              <Route path={`/${SECRET_ADMIN_PATH}/categories`} element={<Categories />} />
              <Route path={`/${SECRET_ADMIN_PATH}/photo-cards`} element={<PhotoCards />} />
              <Route path={`/${SECRET_ADMIN_PATH}/users`} element={<Users />} />
              <Route path={`/${SECRET_ADMIN_PATH}/settings`} element={<Settings />} />
              
              {/* Redirect old admin routes to home */}
              <Route path="/admin/*" element={<Navigate to="/" replace />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
