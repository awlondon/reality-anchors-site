// Stripe config — loaded from functions/.env or Firebase environment
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";
export const PORTAL_URL = process.env.PORTAL_URL ?? "https://reality-anchors-ltd.web.app";
