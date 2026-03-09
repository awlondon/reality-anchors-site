import { defineString } from "firebase-functions/params";

// Stripe config — set via `firebase functions:config:set` or Firebase Console
export const STRIPE_SECRET_KEY = defineString("STRIPE_SECRET_KEY");
export const STRIPE_WEBHOOK_SECRET = defineString("STRIPE_WEBHOOK_SECRET");

// Portal URL for Stripe redirects
export const PORTAL_URL = defineString("PORTAL_URL", {
  default: "https://reality-anchors-ltd.web.app",
});
