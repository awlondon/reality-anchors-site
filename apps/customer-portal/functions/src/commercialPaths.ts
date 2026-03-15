/**
 * Firestore path helpers — aligned with the Flutter app's commercialPaths.ts
 * so both apps read/write the same document structure.
 */

export function orgContractsCollectionPath(orgId: string): string {
  return `orgs/${orgId}/contracts`;
}

export function orgContractDocPath(orgId: string, contractId: string): string {
  return `${orgContractsCollectionPath(orgId)}/${contractId}`;
}

export function orgBillingCustomerDocPath(orgId: string): string {
  return `orgs/${orgId}/billing/customer`;
}

export function orgSubscriptionsCollectionPath(orgId: string): string {
  return `orgs/${orgId}/subscriptions`;
}

export function orgSubscriptionDocPath(
  orgId: string,
  subscriptionId: string,
): string {
  return `${orgSubscriptionsCollectionPath(orgId)}/${subscriptionId}`;
}

export function stripeEventDocPath(eventId: string): string {
  return `stripe_events/${eventId}`;
}

export function orgBenchesCollectionPath(orgId: string): string {
  return `orgs/${orgId}/benches`;
}

export function orgBenchDocPath(orgId: string, benchId: string): string {
  return `${orgBenchesCollectionPath(orgId)}/${benchId}`;
}
