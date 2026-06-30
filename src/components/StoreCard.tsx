import { Star, Truck, Trophy, ShoppingBag } from "lucide-react";

export interface StoreData {
  name: string;
  items: Record<string, number>;
  subtotal: number;
  discount: number;
  final_price: number;
  best?: boolean;
  delivery_time?: string;
  delivery_cost?: number;
  free_delivery_above?: number;
  rating?: number;
}

interface StoreCardProps {
  store: StoreData;
  isBest?: boolean;
  index?: number;
}

const STORE_LOGOS: Record<string, string> = {
  "Blinkit": "🟡",
  "Zepto": "🟣",
  "BigBasket": "🟢",
  "Amazon Fresh": "🔵",
  "Swiggy Instamart": "🟠",
  "Flipkart Supermart": "💙",
  "Nature's Basket": "🌿",
  "JioMart": "🔴",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-accent fill-accent" : "text-muted-foreground/40"}`}
        />
      ))}
      <span className="text-xs font-semibold text-foreground ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function StoreCard({ store, isBest, index }: StoreCardProps) {
  const emoji = STORE_LOGOS[store.name] || "🏪";
  const delayClass = index !== undefined ? `fade-in-up-delay-${Math.min(index % 3 + 1, 3)}` : "";

  if (isBest) {
    return (
      <div className={`best-store-card p-6 relative overflow-hidden fade-in-up ${delayClass}`}>
        {/* Best Value Badge */}
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 pulse-badge">
          <Trophy className="w-3.5 h-3.5" />
          BEST VALUE
        </div>

        <div className="flex items-start gap-4 mb-5">
          <div className="text-3xl">{emoji}</div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-xs text-muted-foreground font-medium">Best Online Store Recommendation</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">⭐ {store.name}</h2>
            {store.rating && <StarRating rating={store.rating} />}
          </div>
        </div>

        {/* Price summary */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-primary/10 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Final Price</p>
            <p className="font-display text-2xl font-bold text-primary">₹{store.final_price}</p>
          </div>
          <div className="bg-accent/15 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">You Save</p>
            <p className="font-display text-2xl font-bold text-accent-foreground">{store.discount}% OFF</p>
          </div>
        </div>

        {/* Item breakdown */}
        <div className="space-y-2 mb-4">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Products Purchased</p>
          {Object.entries(store.items).map(([item, price]) => (
            <div key={item} className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5 text-primary/60" />
                <span className="text-sm font-medium text-foreground">{item}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">₹{price}</span>
            </div>
          ))}
        </div>

        {/* Subtotal + delivery */}
        <div className="bg-secondary/60 rounded-xl p-3 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">₹{store.subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount ({store.discount}%)</span>
            <span className="font-medium text-primary">-₹{store.subtotal - store.final_price}</span>
          </div>
          {store.delivery_cost !== undefined && (
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Truck className="w-3.5 h-3.5" />
                Delivery
                {store.delivery_time && <span className="text-xs">({store.delivery_time})</span>}
              </div>
              <span className={`font-medium ${store.delivery_cost === 0 ? "text-primary" : ""}`}>
                {store.delivery_cost === 0 ? "FREE" : `₹${store.delivery_cost}`}
              </span>
            </div>
          )}
          {store.free_delivery_above && store.delivery_cost !== 0 && (
            <p className="text-xs text-muted-foreground">Free delivery above ₹{store.free_delivery_above}</p>
          )}
          <div className="flex justify-between text-sm font-bold pt-1 border-t border-border/40">
            <span>Total</span>
            <span className="text-primary">₹{store.final_price + (store.delivery_cost || 0)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card-glass p-5 fade-in-up ${delayClass}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{emoji}</span>
          <h3 className="font-display font-bold text-foreground">{store.name}</h3>
        </div>
        <span className="text-xs font-bold bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
          {store.discount}% OFF
        </span>
      </div>

      {store.rating && <div className="mb-3"><StarRating rating={store.rating} /></div>}

      {/* Items */}
      <div className="space-y-1.5 mb-3">
        {Object.entries(store.items).map(([item, price]) => (
          <div key={item} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item}</span>
            <span className="font-medium text-foreground">₹{price}</span>
          </div>
        ))}
      </div>

      {/* Delivery */}
      {store.delivery_cost !== undefined && (
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 bg-secondary/50 rounded-lg px-2.5 py-1.5">
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            <span>Delivery {store.delivery_time && `• ${store.delivery_time}`}</span>
          </div>
          <span className={store.delivery_cost === 0 ? "text-primary font-semibold" : ""}>
            {store.delivery_cost === 0 ? "FREE" : `₹${store.delivery_cost}`}
          </span>
        </div>
      )}

      {/* Price */}
      <div className="pt-2 border-t border-border/50 flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">Subtotal: ₹{store.subtotal}</p>
          <p className="text-xs text-muted-foreground">After discount</p>
        </div>
        <p className="font-display text-xl font-bold text-primary">₹{store.final_price}</p>
      </div>
    </div>
  );
}
