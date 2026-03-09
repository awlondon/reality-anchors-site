/**
 * Customer Portal Cloud Functions
 *
 * Data model aligned with the Flutter fabrication app's Cloud Functions
 * so both apps read/write the same Firestore structure.
 *
 * Key alignment points:
 * - Stripe customer stored at orgs/{orgId}/billing/customer
 * - Seats use seatId, assignedUid, workbenchId fields
 * - Contracts use "signed" status with signatoryName
 * - Plans read from Firestore app_config/plans with hardcoded fallback
 * - Webhook events are idempotent via stripe_events/{eventId}
 * - Org provisioning creates orgs/{orgId}/members/{uid} membership
 */

import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onRequest } from "firebase-functions/v2/https";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, PORTAL_URL } from "./config";
import { getAllPlans, resolvePlan } from "./plans";
import {
  orgBillingCustomerDocPath,
  orgSubscriptionDocPath,
  orgSubscriptionsCollectionPath,
  orgSeatsCollectionPath,
  orgSeatDocPath,
  orgContractDocPath,
} from "./commercialPaths";
import { claimStripeEventIdempotency } from "./stripeWebhookIdempotency";

admin.initializeApp();
const db = admin.firestore();

function getStripe(): Stripe {
  return new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" });
}

/* ─────────────────────────────────────────────
 * getAvailablePlans
 * Returns the pricing tiers from Firestore (or fallback)
 * ───────────────────────────────────────────── */
export const getAvailablePlans = onCall(async () => {
  const plans = await getAllPlans();
  return {
    plans: plans.map((p) => ({
      id: p.planId,
      name: p.name,
      description: p.description,
      pricePerSeat: p.pricePerSeat,
      interval: "month" as const,
      includedActions: p.includedActions,
      overagePerAction: p.overagePerAction,
      features: p.features,
      recommended: p.recommended,
    })),
  };
});

/* ─────────────────────────────────────────────
 * createStripeCheckoutSession
 * Creates a Stripe Checkout for new subscription.
 * Stores customer at orgs/{orgId}/billing/customer (aligned with Flutter app).
 * ───────────────────────────────────────────── */
export const createStripeCheckoutSession = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Must be signed in");

  const { planId, licensedBenches } = request.data as {
    planId: string;
    licensedBenches: number;
  };

  const plan = await resolvePlan(planId);
  if (!plan) throw new HttpsError("not-found", `Plan "${planId}" not found`);
  if (!licensedBenches || licensedBenches < 1)
    throw new HttpsError("invalid-argument", "licensedBenches must be >= 1");

  const userDoc = await db.doc(`users/${uid}`).get();
  const userData = userDoc.data();
  const email = userData?.email ?? request.auth?.token.email ?? "";

  // Resolve or create org
  let orgId = await resolveOrgId(uid);
  if (!orgId) {
    // Create org shell — will be fully provisioned by webhook
    const orgRef = db.collection("orgs").doc();
    orgId = orgRef.id;
    await orgRef.set({
      name: userData?.displayName
        ? `${userData.displayName}'s Organization`
        : "New Organization",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    await db.doc(`users/${uid}`).set({ orgId }, { merge: true });
  }

  // Get or create Stripe customer at orgs/{orgId}/billing/customer
  const stripe = getStripe();
  const customerId = await getOrCreateStripeCustomer(stripe, orgId, email);

  // Build line items
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  if (plan.stripePriceId) {
    lineItems.push({
      price: plan.stripePriceId,
      quantity: licensedBenches,
    });
  } else {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${plan.name} — Production System License`,
          description: `${plan.includedActions.toLocaleString()} fabrication actions/bench/mo included`,
        },
        unit_amount: plan.pricePerSeat * 100,
        recurring: { interval: "month" },
      },
      quantity: licensedBenches,
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: lineItems,
    success_url: `${PORTAL_URL}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${PORTAL_URL}/onboarding`,
    metadata: {
      orgId,
      uid,
    },
    subscription_data: {
      metadata: {
        orgId,
        uid,
        planId: plan.planId,
        planName: plan.name,
        licensedBenches: String(licensedBenches),
        planVersion: "v2",
      },
    },
  });

  return { url: session.url };
});

/* ─────────────────────────────────────────────
 * createCustomerPortalSession
 * Opens the Stripe Customer Portal for billing mgmt.
 * Reads customer from orgs/{orgId}/billing/customer.
 * ───────────────────────────────────────────── */
export const createCustomerPortalSession = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Must be signed in");

  const orgId = await resolveOrgId(uid);
  if (!orgId)
    throw new HttpsError("failed-precondition", "No organization found");

  const billingDoc = await db.doc(orgBillingCustomerDocPath(orgId)).get();
  const customerId = billingDoc.data()?.stripeCustomerId as string | undefined;
  if (!customerId)
    throw new HttpsError("failed-precondition", "No Stripe customer found");

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${PORTAL_URL}/billing`,
  });

  return { url: session.url };
});

