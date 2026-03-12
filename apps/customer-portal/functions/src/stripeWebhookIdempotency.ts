/**
 * Stripe webhook idempotency guard — prevents double-processing of events.
 * Aligned with the Flutter app's stripeWebhookIdempotency.ts.
 */

import * as admin from "firebase-admin";
import type Stripe from "stripe";
import { stripeEventDocPath } from "./commercialPaths";

export async function claimStripeEventIdempotency(
  db: FirebaseFirestore.Firestore,
  event: Pick<Stripe.Event, "id" | "type" | "livemode">,
): Promise<boolean> {
  const eventRef = db.doc(stripeEventDocPath(event.id));
  const eventSnap = await eventRef.get();
  if (eventSnap.exists) {
    return false;
  }

  await eventRef.set({
    type: event.type,
    processedAt: admin.firestore.FieldValue.serverTimestamp(),
    livemode: event.livemode,
  });

  return true;
}
