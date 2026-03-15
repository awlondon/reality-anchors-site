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
  activeBenches: number;
  operatorHoursMinutes: number; // in minutes
}

/** KPI snapshot computed from usage data */
export interface KpiSnapshot {
  totalBends: number;
  bendAccuracy: number; // percentage
  piecesPerHour: number;
  scrapRate: number; // percentage
  activeBenches: number;
  operatorHours: number;
}

/** Subscription from orgs/{orgId}/subscriptions/* — aligned with Flutter app */
export interface Subscription {
  id: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete';
  planId: string;
  planName: string;
  licensedBenches: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  orgId?: string;
  contractId?: string;
  stripeCustomerId?: string;
  priceId?: string;
}

/** Bench from orgs/{orgId}/benches/* — aligned with Flutter app schema */
export interface Bench {
  id: string;
  benchId?: string;
  orgId?: string;
  assignedUid?: string | null;
  assignedEmail?: string | null;
  workbenchId?: string | null;
  status: 'active' | 'available' | 'suspended';
  assignedAt?: Date | null;
  releasedAt?: Date | null;
  createdAt?: Date;
}

/** Device add-on selected during checkout */
export interface DeviceSelection {
  deviceId: 'context_camera' | 'lidar_device';
  quantity: number;
}

/** Available plan for onboarding */
export interface Plan {
  id: string;
  name: string;
  description: string;
  pricePerBench: number;
  interval: 'month' | 'year';
  includedActions: number;
  overagePerAction: number;
  features: string[];
  recommended?: boolean;
}

/** Contract from orgs/{orgId}/contracts/* — aligned with Flutter app schema */
export interface Contract {
  id: string;
  contractId?: string;
  title?: string;
  status: 'draft' | 'sent' | 'signed' | 'cancelled' | 'pending' | 'active' | 'expired' | 'terminated';
  createdAt: Date;
  expiresAt?: Date;
  signedAt?: Date;
  signatoryName?: string;
  signedByUid?: string;
  pdfPath?: string;
  pdfSha256?: string;
  terms?: Record<string, unknown>;
  warnings?: string[];
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
  activeBenches: number;
  licensedBenches: number;
  paymentStatus: 'current' | 'past_due' | 'canceled' | 'none';
  featureAdoption: number; // percentage
}
