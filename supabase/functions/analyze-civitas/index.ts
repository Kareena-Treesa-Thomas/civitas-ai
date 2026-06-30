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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.log("No LOVABLE_API_KEY found for analyze-civitas");
      return new Response(JSON.stringify({ fallback: true, entity: vendor, sentiment: "negative", category: "pricing", confidence: 0.5 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Extract structured trust data from the following short user note about a local vendor. Return ONLY valid JSON in this exact shape:\n{ "entity": "vendor name", "sentiment": "positive"|"negative", "category": "pricing"|"quality"|"honesty", "confidence": number }\n\nNote: ${note}\nVendor: ${vendor}`;

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
      console.error("AI gateway error", aiResponse.status);
      return new Response(JSON.stringify({ fallback: true, entity: vendor, sentiment: "negative", category: "pricing", confidence: 0.5 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content ?? "";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("Parse error for civitas AI response", err);
      return new Response(JSON.stringify({ fallback: true, entity: vendor, sentiment: "negative", category: "pricing", confidence: 0.5 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