/* ─────────────────────────────────────────────
 * Stripe Webhook
 * Handles checkout/subscription/invoice events with idempotency.
 * Data model aligned with Flutter app's handleStripeWebhook.
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
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      res.status(400).send("Invalid signature");
      return;
    }

    // Idempotency guard — skip already-processed events
    const claimed = await claimStripeEventIdempotency(db, event);
    if (!claimed) {
      res.status(200).json({ received: true, deduplicated: true });
      return;
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          if (session.mode === "subscription" && session.subscription) {
            const subId =
              typeof session.subscription === "string"
                ? session.subscription
                : session.subscription.id;
            await syncSubscription(stripe, subId);

            // Provision org if metadata is present
            const subObj = await stripe.subscriptions.retrieve(subId);
            const meta = subObj.metadata || {};
            if (meta.orgId && meta.uid) {
              await provisionOrganization({
                orgId: meta.orgId,
                uid: meta.uid,
                email: session.customer_email || "",
                planId: meta.planId,
                planName: meta.planName,
                licensedBenches: parseInt(meta.licensedBenches || "1", 10),
              });
            }
          }
          break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const sub = event.data.object as Stripe.Subscription;
          await syncSubscription(stripe, sub.id);
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice;
          const subId =
            typeof invoice.subscription === "string"
              ? invoice.subscription
              : invoice.subscription?.id;
          if (subId) {
            await syncSubscription(stripe, subId);
          }
          // Update admin health for visibility
          const customerId =
            typeof invoice.customer === "string"
              ? invoice.customer
              : invoice.customer?.id ?? "";
          if (customerId) {
            const orgId = await findOrgByStripeCustomer(customerId);
            if (orgId) {
              await db.doc(`admin_analytics/org_health_${orgId}`).set(
                { paymentStatus: "past_due" },
                { merge: true }
              );
            }
          }
          break;
        }

        case "invoice.paid": {
          const invoice = event.data.object as Stripe.Invoice;
          const subId =
            typeof invoice.subscription === "string"
              ? invoice.subscription
              : invoice.subscription?.id;
          if (subId) {
            await syncSubscription(stripe, subId);
          }
          break;
        }

        default:
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

/* ─────────────────────────────────────────────
 * assignSeat
 * Assigns a seat to an operator. Uses the Flutter app's
 * schema (seatId, assignedUid, workbenchId).
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

  const orgId = await resolveOrgId(uid);
  if (!orgId) throw new HttpsError("not-found", "No organization found");

  // Check licensed seat count
  const subsSnap = await db
    .collection(orgSubscriptionsCollectionPath(orgId))
    .where("status", "in", ["active", "past_due"])
    .limit(1)
    .get();

  const licensedBenches =
    (subsSnap.docs[0]?.data()?.licensedBenches as number) || 0;

  const activeSeats = await db
    .collection(orgSeatsCollectionPath(orgId))
    .where("status", "==", "active")
    .get();

  if (activeSeats.size >= licensedBenches) {
    throw new HttpsError(
      "failed-precondition",
      `All ${licensedBenches} licensed seats are in use`
    );
  }

  const seatRef = db.doc(orgSeatDocPath(orgId, seatId));
  const seatDoc = await seatRef.get();

  if (!seatDoc.exists)
    throw new HttpsError("not-found", "Seat not found");
  if (seatDoc.data()?.status !== "available")
    throw new HttpsError("failed-precondition", "Seat is not available");

  // Look up the assignee's uid by email (if they exist in Firebase Auth)
  let assignedUid: string | null = null;
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    assignedUid = userRecord.uid;
  } catch {
    // User may not exist yet — store email for now
  }

  await seatRef.update({
    assignedUid,
    assignedEmail: email,
    workbenchId: null,
    status: "active",
    assignedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});

/* ─────────────────────────────────────────────
 * releaseSeat
 * Releases an active seat back to available.
 * Uses null (not FieldValue.delete) to match Flutter app pattern.
 * ───────────────────────────────────────────── */
