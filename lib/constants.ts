/**
 * Centralized constants for business logic, analytics thresholds, and model parameters.
 *
 * Extracted from scattered hardcoded values across conversionModel, marginModel,
 * finance, and calculator components. Changing a value here propagates everywhere.
 */

// ── Conversion Model (conversionModel.ts) ──────────────────────────────
/** Sigmoid weights for conversion score components */
export const CONVERSION_WEIGHTS = {
  dwell: 2.4,
  depth: 1.8,
  regime: 1.2,
  cta: 2.6,
  kpi: 1.0,
  bias: -2.5,
} as const;

/** Normalization caps for conversion score inputs */
export const CONVERSION_NORMS = {
  dwellMs: 8_000,
  scrollDepth: 100,
  regimeCount: 3,
  ctaClicks: 2,
  kpiReveals: 5,
} as const;

/** Intent classification thresholds */
export const INTENT_THRESHOLDS = {
  high: 0.7,
  emerging: 0.4,
} as const;

// ── Margin Model (marginModel.ts) ──────────────────────────────────────
/** Reference tonnage for volume scaling */
export const REFERENCE_ANNUAL_TONS = 25_000;

/** Pricing tier multipliers (fraction of annual EBITDA increase) */
export const PRICING_MULTIPLIERS = {
  lowFriction: 0.08,
  base: 0.12,
  aggressive: 0.15,
} as const;

// ── Finance (finance.ts) ───────────────────────────────────────────────
/** IRR solver parameters */
export const IRR_SOLVER = {
  maxIterations: 1_000,
  tolerance: 1e-7,
  gridSearchStart: -0.9,
  gridSearchEnd: 1.5,
  gridSearchStep: 0.01,
  gridSearchTolerance: 1e-3,
  minRate: -0.9999,
} as const;

// ── Email / Lead Capture ───────────────────────────────────────────────
/** EmailJS send timeout in milliseconds */
export const EMAIL_SEND_TIMEOUT_MS = 10_000;

/** Maximum retry attempts for email delivery */
export const EMAIL_MAX_RETRIES = 2;

/** Base delay between email retries in milliseconds (multiplied by attempt number) */
export const EMAIL_RETRY_DELAY_MS = 1_500;

/** Firebase lead save timeout in milliseconds */
export const FIREBASE_SAVE_TIMEOUT_MS = 10_000;

/** Maximum message length for lead form */
export const LEAD_FORM_MAX_MESSAGE_LENGTH = 2_000;

// ── Analytics ──────────────────────────────────────────────────────────
/** Scroll depth milestones to track (percentages) */
export const SCROLL_DEPTH_MILESTONES = [25, 50, 75, 90, 100] as const;

// ── Three.js / WebGL ──────────────────────────────────────────────────
/** Default device pixel ratio cap for WebGL renderer */
export const WEBGL_DPR_CAP = 1.75;

/** Node count for the structured field background */
export const WEBGL_NODE_COUNT = 520;

/** Maximum link segments for WebGL background */
export const WEBGL_MAX_LINKS = 700;
