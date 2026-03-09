import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onRequest } from "firebase-functions/v2/https";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, PORTAL_URL } from "./config";
import { PLANS } from "./plans";

admin.initializeApp();
const db = admin.firestore();

function getStripe(): Stripe {
  return new Stripe(STRIPE_SECRET_KEY.value(), { apiVersion: "2025-02-24.acacia" });
}

/* ─────────────────────────────────────────────
 * getAvailablePlans
 * Returns the pricing tiers (no auth required)
 * ───────────────────────────────────────────── */
export const getAvailablePlans = onCall(async () => {
  return {
    plans: PLANS.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      pricePerSeat: p.pricePerSeat,
      interval: p.interval,
      includedActions: p.includedActions,
      overagePerAction: p.overagePerAction,
      features: p.features,
      recommended: p.recommended ?? false,
    })),
  };
});

/* ─────────────────────────────────────────────
 * createStripeCheckoutSession
 * Creates a Stripe Checkout for new subscription
 * ───────────────────────────────────────────── */
export const createStripeCheckoutSession = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Must be signed in");

  const { planId, licensedBenches } = request.data as {
    planId: string;
    licensedBenches: number;
  };

  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) throw new HttpsError("not-found", `Plan "${planId}" not found`);
  if (!licensedBenches || licensedBenches < 1)
    throw new HttpsError("invalid-argument", "licensedBenches must be >= 1");

  // Get or create Stripe customer
  const userDoc = await db.doc(`users/${uid}`).get();
  const userData = userDoc.data();
  let customerId = userData?.stripeCustomerId as string | undefined;

  const stripe = getStripe();

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: userData?.email ?? request.auth?.token.email ?? "",
      metadata: { firebaseUid: uid },
    });
    customerId = customer.id;
    await db.doc(`users/${uid}`).set(
      { stripeCustomerId: customerId },
      { merge: true }
    );
  }

  // Use Stripe Price ID if configured, otherwise create ad-hoc price
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  if (plan.stripePriceId) {
    lineItems.push({
      price: plan.stripePriceId,
      quantity: licensedBenches,
    });
  } else {
    // Ad-hoc pricing — create price on the fly
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${plan.name} — Production System License`,
          description: `${plan.includedActions.toLocaleString()} fabrication actions/bench/mo included`,
        },
        unit_amount: plan.pricePerSeat * 100, // cents
        recurring: { interval: "month" },
      },
      quantity: licensedBenches,
    });
  }

  const portalUrl = PORTAL_URL.value();

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: lineItems,
    success_url: `${portalUrl}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${portalUrl}/onboarding`,
    metadata: {
      firebaseUid: uid,
      planId: plan.id,
      planName: plan.name,
      licensedBenches: String(licensedBenches),
    },
    subscription_data: {
      metadata: {
        firebaseUid: uid,
        planId: plan.id,
        planName: plan.name,
        licensedBenches: String(licensedBenches),
      },
    },
  });

  return { url: session.url };
});

/* ─────────────────────────────────────────────
 * createCustomerPortalSession
 * Opens the Stripe Customer Portal for billing mgmt
 * ───────────────────────────────────────────── */
export const createCustomerPortalSession = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Must be signed in");

  const userDoc = await db.doc(`users/${uid}`).get();
  const customerId = userDoc.data()?.stripeCustomerId as string | undefined;
  if (!customerId)
    throw new HttpsError("failed-precondition", "No Stripe customer found");

  const stripe = getStripe();
  const portalUrl = PORTAL_URL.value();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${portalUrl}/billing`,
  });

  return { url: session.url };
});

/* ─────────────────────────────────────────────
 * Stripe Webhook
 * Handles checkout.session.completed, subscription
 * updates, and invoice events
 * ───────────────────────────────────────────── */
export const stripeWebhook = onRequest(
  { cors: false },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const stripe = getStripe();
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        STRIPE_WEBHOOK_SECRET.value()
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      res.status(400).send("Invalid signature");
      return;
    }

    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutCompleted(
            event.data.object as Stripe.Checkout.Session
          );
          break;

        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await handleSubscriptionUpdate(
            event.data.object as Stripe.Subscription
          );
          break;

        case "invoice.payment_failed":
          await handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        default:
          // Unhandled event type
          break;
      }
    } catch (err) {
      console.error(`Error processing ${event.type}:`, err);
      res.status(500).send("Internal error");
      return;
    }

    res.status(200).json({ received: true });
  }
);

