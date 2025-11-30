"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "50 contact views per day",
      "Browse 900+ agencies",
      "Search and filters",
      "Basic support",
    ],
    cta: "Current Plan",
    planKey: "free_user",
    disabled: true,
  },
  {
    name: "Pro",
    price: "$39",
    period: "per month",
    features: [
      "Unlimited contact views",
      "Priority support",
      "Advanced analytics",
      "Export contacts",
      "API access",
      "Early access to new features",
    ],
    cta: "Upgrade to Pro",
    planKey: "pro_subscription_plan",
    disabled: false,
    popular: true,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { user } = useUser();

  const handleUpgrade = async (planKey: string) => {
    if (planKey === "free_user") return;

    try {
      // Create Stripe Checkout session via Clerk
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planKey,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">AgencyScope</h1>
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-muted-foreground text-lg">
            Unlock unlimited access to government agency contacts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative border rounded-lg p-8 ${
                plan.popular
                  ? "border-primary shadow-lg ring-2 ring-primary"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                size="lg"
                disabled={plan.disabled}
                onClick={() => handleUpgrade(plan.planKey)}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12 text-muted-foreground"
        >
          <p>All plans include 14-day money-back guarantee</p>
          <p className="mt-2">Cancel anytime, no questions asked</p>
        </motion.div>
      </div>
    </div>
  );
}
