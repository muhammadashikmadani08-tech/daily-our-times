import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  FolderTree, 
  Users, 
  Menu,
  X,
  Home,
  Settings,
  Image
} from "lucide-react";
import { useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

// Admin base path
const ADMIN_PATH = "/admin";

const menuItems = [
  { icon: LayoutDashboard, label: "ড্যাশবোর্ড", path: ADMIN_PATH },
  { icon: FileText, label: "পোস্ট", path: `${ADMIN_PATH}/posts` },
  { icon: FolderTree, label: "ক্যাটাগরি", path: `${ADMIN_PATH}/categories` },
  { icon: Image, label: "ফটো কার্ড", path: `${ADMIN_PATH}/photo-cards` },
  { icon: FileText, label: "ইউজার নিউজ", path: `${ADMIN_PATH}/user-news` },
  { icon: Users, label: "ইউজার", path: `${ADMIN_PATH}/users` },
  { icon: Settings, label: "সেটিংস", path: `${ADMIN_PATH}/settings` },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-background border-b border-border p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <span className="font-serif font-bold">Admin Panel</span>
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <Home className="h-5 w-5" />
          </Link>
        </Button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-background border-r border-border
          transform transition-transform lg:transform-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-4 border-b border-border">
              <h1 className="font-serif font-bold text-lg">Daily Our Times</h1>
              <p className="text-xs text-muted-foreground">CMS Panel</p>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                    ${location.pathname === item.path 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="p-4 border-t border-border">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  সাইটে যান
                </Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
