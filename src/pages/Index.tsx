import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StoreCard, { type StoreData } from "@/components/StoreCard";
import PriceTrendChart from "@/components/PriceTrendChart";
// Login removed; reporter name input is in Header
import FeaturesModal from "@/components/FeaturesModal";
import AboutModal from "@/components/AboutModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trophy, AlertCircle, LogOut, User } from "lucide-react";

const OFFLINE_FALLBACK_RESULTS = {
  stores: [
    {
      name: "Blinkit",
      items: { Milk: 62, Eggs: 72, Bread: 42, Rice: 85 },
      subtotal: 261,
      discount: 18,
      final_price: 214,
      delivery_time: "10 mins",
      delivery_cost: 25,
      free_delivery_above: 299,
      rating: 4.3,
      best: false,
    },
    {
      name: "Zepto",
      items: { Milk: 59, Eggs: 68, Bread: 38, Rice: 80 },
      subtotal: 245,
      discount: 15,
      final_price: 208,
      delivery_time: "10 mins",
      delivery_cost: 20,
      free_delivery_above: 199,
      rating: 4.2,
      best: false,
    },
    {
      name: "BigBasket",
      items: { Milk: 58, Eggs: 65, Bread: 36, Rice: 78 },
      subtotal: 237,
      discount: 20,
      final_price: 190,
      delivery_time: "2-4 hrs",
      delivery_cost: 0,
      free_delivery_above: 500,
      rating: 4.5,
      best: true,
    },
    {
      name: "Amazon Fresh",
      items: { Milk: 60, Eggs: 70, Bread: 40, Rice: 82 },
      subtotal: 252,
      discount: 12,
      final_price: 222,
      delivery_time: "2 hrs",
      delivery_cost: 0,
      free_delivery_above: 300,
      rating: 4.1,
      best: false,
    },
    {
      name: "Swiggy Instamart",
      items: { Milk: 63, Eggs: 73, Bread: 45, Rice: 88 },
      subtotal: 269,
      discount: 10,
      final_price: 242,
      delivery_time: "15 mins",
      delivery_cost: 30,
      free_delivery_above: 399,
      rating: 4.0,
      best: false,
    },
    {
      name: "Flipkart Supermart",
      items: { Milk: 57, Eggs: 67, Bread: 37, Rice: 79 },
      subtotal: 240,
      discount: 16,
      final_price: 202,
      delivery_time: "Next day",
      delivery_cost: 0,
      free_delivery_above: 500,
      rating: 4.2,
      best: false,
    },
    {
      name: "Nature's Basket",
      items: { Milk: 70, Eggs: 85, Bread: 55, Rice: 105 },
      subtotal: 315,
      discount: 8,
      final_price: 290,
      delivery_time: "3-5 hrs",
      delivery_cost: 50,
      free_delivery_above: 700,
      rating: 4.4,
      best: false,
    },
    {
      name: "JioMart",
      items: { Milk: 55, Eggs: 63, Bread: 35, Rice: 75 },
      subtotal: 228,
      discount: 22,
      final_price: 178,
      delivery_time: "Next day",
      delivery_cost: 0,
      free_delivery_above: 400,
      rating: 4.0,
      best: false,
    },
  ],
};

export default function Index() {
  // login removed; no auth required
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
      // Try normal Supabase Edge Function first
      let data: any = null;
      try {
        const invokeRes = await supabase.functions.invoke("analyze-groceries", { body: { items } });
        if (invokeRes.error) {
          console.error("analyze-groceries invoke error", invokeRes.error);
          throw invokeRes.error;
        }
        data = invokeRes.data;
        console.log("analyze-groceries raw response:", data);
      } catch (invokeErr: any) {
        console.warn("Supabase invoke failed, attempting local fallback", invokeErr);
        const msg = (invokeErr && (invokeErr.message || invokeErr.name)) || String(invokeErr);
        // If it's a network / FunctionsFetchError, try local Deno function
        if (msg.includes("Failed to send a request") || msg.includes("Failed to fetch") || msg.includes("FunctionsFetchError") || msg.includes("TypeError")) {
          try {
            const r = await fetch("http://localhost:8000/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items }) });
            data = await r.json();
            console.log("local analyze-groceries response:", data);
            // If the local server is the Civitas function it will return a vendor/note error
            if (data && data.error && typeof data.error === "string" && data.error.includes("vendor and note are required")) {
              throw new Error("Local server at http://localhost:8000 appears to be the Civitas function. Start the groceries function locally (supabase/functions/analyze-groceries) or deploy the groceries function.");
            }
          } catch (localErr) {
            console.warn("Local fallback failed, using offline sample data", localErr);
            data = { ...OFFLINE_FALLBACK_RESULTS, fallback: true };
          }
        } else {
          throw invokeErr;
        }
      }

      if (!data || !data.stores || data.stores.length === 0) {
        console.warn("analyze-groceries returned no stores, using offline sample data", data);
        data = { ...OFFLINE_FALLBACK_RESULTS, fallback: true };
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
      console.error("handleAnalyze error:", err);
      // Show detailed error to help debugging (status, message, body)
      const details = err && (err.message || JSON.stringify(err));
      toast.error(`Analysis failed: ${details}`);
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
        onLoginClick={() => {}}
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

      {/* Login removed; reporter name is collected in Header */}
      <FeaturesModal open={featuresOpen} onClose={() => setFeaturesOpen(false)} />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
}