export const releaseSeat = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Must be signed in");

  const { seatId } = request.data as { seatId: string };
  if (!seatId) throw new HttpsError("invalid-argument", "seatId required");

  const orgId = await resolveOrgId(uid);
  if (!orgId) throw new HttpsError("not-found", "No organization found");

  const seatRef = db.doc(orgSeatDocPath(orgId, seatId));
  const seatDoc = await seatRef.get();

  if (!seatDoc.exists) throw new HttpsError("not-found", "Seat not found");
  if (seatDoc.data()?.status !== "active")
    throw new HttpsError("failed-precondition", "Seat is not active");

  await seatRef.update({
    assignedUid: null,
    assignedEmail: null,
    workbenchId: null,
    status: "available",
    assignedAt: null,
    releasedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});

/* ─────────────────────────────────────────────
 * updateSeatCount
 * Updates Stripe subscription quantity with prorations.
 * Provisions new seat docs on increase.
 * ───────────────────────────────────────────── */
export const updateSeatCount = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Must be signed in");

  const { newCount } = request.data as { newCount: number };
  if (!newCount || newCount < 1)
    throw new HttpsError("invalid-argument", "newCount must be >= 1");

  const orgId = await resolveOrgId(uid);
  if (!orgId) throw new HttpsError("not-found", "No organization found");

  const subsSnap = await db
    .collection(orgSubscriptionsCollectionPath(orgId))
    .where("status", "in", ["active", "trialing"])
    .limit(1)
    .get();

  if (subsSnap.empty)
    throw new HttpsError("failed-precondition", "No active subscription found");

  const subDoc = subsSnap.docs[0];
  const subData = subDoc.data();
  const currentCount = (subData.licensedBenches as number) ?? 0;

  if (newCount === currentCount) return { success: true };

  // The subscription doc ID is the Stripe subscription ID
  const stripeSubId = subDoc.id;

  const stripe = getStripe();
  const sub = await stripe.subscriptions.retrieve(stripeSubId);
  const itemId = sub.items.data[0]?.id;

  if (itemId) {
    await stripe.subscriptions.update(stripeSubId, {
      items: [{ id: itemId, quantity: newCount }],
      metadata: {
        ...sub.metadata,
        licensedBenches: String(newCount),
      },
      proration_behavior: "create_prorations",
    });
  }

  // Provision new seat docs if adding seats
  if (newCount > currentCount) {
    const batch = db.batch();
    for (let i = 0; i < newCount - currentCount; i++) {
      const seatRef = db.collection(orgSeatsCollectionPath(orgId)).doc();
      batch.set(seatRef, {
        seatId: seatRef.id,
        orgId,
        assignedUid: null,
        assignedEmail: null,
        workbenchId: null,
        status: "available",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        assignedAt: null,
      });
    }
    await batch.commit();
  }

  return { success: true };
});

/* ─────────────────────────────────────────────
 * signContract
 * Records a contract signature. Uses "signed" status
 * and signatoryName field (aligned with Flutter app).
 * ───────────────────────────────────────────── */
export const signContract = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Must be signed in");

  const { contractId } = request.data as { contractId: string };
  if (!contractId)
    throw new HttpsError("invalid-argument", "contractId required");

  const orgId = await resolveOrgId(uid);
  if (!orgId) throw new HttpsError("not-found", "No organization found");

  const contractRef = db.doc(orgContractDocPath(orgId, contractId));
  const contractDoc = await contractRef.get();

  if (!contractDoc.exists)
    throw new HttpsError("not-found", "Contract not found");

  const status = contractDoc.data()?.status;
  if (status !== "pending" && status !== "draft" && status !== "sent")
    throw new HttpsError(
      "failed-precondition",
      `Contract is ${status}, cannot sign`
    );

  const userDoc = await db.doc(`users/${uid}`).get();
  const userData = userDoc.data();
  const signatoryName =
    userData?.displayName ?? userData?.email ?? uid;

  await contractRef.update({
    status: "signed",
    signatoryName,
    signedAt: admin.firestore.FieldValue.serverTimestamp(),
    signedByUid: uid,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});

/* ─── Webhook helpers ─── */

/**
 * Syncs a Stripe subscription to Firestore.
 * Aligned with the Flutter app's syncSubscription.
 */
