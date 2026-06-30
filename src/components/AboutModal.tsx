import Modal from "./Modal";
import { ShoppingCart, Target, Eye } from "lucide-react";

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AboutModal({ open, onClose }: AboutModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="About GroceryAI">
      <div className="space-y-5">
        {/* Logo + intro */}
        <div className="flex items-center gap-3 p-4 bg-primary/8 rounded-xl border border-primary/20">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-btn shrink-0">
            <ShoppingCart className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground text-lg">GroceryAI</h3>
            <p className="text-sm text-muted-foreground">Smart Grocery Price Comparison Platform</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          GroceryAI is a smart platform that helps users instantly find the cheapest grocery prices across multiple online stores. Instead of opening several apps and manually comparing prices, GroceryAI automatically checks different grocery platforms and shows the best deal in seconds.
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed">
          The platform simplifies grocery shopping by providing price comparisons, smart suggestions, and a single place to view the lowest available prices.
        </p>

        {/* What it does */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-foreground">What GroceryAI Does?</h4>
          <ul className="space-y-2">
            {[
              "Compares grocery prices across multiple online grocery platforms",
              "Helps users quickly identify the lowest price available",
              "Saves time by showing results from different stores in one dashboard",
              "Provides AI-powered suggestions to help users choose the best value products",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Mission */}
        <div className="p-4 bg-secondary/60 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-sm text-foreground">Our Mission</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To make grocery shopping smarter, cheaper, and faster for everyone.
          </p>
        </div>

        {/* Vision */}
        <div className="p-4 bg-secondary/60 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-sm text-foreground">Our Vision</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To become the leading grocery price comparison platform, helping millions of users make better and more cost-effective shopping decisions every day.
          </p>
        </div>
      </div>
    </Modal>
  );
}