/* ─── Webhook handlers ─── */

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const uid = session.metadata?.firebaseUid;
  if (!uid) return;

  const planId = session.metadata?.planId ?? "unknown";
  const planName = session.metadata?.planName ?? "Unknown Plan";
  const licensedBenches = parseInt(
    session.metadata?.licensedBenches ?? "1",
    10
  );

  // Resolve or create org
  const userDoc = await db.doc(`users/${uid}`).get();
  const userData = userDoc.data();
  let orgId = userData?.orgId as string | undefined;

  if (!orgId) {
    // Create new org
    const orgRef = await db.collection("orgs").add({
      name: userData?.displayName
        ? `${userData.displayName}'s Organization`
        : "New Organization",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      ownerUid: uid,
    });
    orgId = orgRef.id;

    // Link user to org
    await db.doc(`users/${uid}`).set({ orgId }, { merge: true });
  }

  // Create subscription doc
  const stripeSubId = session.subscription as string;
  await db.doc(`orgs/${orgId}/subscriptions/${stripeSubId}`).set({
    status: "active",
    planId,
    planName,
    licensedBenches,
    currentPeriodStart: admin.firestore.Timestamp.now(),
    currentPeriodEnd: admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    ),
    cancelAtPeriodEnd: false,
    stripeSubscriptionId: stripeSubId,
    stripeCustomerId: session.customer as string,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Provision seats
  const batch = db.batch();
  for (let i = 0; i < licensedBenches; i++) {
    const seatRef = db.collection(`orgs/${orgId}/seats`).doc();
    batch.set(seatRef, {
      benchName: `Bench ${String.fromCharCode(65 + i)}`, // A, B, C...
      status: "available",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
}

async function handleSubscriptionUpdate(sub: Stripe.Subscription) {
  const uid = sub.metadata?.firebaseUid;
  if (!uid) return;

  const userDoc = await db.doc(`users/${uid}`).get();
  const orgId = userDoc.data()?.orgId as string | undefined;
  if (!orgId) return;

  const subRef = db.doc(`orgs/${orgId}/subscriptions/${sub.id}`);

  if (sub.status === "canceled") {
    await subRef.update({
      status: "canceled",
      cancelAtPeriodEnd: false,
    });
    return;
  }

  await subRef.update({
    status: sub.status === "past_due" ? "past_due" : sub.status,
    cancelAtPeriodEnd: sub.cancel_at_period_end,
    currentPeriodStart: admin.firestore.Timestamp.fromMillis(
      sub.current_period_start * 1000
    ),
    currentPeriodEnd: admin.firestore.Timestamp.fromMillis(
      sub.current_period_end * 1000
    ),
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Find user by Stripe customer ID
  const usersSnap = await db
    .collection("users")
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get();

  if (usersSnap.empty) return;
  const userDoc = usersSnap.docs[0];
  const orgId = userDoc.data().orgId as string | undefined;
  if (!orgId) return;

  // Update org health for admin visibility
  await db.doc(`admin_analytics/org_health_${orgId}`).set(
    { paymentStatus: "past_due" },
    { merge: true }
  );
}

/* ─────────────────────────────────────────────
 * assignSeat
 * Assigns an available seat to an operator email
 * ───────────────────────────────────────────── */
export const assignSeat = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Must be signed in");

  const { seatId, email } = request.data as {
    seatId: string;
    email: string;
  };

  if (!seatId || !email)
    throw new HttpsError("invalid-argument", "seatId and email required");

  const orgId = await getOrgId(uid);
  const seatRef = db.doc(`orgs/${orgId}/seats/${seatId}`);
  const seatDoc = await seatRef.get();

  if (!seatDoc.exists)
    throw new HttpsError("not-found", "Seat not found");
  if (seatDoc.data()?.status !== "available")
    throw new HttpsError("failed-precondition", "Seat is not available");

  await seatRef.update({
    assignedTo: email,
    assignedEmail: email,
    status: "active",
    lastActive: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});

/* ─────────────────────────────────────────────
 * releaseSeat
 * Releases an active seat back to available
 * ───────────────────────────────────────────── */
export const releaseSeat = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Must be signed in");

  const { seatId } = request.data as { seatId: string };
  if (!seatId) throw new HttpsError("invalid-argument", "seatId required");

  const orgId = await getOrgId(uid);
  const seatRef = db.doc(`orgs/${orgId}/seats/${seatId}`);
  const seatDoc = await seatRef.get();

  if (!seatDoc.exists) throw new HttpsError("not-found", "Seat not found");
  if (seatDoc.data()?.status !== "active")
    throw new HttpsError("failed-precondition", "Seat is not active");

  await seatRef.update({
    assignedTo: admin.firestore.FieldValue.delete(),
    assignedEmail: admin.firestore.FieldValue.delete(),
    status: "available",
  });

  return { success: true };
});

/* ─────────────────────────────────────────────
 * updateSeatCount
 * Adds or removes seats. May redirect to Stripe
 * if additional payment is needed.
 * ───────────────────────────────────────────── */
export const updateSeatCount = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Must be signed in");

  const { newCount } = request.data as { newCount: number };
  if (!newCount || newCount < 1)
    throw new HttpsError("invalid-argument", "newCount must be >= 1");

  const orgId = await getOrgId(uid);

  // Find active subscription
  const subsSnap = await db
    .collection(`orgs/${orgId}/subscriptions`)
    .where("status", "in", ["active", "trialing"])
    .limit(1)
    .get();

  if (subsSnap.empty)
    throw new HttpsError(
      "failed-precondition",
      "No active subscription found"
    );

  const subDoc = subsSnap.docs[0];
  const subData = subDoc.data();
  const currentCount = (subData.licensedBenches as number) ?? 0;

  if (newCount === currentCount) return { success: true };

  const stripeSubId = subData.stripeSubscriptionId as string | undefined;

  if (stripeSubId) {
    // Update Stripe subscription quantity
    const stripe = getStripe();
    const sub = await stripe.subscriptions.retrieve(stripeSubId);
    const itemId = sub.items.data[0]?.id;

    if (itemId) {
      await stripe.subscriptions.update(stripeSubId, {
        items: [{ id: itemId, quantity: newCount }],
        proration_behavior: "create_prorations",
      });
    }
  }

  // Update Firestore
  await subDoc.ref.update({ licensedBenches: newCount });

  // Provision new seats if adding
  if (newCount > currentCount) {
    const seatsSnap = await db
      .collection(`orgs/${orgId}/seats`)
      .get();
    const existingCount = seatsSnap.size;

    const batch = db.batch();
    for (let i = 0; i < newCount - currentCount; i++) {
      const seatRef = db.collection(`orgs/${orgId}/seats`).doc();
      batch.set(seatRef, {
        benchName: `Bench ${String.fromCharCode(
          65 + existingCount + i
        )}`,
        status: "available",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    await batch.commit();
  }

  return { success: true };
});

/* ─────────────────────────────────────────────
 * signContract
 * Records a contract signature
 * ───────────────────────────────────────────── */
export const signContract = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Must be signed in");

  const { contractId } = request.data as { contractId: string };
  if (!contractId)
    throw new HttpsError("invalid-argument", "contractId required");

  const orgId = await getOrgId(uid);
  const contractRef = db.doc(`orgs/${orgId}/contracts/${contractId}`);
  const contractDoc = await contractRef.get();

  if (!contractDoc.exists)
    throw new HttpsError("not-found", "Contract not found");

  const status = contractDoc.data()?.status;
  if (status !== "pending" && status !== "draft")
    throw new HttpsError(
      "failed-precondition",
      `Contract is ${status}, cannot sign`
    );

  // Get user info for signature record
  const userDoc = await db.doc(`users/${uid}`).get();
  const userData = userDoc.data();

  await contractRef.update({
    status: "active",
    signedAt: admin.firestore.FieldValue.serverTimestamp(),
    signedBy:
      userData?.displayName ?? userData?.email ?? uid,
  });

  return { success: true };
});

/* ─── Helpers ─── */

async function getOrgId(uid: string): Promise<string> {
  const userDoc = await db.doc(`users/${uid}`).get();
  const data = userDoc.data();
  if (!data) throw new HttpsError("not-found", "User profile not found");

  const orgId =
    (data.orgId as string) ??
    (data.orgIds as string[] | undefined)?.[0] ??
    (data.orgMemberships
      ? Object.keys(data.orgMemberships)[0]
      : undefined);

  if (!orgId) throw new HttpsError("not-found", "No organization found");
  return orgId;
}
