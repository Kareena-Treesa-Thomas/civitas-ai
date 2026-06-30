import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FALLBACK_DATA = {
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items } = await req.json();

    if (!items || typeof items !== "string") {
      return new Response(JSON.stringify({ error: "items field is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.log("No LOVABLE_API_KEY found, using fallback data");
      return new Response(JSON.stringify(FALLBACK_DATA), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a grocery price comparison expert for India. Compare grocery prices for the following items across major online grocery platforms.

Stores to compare: Blinkit, Zepto, BigBasket, Amazon Fresh, Swiggy Instamart, Flipkart Supermart, Nature's Basket, JioMart

Items requested: ${items}

For each store provide realistic Indian market prices (in INR ₹) for each item, subtotal, discount percentage (between 8-25%), final price after discount, typical delivery time, delivery cost (some stores offer free delivery above a threshold), free delivery threshold amount, and Google rating (4.0-4.6 range).

Mark the store with the lowest final_price as "best": true.

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "stores": [
    {
      "name": "Blinkit",
      "items": { "ItemName": price_number },
      "subtotal": number,
      "discount": number,
      "final_price": number,
      "delivery_time": "10 mins",
      "delivery_cost": number,
      "free_delivery_above": number,
      "rating": number,
      "best": false
    }
  ]
}

Make prices realistic for 2024 India market. Only one store should have "best": true (the cheapest final_price).`;

    let responseData;

    try {
      const aiResponse = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.3,
          }),
        }
      );

      if (!aiResponse.ok) {
        if (aiResponse.status === 429) {
          console.log("Rate limited, using fallback");
          return new Response(JSON.stringify({ ...FALLBACK_DATA, fallback: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (aiResponse.status === 402) {
          console.log("Payment required, using fallback");
          return new Response(JSON.stringify({ ...FALLBACK_DATA, fallback: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error(`AI gateway error: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      const content = aiData.choices?.[0]?.message?.content;

      if (!content) throw new Error("No content from AI");

      // Clean up the response - remove markdown code blocks if present
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      responseData = JSON.parse(cleaned);

      // Ensure exactly one store is marked as best (lowest final_price)
      if (responseData.stores && Array.isArray(responseData.stores)) {
        const lowestPrice = Math.min(...responseData.stores.map((s: any) => s.final_price));
        responseData.stores = responseData.stores.map((s: any) => ({
          ...s,
          best: s.final_price === lowestPrice,
        }));
        // If there are ties, mark only the first one as best
        let bestFound = false;
        responseData.stores = responseData.stores.map((s: any) => {
          if (s.best && !bestFound) { bestFound = true; return s; }
          return { ...s, best: false };
        });
      }
    } catch (parseError) {
      console.error("AI parse error, using fallback:", parseError);
      return new Response(JSON.stringify({ ...FALLBACK_DATA, fallback: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ ...FALLBACK_DATA, fallback: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
