import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StoreCard, { type StoreData } from "@/components/StoreCard";
import PriceTrendChart from "@/components/PriceTrendChart";
import LoginModal from "@/components/LoginModal";
import FeaturesModal from "@/components/FeaturesModal";
import AboutModal from "@/components/AboutModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trophy, AlertCircle, LogOut, User } from "lucide-react";

export default function Index() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ stores: StoreData[]; fallback?: boolean } | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
  }, []);

  const handleAnalyze = async (items: string) => {
    setIsLoading(true);
    setResults(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-groceries", {
        body: { items },
      });

      if (error) throw error;

      if (!data?.stores || data.stores.length === 0) {
        throw new Error("No results returned");
      }

      setResults(data);

      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

      if (data.fallback) {
        toast.info("Showing sample data — AI results unavailable right now");
      } else {
        toast.success("Price analysis complete!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  const bestStore = results?.stores.find((s) => s.best);
  const otherStores = results?.stores.filter((s) => !s.best) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header
        onLoginClick={() => setLoginOpen(true)}
        onFeaturesClick={() => setFeaturesOpen(true)}
        onAboutClick={() => setAboutOpen(true)}
      />

      {/* User banner if logged in */}
      {user && (
        <div className="bg-primary/8 border-b border-primary/15 px-4 py-2">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <User className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Signed in as</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      )}

      <HeroSection onAnalyze={handleAnalyze} isLoading={isLoading} />

      {/* Results */}
      {results && (
        <div id="results" className="py-12 space-y-4">
          {/* Fallback notice */}
          {results.fallback && (
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 text-sm bg-accent/20 text-accent-foreground px-4 py-3 rounded-xl border border-accent/30">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Sample data shown — AI is warming up, try again in a moment for live results.
              </div>
            </div>
          )}

          {/* Best Store */}
          {bestStore && (
            <section className="container mx-auto px-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="section-title text-2xl">Best Online Store Recommendation</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Lowest total price across all platforms</p>
                </div>
              </div>
              <StoreCard store={bestStore} isBest={true} />
            </section>
          )}

          {/* Other stores grid */}
          {otherStores.length > 0 && (
            <section className="container mx-auto px-4">
              <h2 className="section-title text-xl mb-5 mt-8">All Store Comparisons</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {otherStores.map((store, i) => (
                  <StoreCard key={store.name} store={store} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Price Chart */}
          <PriceTrendChart stores={results.stores} />
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <span className="text-xs text-primary-foreground font-bold">G</span>
            </div>
            <span className="font-display font-bold text-foreground">Grocery<span className="text-primary">AI</span></span>
          </div>
          <p className="text-sm text-muted-foreground">
            Smart grocery price comparison powered by AI.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            © 2024 GroceryAI. Prices are AI-estimated for reference only.
          </p>
        </div>
      </footer>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <FeaturesModal open={featuresOpen} onClose={() => setFeaturesOpen(false)} />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
}
