/** User profile stored in users/{uid} */
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role?: 'admin' | 'manager' | 'operator';
  orgId?: string;
  orgIds?: string[];
  orgMemberships?: Record<string, unknown>;
}

/** Organization */
export interface Org {
  id: string;
  name: string;
  createdAt?: Date;
}

/** Daily usage record from orgs/{orgId}/usage_daily/* */
export interface UsageDaily {
  date: string;
  totalBends: number;
  accurateBends: number;
  totalPieces: number;
  scrapPieces: number;
  activeSeats: number;
  operatorHoursMinutes: number; // in minutes
}

/** KPI snapshot computed from usage data */
export interface KpiSnapshot {
  totalBends: number;
  bendAccuracy: number; // percentage
  piecesPerHour: number;
  scrapRate: number; // percentage
  activeSeats: number;
  operatorHours: number;
}

/** Subscription from orgs/{orgId}/subscriptions/* */
export interface Subscription {
  id: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete';
  planId: string;
  planName: string;
  licensedBenches: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
}

/** Seat from orgs/{orgId}/seats/* */
export interface Seat {
  id: string;
  benchName: string;
  assignedTo?: string;
  assignedEmail?: string;
  status: 'active' | 'available' | 'suspended';
  lastActive?: Date;
}

/** Available plan for onboarding */
export interface Plan {
  id: string;
  name: string;
  description: string;
  pricePerSeat: number;
  interval: 'month' | 'year';
  includedActions: number;
  overagePerAction: number;
  features: string[];
  recommended?: boolean;
}

/** Contract from orgs/{orgId}/contracts/* */
export interface Contract {
  id: string;
  title: string;
  status: 'draft' | 'pending' | 'active' | 'expired' | 'terminated';
  createdAt: Date;
  expiresAt?: Date;
  signedAt?: Date;
  signedBy?: string;
  documentUrl?: string;
  terms?: string;
}

/** Note from orgs/{orgId}/notes/* */
export interface Note {
  id: string;
  text: string;
  authorUid: string;
  authorEmail: string;
  authorName?: string;
  context: string; // page/section where note was created: 'dashboard', 'seats', 'subscription', etc.
  createdAt: Date;
  pinned?: boolean;
}

/** Org health doc from admin_analytics/org_health_* */
export interface OrgHealth {
  orgId: string;
  orgName: string;
  churnRiskScore: number; // 0-100
  lastActive: Date;
  totalBends30d: number;
  activeSeats: number;
  licensedSeats: number;
  paymentStatus: 'current' | 'past_due' | 'canceled' | 'none';
  featureAdoption: number; // percentage
}
