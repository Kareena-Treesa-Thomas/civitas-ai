import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeaderProps {
  onLoginClick: () => void;
  onFeaturesClick: () => void;
  onAboutClick: () => void;
}

export default function Header({ onLoginClick, onFeaturesClick, onAboutClick }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-btn">
            <ShoppingCart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold font-display text-foreground tracking-tight">
            Grocery<span className="text-primary">AI</span>
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
            GroceryAI
          </Link>
          <Link to="/civitas" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
            Civitas AI
          </Link>
          <button
            onClick={onFeaturesClick}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
          >
            Features
          </button>
          <button
            onClick={onAboutClick}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
          >
            About
          </button>
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <Button onClick={onLoginClick} className="btn-gradient px-5 h-9 text-sm">
            Login
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-card/95 backdrop-blur-lg px-4 py-3 flex flex-col gap-1">
          <Link to="/" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary transition-colors">GroceryAI</Link>
          <Link to="/civitas" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary transition-colors">Civitas AI</Link>
          <button onClick={() => { onFeaturesClick(); setMobileOpen(false); }} className="px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary transition-colors text-left">Features</button>
          <button onClick={() => { onAboutClick(); setMobileOpen(false); }} className="px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary transition-colors text-left">About</button>
          <Button onClick={() => { onLoginClick(); setMobileOpen(false); }} className="btn-gradient mt-1 h-9 text-sm">Login</Button>
        </div>
      )}
    </header>
  );
}
