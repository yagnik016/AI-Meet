"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Shield, Loader2, Zap, Building2, Users } from "lucide-react";
import { useRazorpay } from "@/hooks/use-razorpay";
import { toast } from "sonner";

interface PricingCardProps {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description?: string;
  features: string[];
  plan?: "starter" | "pro" | "enterprise";
  isPopular?: boolean;
  buttonText: string;
  variant?: "default" | "popular" | "enterprise";
  isYearly: boolean;
  icon?: React.ReactNode;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function PricingCard({
  name,
  monthlyPrice,
  yearlyPrice,
  description,
  features,
  plan,
  isPopular = false,
  buttonText,
  variant = "default",
  isYearly,
  icon,
}: PricingCardProps) {
  const { initiatePayment, isLoading } = useRazorpay();
  const [isProcessing, setIsProcessing] = useState(false);

  const price = isYearly ? yearlyPrice : monthlyPrice;
  const period = isYearly ? "/year" : "/month";

  const handlePayment = async () => {
    if (!plan) return;
    setIsProcessing(true);
    
    const success = await initiatePayment({
      plan,
      amount: price,
      name: `MeetAI ${name} Plan`,
      description: `Subscribe to ${name} plan (${isYearly ? 'Yearly' : 'Monthly'}) for ₹${price} INR`,
    });

    if (success) {
      toast.success("Payment successful! Your subscription is now active.");
    } else {
      toast.error("Payment failed or was cancelled.");
    }
    
    setIsProcessing(false);
  };

  const isButtonDisabled = isLoading || isProcessing;

  if (variant === "popular") {
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -8 }}
        className="rounded-2xl border-2 border-primary bg-background/50 backdrop-blur-sm p-6 relative"
      >
        {/* Popular Badge */}
        <div className="relative">
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-purple-500 px-4 py-1 text-xs font-medium text-white shadow-lg z-10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Most Popular
          </motion.div>
        </div>
        
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">{name}</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">₹{price}</span>
            <span className="text-sm text-muted-foreground">{period}</span>
          </div>
          {isYearly && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Save ₹{(monthlyPrice * 12) - yearlyPrice} per year
            </p>
          )}
          
          <ul className="mt-6 space-y-3 text-sm">
            {features.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="mr-0 h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          
          <button
            onClick={handlePayment}
            disabled={isButtonDisabled}
            className="mt-6 block w-full rounded-full bg-gradient-to-r from-primary to-purple-500 px-4 py-3 text-center text-sm font-medium text-white hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isButtonDisabled ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </span>
            ) : (
              buttonText
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  if (variant === "enterprise") {
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -8 }}
        className="rounded-2xl border bg-background/50 backdrop-blur-sm p-6 hover:shadow-xl hover:shadow-primary/10 transition-all"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>
        <div className="text-4xl font-bold">Custom</div>
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <ul className="mt-6 space-y-3 text-sm">
          {features.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="mr-0 h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        
        <a
          href="/contact"
          className="mt-6 block w-full rounded-full border-2 border-input bg-background px-4 py-3 text-center text-sm font-medium hover:bg-accent transition-colors"
        >
          {buttonText}
        </a>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8 }}
      className="rounded-2xl border bg-background/50 backdrop-blur-sm p-6 hover:shadow-xl hover:shadow-primary/10 transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && <div className="p-1.5 rounded-lg bg-primary/10">{icon}</div>}
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold">₹{price}</span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </div>
      {isYearly && price > 0 && (
        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
          Save ₹{(monthlyPrice * 12) - yearlyPrice} per year
        </p>
      )}
      
      <ul className="mt-6 space-y-3 text-sm">
        {features.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckCircle2 className="mr-0 h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      
      {price === 0 ? (
        <a
          href="/signup"
          className="mt-6 block w-full rounded-full border-2 border-input bg-background px-4 py-3 text-center text-sm font-medium hover:bg-accent transition-colors"
        >
          {buttonText}
        </a>
      ) : (
        <button
          onClick={handlePayment}
          disabled={isButtonDisabled}
          className="mt-6 block w-full rounded-full border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary px-4 py-3 text-center text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isButtonDisabled ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </span>
          ) : (
            buttonText
          )}
        </button>
      )}
    </motion.div>
  );
}
