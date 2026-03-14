import { defineSecret } from "firebase-functions/params";

export const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
export const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

export const PORTAL_URL =
  process.env.PORTAL_URL ?? "https://reality-anchors-ltd.web.app";

export const CALLABLE_ORIGINS: string[] = [
  "https://reality-anchors-ltd.web.app",
  "https://realityanchorsltd.com",
  "https://www.realityanchorsltd.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];