async function syncSubscription(
  stripe: Stripe,
  subscriptionId: string
): Promise<void> {
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const metadata = sub.metadata || {};
  const orgId = metadata.orgId;
  if (!orgId) {
    console.error("syncSubscription: missing orgId in subscription metadata");
    return;
  }

  const contractId = metadata.contractId || null;
  const licensedBenches = parseInt(metadata.licensedBenches || "1", 10);
  const planId = metadata.planId || null;
  const planName = metadata.planName || null;
  const priceId = sub.items.data[0]?.price.id || null;

  await db.doc(orgSubscriptionDocPath(orgId, sub.id)).set({
    orgId,
    contractId,
    planId,
    planName,
    stripeCustomerId: sub.customer as string,
    status: sub.status,
    currentPeriodStart: admin.firestore.Timestamp.fromMillis(
      sub.current_period_start * 1000
    ),
    currentPeriodEnd: admin.firestore.Timestamp.fromMillis(
      sub.current_period_end * 1000
    ),
    cancelAtPeriodEnd: sub.cancel_at_period_end,
    priceId,
    licensedBenches,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Provisions a new organization after Stripe checkout.
 * Aligned with the Flutter app's provisionOrganization.
 */
async function provisionOrganization(params: {
  orgId: string;
  uid: string;
  email: string;
  planId?: string;
  planName?: string;
  licensedBenches: number;
}): Promise<void> {
  const { orgId, uid, email, planId, planName, licensedBenches } = params;

  const orgRef = db.collection("orgs").doc(orgId);
  const orgSnap = await orgRef.get();

  let enabledModules: string[] = [];
  let supportTier = "standard";

  if (planId) {
    const plan = await resolvePlan(planId);
    if (plan) {
      enabledModules = plan.enabledModules;
      supportTier = plan.supportTier;
    }
  }

  const batch = db.batch();

  if (!orgSnap.exists) {
    batch.set(orgRef, {
      name: planName
        ? `Organization (${planName})`
        : "New Organization",
      licensedBenches,
      enabledModules,
      supportTier,
      planId: planId || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } else {
    batch.update(orgRef, {
      licensedBenches,
      enabledModules,
      supportTier,
      planId: planId || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Add the purchasing user as org owner
  const memberRef = orgRef.collection("members").doc(uid);
  batch.set(
    memberRef,
    {
      role: "owner",
      active: true,
      email,
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // Create initial seat assignments
  for (let i = 0; i < licensedBenches; i++) {
    const seatRef = db.collection(orgSeatsCollectionPath(orgId)).doc();
    batch.set(seatRef, {
      seatId: seatRef.id,
      orgId,
      assignedUid: i === 0 ? uid : null,
      assignedEmail: i === 0 ? email : null,
      workbenchId: null,
      status: i === 0 ? "active" : "available",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      assignedAt: i === 0 ? admin.firestore.FieldValue.serverTimestamp() : null,
    });
  }

  // Update user doc with org reference
  batch.update(db.doc(`users/${uid}`), {
    orgId,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();
  console.log(
    `Provisioned org ${orgId} with ${licensedBenches} seats for user ${uid}`
  );
}

/* ─── Shared helpers ─── */

async function getOrCreateStripeCustomer(
  stripe: Stripe,
  orgId: string,
  email: string,
): Promise<string> {
  const billingRef = db.doc(orgBillingCustomerDocPath(orgId));
  const billingSnap = await billingRef.get();

  if (billingSnap.exists) {
    const existing = billingSnap.data()?.stripeCustomerId as string | undefined;
    if (existing) return existing;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { orgId },
  });

  await billingRef.set({
    stripeCustomerId: customer.id,
    email,
    orgId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return customer.id;
}

async function resolveOrgId(uid: string): Promise<string | null> {
  const userDoc = await db.doc(`users/${uid}`).get();
  const data = userDoc.data();
  if (!data) return null;

  return (
    (data.orgId as string) ??
    (data.orgIds as string[] | undefined)?.[0] ??
    (data.orgMemberships
      ? Object.keys(data.orgMemberships)[0]
      : null)
  );
}

async function findOrgByStripeCustomer(
  stripeCustomerId: string
): Promise<string | null> {
  const orgsSnap = await db.collection("orgs").get();
  for (const orgDoc of orgsSnap.docs) {
    const billingSnap = await db
      .doc(orgBillingCustomerDocPath(orgDoc.id))
      .get();
    if (billingSnap.data()?.stripeCustomerId === stripeCustomerId) {
      return orgDoc.id;
    }
  }
  return null;
}
