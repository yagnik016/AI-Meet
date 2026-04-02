"use client";

import { motion } from "framer-motion";

interface BillingToggleProps {
  isYearly: boolean;
  onToggle: (isYearly: boolean) => void;
}

export function BillingToggle({ isYearly, onToggle }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span
        className={`text-sm font-medium transition-colors ${
          !isYearly ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        Monthly
      </span>
      
      <button
        onClick={() => onToggle(!isYearly)}
        className="relative h-7 w-14 rounded-full bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Toggle yearly billing"
      >
        <motion.div
          className="absolute top-1 h-5 w-5 rounded-full bg-primary shadow-sm"
          animate={{ left: isYearly ? "calc(100% - 1.5rem)" : "0.25rem" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
      
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-medium transition-colors ${
            isYearly ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          Yearly
        </span>
        <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
          Save 20%
        </span>
      </div>
    </div>
  );
}
