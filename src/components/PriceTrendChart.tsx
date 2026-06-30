import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { StoreData } from "./StoreCard";
import { TrendingDown } from "lucide-react";

interface PriceTrendChartProps {
  stores: StoreData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border shadow-card rounded-xl px-4 py-3">
        <p className="font-semibold text-sm text-foreground mb-1">{label}</p>
        <p className="text-primary font-bold text-lg">₹{payload[0].value}</p>
        <p className="text-xs text-muted-foreground">{payload[1]?.value}% discount</p>
      </div>
    );
  }
  return null;
};

export default function PriceTrendChart({ stores }: PriceTrendChartProps) {
  const data = stores.map((s) => ({
    name: s.name.replace(" Supermart", "").replace(" Instamart", ""),
    price: s.final_price,
    discount: s.discount,
    best: s.best,
  }));

  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="card-glass p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="section-title text-2xl">Price Trend Across Platforms</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Final bill comparison after discounts</p>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Final Price (₹)</span>
          </div>
          <div className="bg-primary/10 rounded-lg px-3 py-1.5 text-sm">
            <span className="text-muted-foreground">Best deal: </span>
            <span className="font-bold text-primary">₹{minPrice}</span>
          </div>
          <div className="bg-secondary rounded-lg px-3 py-1.5 text-sm">
            <span className="text-muted-foreground">Highest: </span>
            <span className="font-bold text-foreground">₹{maxPrice}</span>
          </div>
          <div className="bg-accent/20 rounded-lg px-3 py-1.5 text-sm">
            <span className="text-muted-foreground">You save: </span>
            <span className="font-bold text-accent-foreground">₹{maxPrice - minPrice} choosing best</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              angle={-35}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v) => `₹${v}`}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={minPrice}
              stroke="hsl(var(--primary))"
              strokeDasharray="4 4"
              label={{ value: "Best", fill: "hsl(var(--primary))", fontSize: 11, position: "right" }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                const isBest = payload.price === minPrice;
                return (
                  <circle
                    key={`dot-${payload.name}`}
                    cx={cx}
                    cy={cy}
                    r={isBest ? 7 : 4}
                    fill={isBest ? "hsl(var(--primary))" : "hsl(var(--card))"}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                );
              }}
              activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
