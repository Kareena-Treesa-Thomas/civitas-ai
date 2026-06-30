import Modal from "./Modal";
import { ShoppingCart, Target, Eye, Zap, Store, PiggyBank, LayoutDashboard, RefreshCw } from "lucide-react";

interface FeaturesModalProps {
  open: boolean;
  onClose: () => void;
}

const features = [
  {
    icon: <Zap className="w-5 h-5 text-primary" />,
    title: "Real-Time Price Comparison",
    desc: "GroceryAI instantly compares grocery prices across multiple online platforms, helping users quickly find the lowest available price.",
  },
  {
    icon: <ShoppingCart className="w-5 h-5 text-primary" />,
    title: "Smart AI Search",
    desc: "The AI-powered search allows users to quickly locate products and also suggests cheaper or better alternatives to save more money.",
  },
  {
    icon: <Store className="w-5 h-5 text-primary" />,
    title: "Multi-Store Support",
    desc: "Users can compare prices from Blinkit, Zepto, BigBasket, Amazon Fresh, Swiggy Instamart, Flipkart Supermart, Nature's Basket, and JioMart.",
  },
  {
    icon: <PiggyBank className="w-5 h-5 text-primary" />,
    title: "Cost Savings",
    desc: "By identifying the cheapest store for each product, GroceryAI helps users reduce their overall grocery expenses significantly.",
  },
  {
    icon: <LayoutDashboard className="w-5 h-5 text-primary" />,
    title: "Fast & Simple Interface",
    desc: "The platform provides a clean and user-friendly interface, allowing users to search for products and get results within seconds.",
  },
  {
    icon: <RefreshCw className="w-5 h-5 text-primary" />,
    title: "Updated Product Data",
    desc: "Product prices and availability are updated regularly, ensuring users receive accurate and reliable comparisons.",
  },
];

export default function FeaturesModal({ open, onClose }: FeaturesModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Key Features of GroceryAI">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Everything you need to make smarter grocery shopping decisions.
        </p>
        <div className="space-y-3">
          {features.map((f, i) => (
            <div key={i} className="flex gap-3.5 p-4 rounded-xl bg-secondary/50 border border-border/50">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                {f.icon}
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-1">{i + 1}. {f.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
