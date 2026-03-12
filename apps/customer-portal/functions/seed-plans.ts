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
    perSeatPriceId: "<PILOT_PER_SEAT_STRIPE_PRICE_ID>",
    pricePerSeat: 1200,
    annualPriceUsd: 14400,
    perSeatAnnualUsd: 14400,
    baseSeats: 1,
    includedActions: 0,
    overagePerAction: 0,
    features: [
      "AR-guided execution overlay",
      "Daily usage dashboards",
      "Email support (48h SLA)",
    ],
    enabledModules: ["ar_execution", "daily_dashboards"],
    supportTier: "standard",
    recommended: false,
  },
  production: {
    name: "Production",
    description: "For production fabrication teams running daily",
    active: true,
    stripePriceId: "",
    perSeatPriceId: "<PRODUCTION_PER_SEAT_STRIPE_PRICE_ID>",
    pricePerSeat: 3200,
    annualPriceUsd: 38400,
    perSeatAnnualUsd: 38400,
    baseSeats: 1,
    includedActions: 0,
    overagePerAction: 0,
    features: [
      "Everything in Pilot",
      "Advanced analytics & QA scoring",
      "Priority support (24h SLA)",
      "Custom calibration profiles",
    ],
    enabledModules: [
      "ar_execution",
      "daily_dashboards",
      "analytics_qa",
      "custom_calibration",
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
    perSeatPriceId: "<ENTERPRISE_PER_SEAT_STRIPE_PRICE_ID>",
    pricePerSeat: 4800,
    annualPriceUsd: 57600,
    perSeatAnnualUsd: 57600,
    baseSeats: 1,
    includedActions: 0,
    overagePerAction: 0,
    features: [
      "Everything in Production",
      "Compliance evidence export",
      "Tamper-proof audit trails",
      "Dedicated account manager",
      "SLA-backed uptime guarantee",
    ],
    enabledModules: [
      "ar_execution",
      "daily_dashboards",
      "analytics_qa",
      "custom_calibration",
      "compliance_export",
      "audit_trails",
    ],
    supportTier: "enterprise",
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
