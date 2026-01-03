import { Link } from "react-router-dom";
import { Search, Menu, X, Sun, Moon, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/categories";
interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}
export const Header = ({
  isDark,
  toggleTheme
}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const today = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const mainMenuItems = categories.slice(0, 8);
  return <header className="bg-background border-b border-border sticky top-0 z-50">
      {/* Top bar */}
      <div className="container py-2 flex items-center justify-between text-sm text-muted-foreground border-b border-border">
        <span>{today}</span>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">লগইন</span>
          </Button>
        </div>
      </div>
      
      {/* Main header */}
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground px-3 py-2 font-serif font-bold text-xl">
              Daily 
our times  
  
            </div>
            <div className="font-serif">
              <span className="text-2xl font-bold text-foreground">Our Times</span>
              <div className="text-xs text-muted-foreground">সত্যের সন্ধানে</div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors">
              হোম
            </Link>
            {mainMenuItems.map(cat => <Link key={cat.id} to={`/category/${cat.slug}`} className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors">
                {cat.name}
              </Link>)}
          </nav>
          
          {/* Search & Mobile menu */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && <nav className="lg:hidden border-t border-border bg-background">
          <div className="container py-4 flex flex-col gap-2">
            <Link to="/" className="px-3 py-2 hover:bg-muted rounded" onClick={() => setMobileMenuOpen(false)}>
              হোম
            </Link>
            {categories.map(cat => <Link key={cat.id} to={`/category/${cat.slug}`} className="px-3 py-2 hover:bg-muted rounded" onClick={() => setMobileMenuOpen(false)}>
                {cat.name}
              </Link>)}
          </div>
        </nav>}
    </header>;
};