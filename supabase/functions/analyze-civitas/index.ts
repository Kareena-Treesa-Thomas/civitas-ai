import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vendor, note } = await req.json();

    if (!vendor || !note) {
      return new Response(JSON.stringify({ error: "vendor and note are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check multiple env var names that might hold the API key
    const envKeys = ["LOVABLE_API_KEY", "GEMINI_API_KEY", "VITE_GEMINI_API_KEY"];
    const found: Record<string, boolean> = {};
    for (const k of envKeys) found[k] = !!Deno.env.get(k);
    console.log("analyze-civitas invoked", { vendor, note });
    console.log("API key presence:", found);

    // Prefer LOVABLE_API_KEY, then GEMINI_API_KEY, then VITE_GEMINI_API_KEY
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY") ?? Deno.env.get("GEMINI_API_KEY") ?? Deno.env.get("VITE_GEMINI_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.log("No API key found in environment for analyze-civitas — returning fallback");
      return new Response(JSON.stringify({ fallback: true, entity: vendor, sentiment: "negative", category: "pricing", confidence: 0.6 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Extract structured trust data from the following short user note about a local vendor. Return ONLY valid JSON in this exact shape:\n{ "entity": "vendor name", "sentiment": "positive"|"negative", "category": "pricing"|"quality"|"honesty", "confidence": number }\n\nNote: ${note}\nVendor: ${vendor}`;

    console.log("Sending request to AI gateway");
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });
    if (!aiResponse.ok) {
      const text = await aiResponse.text().catch(() => "<no body>");
      console.error("AI gateway returned non-OK status", { status: aiResponse.status, body: text });
      return new Response(JSON.stringify({ fallback: true, entity: vendor, sentiment: "negative", category: "pricing", confidence: 0.6, error: { status: aiResponse.status, body: text } }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json().catch((err) => {
      console.error("Failed to parse AI JSON response", err);
      throw err;
    });

    const content = aiData.choices?.[0]?.message?.content ?? "";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("Parse error for civitas AI response", err, "raw content:", cleaned.slice(0, 1000));
      return new Response(JSON.stringify({ fallback: true, entity: vendor, sentiment: "negative", category: "pricing", confidence: 0.6, parseError: String(err), raw: cleaned.slice(0, 2000) }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("AI parsed response", parsed);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-civitas function error", error);
    return new Response(JSON.stringify({ fallback: true, entity: null }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
