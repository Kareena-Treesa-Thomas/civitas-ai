import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Sentiment = "positive" | "negative";
type Category = "pricing" | "quality" | "honesty";

type AIResult = {
  entity: string;
  sentiment: Sentiment;
  category: Category;
  confidence: number;
};

type Report = {
  id: string;
  vendor: string;
  note: string;
  reporter?: string;
  storeLink?: string;
  result: AIResult;
  createdAt: string;
};

const STORAGE_KEY = "civitas_reports_v1";
const HERO_KEY = "civitas_hero_score";

export default function Civitas() {
  const [vendor, setVendor] = useState("");
  const [note, setNote] = useState("");
  // reporter input removed
  const [storeLink, setStoreLink] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [query, setQuery] = useState("");
  const [heroScore, setHeroScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setReports(JSON.parse(raw));
    const hs = Number(localStorage.getItem(HERO_KEY) ?? 0);
    setHeroScore(hs);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(HERO_KEY, String(heroScore));
  }, [heroScore]);

  const analyzeNote = async (vendorName: string, noteText: string): Promise<AIResult> => {
    // Call the Supabase function pattern used elsewhere in the project
    try {
      console.log("analyze-civitas invoke", { vendor: vendorName, notePreview: noteText.slice(0, 200) });
      const { data, error } = await supabase.functions.invoke("analyze-civitas", {
        body: { vendor: vendorName, note: noteText },
      });

      if (error) {
        console.error("Supabase function error", error);
        throw error;
      }
      if (!data) {
        console.warn("Supabase function returned no data", { vendorName, noteText });
        console.error("Supabase function returned no data", { vendorName, noteText });
        throw new Error("No response from AI");
      }

      console.log("analyze-civitas response", data);
      // Expected shape: { entity, sentiment, category, confidence }
      return {
        entity: data.entity ?? vendorName,
        sentiment: data.sentiment ?? "negative",
        category: data.category ?? "quality",
        confidence: Number(data.confidence ?? 0.5),
      } as AIResult;
    } catch (e) {
      console.error("analyzeNote fallback — error calling analyze-civitas", e);
      // Fallback simple parser if the function is unavailable
      const lowered = noteText.toLowerCase();
      const sentiment: Sentiment = /good|fair|reliable|trust|honest/.test(lowered) ? "positive" : "negative";
      const category: Category = /price|charge|overcharg|cost/.test(lowered) ? "pricing" : /quality|fresh|service/.test(lowered) ? "quality" : "honesty";
      return { entity: vendorName, sentiment, category, confidence: 0.6 };
    }
  };

  const handleSubmit = async (e?: any) => {
    e?.preventDefault();
    if (!vendor.trim() || !note.trim()) return;
    setIsLoading(true);
    try {
      const ai = await analyzeNote(vendor.trim(), note.trim());

      const rep: Report = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        vendor: vendor.trim(),
        note: note.trim(),
        // reporter removed
        storeLink: storeLink.trim() || undefined,
        result: ai,
        createdAt: new Date().toISOString(),
      };

      setReports((s) => [rep, ...s]);
      setHeroScore((s) => s + 1);
      setVendor("");
      setNote("");
      
      setStoreLink("");
    } catch (err) {
      console.error(err);
      alert("Failed to analyze note");
    } finally {
      setIsLoading(false);
    }
  };

  const reportsFor = (name: string) => reports.filter((r) => r.vendor.toLowerCase() === name.toLowerCase());

  const getStatus = (name: string) => {
    const list = reportsFor(name);
    if (list.length === 0) return { verified: false, sentiment: null as Sentiment | null };
    const counts: Record<string, number> = {};
    for (const r of list) {
      counts[r.result.sentiment] = (counts[r.result.sentiment] ?? 0) + 1;
    }
    const pos = counts["positive"] ?? 0;
    const neg = counts["negative"] ?? 0;
    if (pos >= 2) return { verified: true, sentiment: "positive" as Sentiment };
    if (neg >= 2) return { verified: true, sentiment: "negative" as Sentiment };
    return { verified: false, sentiment: pos > neg ? "positive" : neg > pos ? "negative" : null };
  };

  const shownName = query.trim();
  const shownReports = shownName ? reportsFor(shownName) : [];
  if (shownName) {
    console.log("Civitas search debug", {
      query: shownName,
      matchingCount: shownReports.length,
      sentiments: shownReports.map((r) => ({ id: r.id, sentiment: r.result.sentiment, category: r.result.category, confidence: r.result.confidence })),
    });
  }
  const shownStatus = shownName ? getStatus(shownName) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={() => {}} onFeaturesClick={() => {}} onAboutClick={() => {}} />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Civitas AI — Local Vendor Trust</h1>
            <div className="text-sm text-muted-foreground">Hero Score: <span className="font-medium">{heroScore}</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 bg-card p-4 rounded-lg border border-border/50">
            <div>
              <label className="text-sm text-muted-foreground">Vendor / Shop name</label>
              <input value={vendor} onChange={(e) => setVendor(e.target.value)} className="w-full mt-1 input" placeholder="e.g. Krishna Grocers" />
            </div>
            {/* reporter removed */}
            <div>
              <label className="text-sm text-muted-foreground">Store link (optional)</label>
              <input value={storeLink} onChange={(e) => setStoreLink(e.target.value)} className="w-full mt-1 input" placeholder="https://maps.google.com/?q=... or store website" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Trust note</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full mt-1 textarea" rows={3} placeholder="e.g. This shop overcharges on packaged goods" />
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={isLoading} className="h-9">Submit Report</Button>
              <Button type="button" onClick={() => { setVendor(""); setNote(""); }} variant="ghost" className="h-9">Clear</Button>
            </div>
          </form>

          <div className="space-y-2 bg-card p-4 rounded-lg border border-border/50">
            <h2 className="font-medium">Search vendor</h2>
            <div className="flex gap-2 mt-2">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type vendor name to look up" className="input flex-1" />
              <Button type="button" onClick={() => setQuery("")}>Clear</Button>
            </div>

            {shownName && (
              <div className="mt-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{shownName}</h3>
                  {shownStatus && (
                    shownStatus.verified ? (
                      <Badge variant="success">Verified ({shownStatus.sentiment})</Badge>
                    ) : (
                      <Badge>Unverified</Badge>
                    )
                  )}
                </div>

                <div className="mt-3 space-y-2">
                  {shownReports.length === 0 && <div className="text-sm text-muted-foreground">No reports yet for this vendor.</div>}
                  {shownReports.map((r) => (
                    <div key={r.id} className="p-3 bg-secondary/6 rounded-md border border-border/30">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{r.reporter ? `Reported by ${r.reporter}` : "Anonymous"}</div>
                      </div>
                      <div className="mt-1 font-medium">{r.note}</div>
                      <div className="mt-2 text-sm flex items-center gap-2">
                        <span className="text-muted-foreground">Sentiment:</span>
                        <Badge>{r.result.sentiment}</Badge>
                        <span className="text-muted-foreground">Category:</span>
                        <Badge>{r.result.category}</Badge>
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className="font-medium">{Math.round(r.result.confidence * 100)}%</span>
                      </div>
                      {r.storeLink && (
                        <div className="mt-2">
                          <a href={r.storeLink} target="_blank" rel="noreferrer" className="text-sm text-primary underline">View Store</a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Recent reports</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reports.slice(0, 6).map((r) => (
                <div key={r.id} className="p-3 bg-card rounded-md border border-border/30">
                  <div className="text-sm text-muted-foreground">{r.vendor} · {new Date(r.createdAt).toLocaleDateString()}</div>
                  <div className="mt-1">{r.note}</div>
                </div>
              ))}
              {reports.length === 0 && <div className="text-sm text-muted-foreground">No reports yet — be the first to submit.</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
