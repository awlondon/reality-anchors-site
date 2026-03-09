/**
 * Seed script — writes the plan tiers to Firestore app_config/plans.
 *
 * Run once to populate the plans document that both the portal and
 * Flutter app read from:
 *
 *   npx ts-node seed-plans.ts
 *
 * Requires GOOGLE_APPLICATION_CREDENTIALS env var pointing to a
 * service account key file, or run from a machine already authenticated
 * with `gcloud auth application-default login`.
 */

import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

const tiers: Record<string, Record<string, unknown>> = {
  pilot: {
    name: "Pilot",
    description: "Ideal for evaluation and small-scale deployment",
    active: true,
    stripePriceId: "",
    pricePerSeat: 1200,
    annualPriceUsd: 14400,
    perSeatAnnualUsd: 14400,
    baseSeats: 1,
    includedActions: 15000,
    overagePerAction: 0.03,
    features: [
      "AR-guided execution overlay",
      "Daily usage dashboards",
      "Email support (48h SLA)",
    ],
    enabledModules: ["ar_overlay", "usage_dashboard"],
    supportTier: "standard",
    recommended: false,
  },
  production: {
    name: "Production",
    description: "For production fabrication teams running daily",
    active: true,
    stripePriceId: "",
    pricePerSeat: 3200,
    annualPriceUsd: 38400,
    perSeatAnnualUsd: 38400,
    baseSeats: 1,
    includedActions: 20000,
    overagePerAction: 0.025,
    features: [
      "Everything in Pilot",
      "Advanced analytics & QA scoring",
      "Priority support (24h SLA)",
      "Custom calibration profiles",
    ],
    enabledModules: [
      "ar_overlay",
      "usage_dashboard",
      "analytics",
      "qa_scoring",
      "calibration",
    ],
    supportTier: "premium",
    recommended: true,
  },
  enterprise: {
    name: "Enterprise",
    description:
      "Full platform with compliance, audit trails & dedicated support",
    active: true,
    stripePriceId: "",
    pricePerSeat: 4800,
    annualPriceUsd: 57600,
    perSeatAnnualUsd: 57600,
    baseSeats: 1,
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
      "ar_overlay",
      "usage_dashboard",
      "analytics",
      "qa_scoring",
      "calibration",
      "compliance",
      "audit_trails",
    ],
    supportTier: "dedicated",
    recommended: false,
  },
};

async function seed() {
  console.log("Seeding app_config/plans...");
  await db.doc("app_config/plans").set({
    tiers,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log("Done. Plan tiers written to Firestore.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
