/**
 * Client-side spam/bot detection for lead forms.
 *
 * Three layers:
 * 1. Disposable-email blocklist — blocks throwaway domains used by bots.
 * 2. Timing trap — rejects submissions that happen faster than a human can type.
 * 3. Rate limit — caps submissions per IP-less session via localStorage.
 */

// ── Disposable email domains ────────────────────────────────────────────
// Sorted for binary-search lookup. Covers the domains seen in spam plus
// the most popular throwaway services.
const DISPOSABLE_DOMAINS: ReadonlySet<string> = new Set([
  '10minutemail.com',
  '33mail.com',
  '7novels.com',
  'anonbox.net',
  'armyspy.com',
  'binkmail.com',
  'bobmail.info',
  'bugmenot.com',
  'claramail.com',
  'cslua.com',
  'cuvox.de',
  'dayrep.com',
  'dispostable.com',
  'einrot.com',
  'emailfake.com',
  'emailondeck.com',
  'emailsensei.com',
  'fakeinbox.com',
  'fleckens.hu',
  'getnada.com',
  'grr.la',
  'guerrillamail.com',
  'guerrillamail.de',
  'guerrillamail.info',
  'guerrillamail.net',
  'guerrillamailblock.com',
  'gustr.com',
  'harakirimail.com',
  'jourrapide.com',
  'mailcatch.com',
  'maildrop.cc',
  'mailexpire.com',
  'mailinator.com',
  'mailnesia.com',
  'mailnull.com',
  'mailsac.com',
  'mailtemp.net',
  'mailtothis.com',
  'meltmail.com',
  'mintemail.com',
  'mohmal.com',
  'mytemp.email',
  'mytrashmail.com',
  'nomail.xl.cx',
  'nospam.ze.tc',
  'objectmail.com',
  'ownmail.net',
  'rhyta.com',
  'sharklasers.com',
  'spamfree24.org',
  'spamgourmet.com',
  'superrito.com',
  'teleworm.us',
  'temp-mail.org',
  'tempail.com',
  'tempe4mail.com',
  'tempomail.fr',
  'tempsky.com',
  'throwaway.email',
  'tmpmail.net',
  'trashmail.com',
  'trashmail.me',
  'trashmail.net',
  'trbvm.com',
  'uggsrock.com',
  'wegwerfmail.de',
  'yopmail.com',
  'yopmail.fr',
]);

/**
 * Returns true if the email uses a known disposable/throwaway domain.
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}

// ── Timing trap ─────────────────────────────────────────────────────────
const MINIMUM_FILL_TIME_MS = 3_000; // 3 seconds — no human fills a form this fast

/**
 * Records the time a form was rendered. Call on mount.
 * Returns a token used by `isSubmittedTooFast`.
 */
export function markFormLoaded(): number {
  return Date.now();
}

/**
 * Returns true if the form was submitted faster than a human could fill it.
 */
export function isSubmittedTooFast(loadedAt: number): boolean {
  return Date.now() - loadedAt < MINIMUM_FILL_TIME_MS;
}

// ── Rate limiter ────────────────────────────────────────────────────────
const RATE_LIMIT_KEY = 'ra_lead_submissions';
const MAX_SUBMISSIONS = 3;
const RATE_WINDOW_MS = 60 * 60 * 1_000; // 1 hour

interface SubmissionRecord {
  timestamps: number[];
}

function getSubmissionRecord(): SubmissionRecord {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { timestamps: [] };
    return JSON.parse(raw) as SubmissionRecord;
  } catch {
    return { timestamps: [] };
  }
}

function saveSubmissionRecord(record: SubmissionRecord) {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(record));
  } catch {
    // localStorage may be unavailable (private browsing, quota, etc.)
  }
}

/**
 * Returns true if the visitor has exceeded the submission rate limit.
 */
export function isRateLimited(): boolean {
  const now = Date.now();
  const record = getSubmissionRecord();
  const recent = record.timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  return recent.length >= MAX_SUBMISSIONS;
}

/**
 * Records a successful submission for rate-limiting purposes.
 */
export function recordSubmission(): void {
  const now = Date.now();
  const record = getSubmissionRecord();
  const recent = record.timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  saveSubmissionRecord({ timestamps: recent });
}

// ── Aggregate check ─────────────────────────────────────────────────────

export interface SpamCheckResult {
  blocked: boolean;
  reason: string | null;
}

/**
 * Runs all spam checks. Returns `{ blocked: false }` if clean,
 * or `{ blocked: true, reason }` describing what triggered.
 *
 * The `reason` is user-facing — keep it polite and non-specific so
 * attackers can't easily reverse-engineer the rules.
 */
export function runSpamChecks(email: string, formLoadedAt: number): SpamCheckResult {
  if (isSubmittedTooFast(formLoadedAt)) {
    return { blocked: true, reason: 'Please take a moment before submitting.' };
  }
  if (isDisposableEmail(email)) {
    return { blocked: true, reason: 'Please use a work email address — temporary addresses are not accepted.' };
  }
  if (isRateLimited()) {
    return { blocked: true, reason: 'Too many submissions. Please try again later.' };
  }
  return { blocked: false, reason: null };
}
