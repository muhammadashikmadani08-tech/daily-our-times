import { Link } from "react-router-dom";
import { Facebook, Twitter, Youtube } from "lucide-react";
import { categories } from "@/data/categories";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground px-2 py-1 font-serif font-bold">Daily</div>
              <span className="font-serif font-bold text-lg">Our Times</span>
            </div>
            <p className="text-sm text-muted-foreground">
              বাংলাদেশের অন্যতম প্রধান অনলাইন সংবাদ পোর্টাল। সত্য ও নিরপেক্ষ সংবাদ পরিবেশনে প্রতিশ্রুতিবদ্ধ।
            </p>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="font-serif font-bold mb-4">বিভাগসমূহ</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {categories.slice(0, 8).map((cat) => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className="text-muted-foreground hover:text-primary">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-serif font-bold mb-4">গুরুত্বপূর্ণ লিংক</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/about" className="text-muted-foreground hover:text-primary">আমাদের সম্পর্কে</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary">যোগাযোগ</Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-primary">গোপনীয়তা নীতি</Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary">শর্তাবলি</Link>
              <Link to="/advertise" className="text-muted-foreground hover:text-primary">বিজ্ঞাপন</Link>
            </div>
          </div>
          
          {/* Social */}
          <div>
            <h4 className="font-serif font-bold mb-4">সংযুক্ত থাকুন</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-muted p-2 rounded hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-muted p-2 rounded hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-muted p-2 rounded hover:bg-primary hover:text-primary-foreground transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          © ২০২৫ Daily Our Times। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
};
