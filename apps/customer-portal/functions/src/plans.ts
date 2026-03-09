/**
 * Plan tier configuration — reads from Firestore app_config/plans (aligned
 * with the Flutter app's planConfig.ts) with a hardcoded fallback so the
 * portal works even before the Firestore doc is seeded.
 */

import * as admin from "firebase-admin";

const PLANS_DOC_PATH = "app_config/plans";

/** Unified plan tier combining fields needed by both portal and Flutter app. */
export interface PlanTier {
  planId: string;
  name: string;
  description: string;
  active: boolean;

  // Stripe
  stripePriceId: string;

  // Pricing — portal displays monthly, Flutter app uses annual
  pricePerSeat: number; // monthly per-bench price
  annualPriceUsd: number; // annual equivalent

  // Usage limits
  includedActions: number;
  overagePerAction: number;

  // Features & modules
  features: string[];
  enabledModules: string[];
  supportTier: string;
  baseSeats: number;

  // Display
  recommended: boolean;
}

/** Hardcoded fallback plans used when Firestore doc doesn't exist yet. */
const FALLBACK_PLANS: PlanTier[] = [
  {
    planId: "pilot",
    name: "Pilot",
    description: "Ideal for evaluation and small-scale deployment",
    active: true,
    stripePriceId: "",
    pricePerSeat: 1200,
    annualPriceUsd: 14400,
    includedActions: 15000,
    overagePerAction: 0.03,
    features: [
      "AR-guided execution overlay",
      "Daily usage dashboards",
      "Email support (48h SLA)",
    ],
    enabledModules: ["ar_overlay", "usage_dashboard"],
    supportTier: "standard",
    baseSeats: 1,
    recommended: false,
  },
  {
    planId: "production",
    name: "Production",
    description: "For production fabrication teams running daily",
    active: true,
    stripePriceId: "",
    pricePerSeat: 3200,
    annualPriceUsd: 38400,
    includedActions: 20000,
    overagePerAction: 0.025,
    features: [
      "Everything in Pilot",
      "Advanced analytics & QA scoring",
      "Priority support (24h SLA)",
      "Custom calibration profiles",
    ],
    enabledModules: ["ar_overlay", "usage_dashboard", "analytics", "qa_scoring", "calibration"],
    supportTier: "premium",
    baseSeats: 1,
    recommended: true,
  },
  {
    planId: "enterprise",
    name: "Enterprise",
    description: "Full platform with compliance, audit trails & dedicated support",
    active: true,
    stripePriceId: "",
    pricePerSeat: 4800,
    annualPriceUsd: 57600,
    includedActions: 30000,
    overagePerAction: 0.02,
    features: [
      "Everything in Production",
      "Compliance evidence export",
      "Tamper-proof audit trails",
      "Dedicated account manager",
      "SLA-backed uptime guarantee",
    ],
    enabledModules: [
      "ar_overlay", "usage_dashboard", "analytics", "qa_scoring",
      "calibration", "compliance", "audit_trails",
    ],
    supportTier: "dedicated",
    baseSeats: 1,
    recommended: false,
  },
];

/**
 * Resolve a single plan by ID from Firestore, falling back to hardcoded plans.
 * Returns null if not found or inactive.
 */
export async function resolvePlan(planId: string): Promise<PlanTier | null> {
  const db = admin.firestore();
  const doc = await db.doc(PLANS_DOC_PATH).get();

  if (doc.exists) {
    const tiers = doc.data()?.tiers as Record<string, Record<string, unknown>> | undefined;
    if (tiers && tiers[planId]) {
      const plan = parsePlanTier(planId, tiers[planId]);
      return plan.active ? plan : null;
    }
  }

  // Fallback to hardcoded
  const fallback = FALLBACK_PLANS.find((p) => p.planId === planId);
  return fallback?.active ? fallback : null;
}

/**
 * Get all active plans. Reads from Firestore first, falls back to hardcoded.
 */
export async function getAllPlans(): Promise<PlanTier[]> {
  const db = admin.firestore();
  const doc = await db.doc(PLANS_DOC_PATH).get();

  if (doc.exists) {
    const tiers = doc.data()?.tiers as Record<string, Record<string, unknown>> | undefined;
    if (tiers && Object.keys(tiers).length > 0) {
      return Object.entries(tiers)
        .map(([planId, raw]) => parsePlanTier(planId, raw))
        .filter((p) => p.active);
    }
  }

  return FALLBACK_PLANS.filter((p) => p.active);
}

function parsePlanTier(planId: string, raw: Record<string, unknown>): PlanTier {
  return {
    planId,
    name: (raw.name as string) || planId,
    description: (raw.description as string) || "",
    active: raw.active !== false,
    stripePriceId: (raw.stripePriceId as string) || "",
    pricePerSeat: (raw.pricePerSeat as number) || 0,
    annualPriceUsd: (raw.annualPriceUsd as number) || 0,
    includedActions: (raw.includedActions as number) || 0,
    overagePerAction: (raw.overagePerAction as number) || 0,
    features: Array.isArray(raw.features) ? (raw.features as string[]) : [],
    enabledModules: Array.isArray(raw.enabledModules) ? (raw.enabledModules as string[]) : [],
    supportTier: (raw.supportTier as string) || "standard",
    baseSeats: (raw.baseSeats as number) || 1,
    recommended: (raw.recommended as boolean) || false,
  };
}
