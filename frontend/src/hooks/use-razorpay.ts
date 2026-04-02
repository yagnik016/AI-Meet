"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";

interface PaymentOptions {
  plan: "starter" | "pro" | "enterprise";
  amount: number;
  name: string;
  description: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function useRazorpay() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRazorpayScript = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(script);
    });
  }, []);

  const initiatePayment = useCallback(
    async (options: PaymentOptions): Promise<boolean> => {
      if (!session?.accessToken) {
        setError("Please sign in to make a payment");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Load Razorpay script
        await loadRazorpayScript();

        // Get Razorpay key from backend
        const keyResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/key`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (!keyResponse.ok) {
          throw new Error("Failed to get payment key");
        }

        const { keyId } = await keyResponse.json();

        // Create order
        const orderResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/create-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify({
              plan: options.plan,
              amount: options.amount,
            }),
          }
        );

        if (!orderResponse.ok) {
          throw new Error("Failed to create order");
        }

        const order = await orderResponse.json();

        // Initialize Razorpay checkout
        return new Promise((resolve) => {
          const razorpayOptions = {
            key: keyId,
            amount: order.amount,
            currency: order.currency,
            name: options.name,
            description: options.description,
            order_id: order.orderId,
            handler: async function (response: RazorpayResponse) {
              // Verify payment
              try {
                const verifyResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/payments/verify`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${session.accessToken}`,
                    },
                    body: JSON.stringify({
                      orderId: response.razorpay_order_id,
                      paymentId: response.razorpay_payment_id,
                      signature: response.razorpay_signature,
                    }),
                  }
                );

                const result = await verifyResponse.json();

                if (result.success) {
                  resolve(true);
                } else {
                  setError("Payment verification failed");
                  resolve(false);
                }
              } catch (err) {
                setError("Payment verification error");
                resolve(false);
              }
            },
            prefill: {
              email: session.user?.email,
              name: session.user?.name,
            },
            theme: {
              color: "#6366f1",
            },
            modal: {
              ondismiss: function () {
                setIsLoading(false);
                resolve(false);
              },
            },
          };

          const razorpay = new window.Razorpay(razorpayOptions);
          razorpay.open();
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Payment failed");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [session, loadRazorpayScript]
  );

  return {
    initiatePayment,
    isLoading,
    error,
  };
}
