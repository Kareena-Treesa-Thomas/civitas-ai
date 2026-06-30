import { useState } from "react";
import { Search, Sparkles, Loader2 } from "lucide-react";
import heroImg from "@/assets/hero-groceries.jpg";

interface HeroSectionProps {
  onAnalyze: (items: string) => void;
  isLoading: boolean;
}

export default function HeroSection({ onAnalyze, isLoading }: HeroSectionProps) {
  const [groceryInput, setGroceryInput] = useState("");

  const handleSubmit = () => {
    if (groceryInput.trim()) {
      onAnalyze(groceryInput.trim());
    }
  };

  return (
    <section id="hero" className="relative min-h-[580px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/75 via-primary-dark/70 to-primary/60" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center py-16 gap-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary-foreground/15 backdrop-blur-sm border border-primary-foreground/25 rounded-full px-4 py-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-primary-foreground text-xs font-semibold tracking-wide uppercase">AI-Powered Price Comparison</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight max-w-3xl">
          Find the Cheapest{" "}
          <span className="text-accent">Groceries</span> Instantly
        </h1>

        <p className="text-primary-foreground/85 text-lg md:text-xl max-w-xl leading-relaxed">
          AI compares prices across all grocery apps so you don't have to. Save more every time you shop.
        </p>

        {/* Input Card */}
        <div className="w-full max-w-2xl bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 mt-2 border border-border/40">
          <label className="block text-sm font-semibold text-foreground mb-2 text-left">
            Your Grocery List
          </label>
          <textarea
            value={groceryInput}
            onChange={(e) => setGroceryInput(e.target.value)}
            placeholder="Enter your grocery list (Milk, Eggs, Bread, Rice, Onions, Tomatoes...)"
            rows={3}
            className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) handleSubmit();
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !groceryInput.trim()}
            className="btn-gradient w-full mt-4 h-12 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 spinner" />
                Analyzing grocery prices using AI...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Analyze Best Deals
              </>
            )}
          </button>
          {!isLoading && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press <kbd className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono">Ctrl+Enter</kbd> to analyze
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
