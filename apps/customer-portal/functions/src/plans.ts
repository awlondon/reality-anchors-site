/**
 * Production System Licensing — pricing tiers
 *
 * Each tier includes a per-bench monthly rate plus an included
 * fabrication action allowance. Overage is billed per-action.
 */

export interface PlanTier {
  id: string;
  name: string;
  description: string;
  pricePerSeat: number;       // monthly $/bench
  interval: "month";
  includedActions: number;    // fabrication actions per bench per month
  overagePerAction: number;   // $/action beyond allowance
  features: string[];
  recommended?: boolean;
  stripePriceId?: string;     // populated once Stripe Products are created
}

export const PLANS: PlanTier[] = [
  {
    id: "pilot",
    name: "Pilot",
    description: "Ideal for evaluation and single-cell deployments",
    pricePerSeat: 1200,
    interval: "month",
    includedActions: 15000,
    overagePerAction: 0.03,
    features: [
      "1–3 benches",
      "15,000 fabrication actions / bench / mo",
      "Real-time bend accuracy tracking",
      "Basic dashboard & KPIs",
      "Email support",
    ],
  },
  {
    id: "production",
    name: "Production",
    description: "Full-floor deployment with advanced analytics",
    pricePerSeat: 3200,
    interval: "month",
    includedActions: 20000,
    overagePerAction: 0.025,
    features: [
      "4–20 benches",
      "20,000 fabrication actions / bench / mo",
      "Advanced analytics & trend reports",
      "Seat management & operator tracking",
      "Priority support & onboarding",
      "API access",
    ],
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Multi-facility with dedicated support and SLAs",
    pricePerSeat: 4800,
    interval: "month",
    includedActions: 30000,
    overagePerAction: 0.02,
    features: [
      "Unlimited benches",
      "30,000 fabrication actions / bench / mo",
      "Multi-facility management",
      "Custom integrations & ERP connectors",
      "Dedicated CSM & 99.9% SLA",
      "Quarterly business reviews",
    ],
  },
];
