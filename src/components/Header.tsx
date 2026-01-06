import { Link } from "react-router-dom";
import { Search, Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { useSiteLogo } from "@/hooks/useSiteSettings";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const Header = ({ isDark, toggleTheme }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: categories } = useCategories();
  const { data: siteLogo } = useSiteLogo();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      {/* Main Mobile Header */}
      <div className="container py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            {siteLogo ? (
              <img 
                src={siteLogo} 
                alt="Daily Our Times" 
                className="h-10 max-w-[160px] object-contain"
              />
            ) : (
              <div className="flex items-center gap-1">
                <div className="text-primary-foreground font-serif font-bold text-lg bg-primary px-2 py-1 rounded">
                  Daily    
                </div>
                <div className="font-serif">
                  <span className="text-xl font-bold text-foreground">Our Times</span>
                </div>
              </div>
            )}
          </Link>
          
          {/* Right side icons - Search, Theme, Menu */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Category Navigation Bar - Horizontal Scrollable */}
      <div className="border-t border-border bg-background">
        <div className="container">
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2 -mx-1">
            <Link 
              to="/" 
              className="flex-shrink-0 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-full"
            >
              হোম
            </Link>
            {categories?.map(cat => (
              <Link 
                key={cat.id} 
                to={`/category/${cat.slug}`} 
                className="flex-shrink-0 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted rounded-full transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Mobile Fullscreen Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[52px] bg-background z-40 overflow-y-auto">
          <div className="container py-4 flex flex-col gap-1">
            <Link 
              to="/" 
              className="px-4 py-3 text-lg font-medium hover:bg-muted rounded-lg" 
              onClick={() => setMobileMenuOpen(false)}
            >
              হোম
            </Link>
            {categories?.map(cat => (
              <Link 
                key={cat.id} 
                to={`/category/${cat.slug}`} 
                className="px-4 py-3 text-lg font-medium hover:bg-muted rounded-lg" 
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
