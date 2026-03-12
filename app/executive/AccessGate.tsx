/**
 * AccessGate — UX gate for the Executive Dashboard.
 *
 * NOT a security boundary. This is client-side gating with an audit trail.
 * The access code prevents casual drive-by access; it does not protect secrets.
 *
 * ── Monthly Code Rotation Procedure ──────────────────────────────────────
 * 1. Generate a new access code (any short alphanumeric string).
 * 2. Set the NEXT_PUBLIC_EXEC_ACCESS_CODE env var in Vercel / .env.local.
 * 3. Redeploy the site so the new code is inlined at build time.
 * 4. Distribute the new code to authorised stakeholders.
 * 5. Old sessions using sessionStorage will be invalidated on next visit
 *    because the stored value will no longer match the new VALID_CODE.
 * ─────────────────────────────────────────────────────────────────────────
 */
'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';

/* ── Constants ─────────────────────────────────────────────────────────── */
const ACCESS_KEY = 'ra_exec_access';
const VALID_CODE = process.env.NEXT_PUBLIC_EXEC_ACCESS_CODE ?? 'ra2026';

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const LOCKOUT_TS_KEY = 'ra_exec_lockout';
const ATTEMPTS_KEY = 'ra_exec_attempts';

/* ── Helpers ───────────────────────────────────────────────────────────── */

/** djb2 hash — simple, non-cryptographic. Used to avoid storing plaintext codes in logs. */
function djb2Hash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0; // hash * 33 + c
  }
  return (hash >>> 0).toString(16); // unsigned hex string
}

/** Best-effort audit log to Firestore. Never blocks the auth UX. */
async function logAccessAttempt(entry: {
  success: boolean;
  codeHash: string;
  lockedOut: boolean;
}) {
  try {
    const { db, isFirebaseConfigured } = await import('@/lib/firebaseClient');
    if (!db || !isFirebaseConfigured) return;

    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    await addDoc(collection(db, 'executive_access_log'), {
      timestamp: serverTimestamp(),
      success: entry.success,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      codeHash: entry.codeHash,
      lockedOut: entry.lockedOut,
    });
  } catch {
    // Best-effort — silently ignore Firestore failures
  }
}

/** Read the current attempt count from localStorage. */
function getAttemptCount(): number {
  const raw = localStorage.getItem(ATTEMPTS_KEY);
  return raw ? parseInt(raw, 10) || 0 : 0;
}

/** Read the lockout timestamp from localStorage. Returns 0 if none set. */
function getLockoutTimestamp(): number {
  const raw = localStorage.getItem(LOCKOUT_TS_KEY);
  return raw ? parseInt(raw, 10) || 0 : 0;
}

/* ── Component ─────────────────────────────────────────────────────────── */

export default function AccessGate({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);
  const [lockedOut, setLockedOut] = useState(false);
  const [remainingMs, setRemainingMs] = useState(0);

  // Check sessionStorage on mount + restore lockout state
  useEffect(() => {
    const stored = sessionStorage.getItem(ACCESS_KEY);
    if (stored === VALID_CODE) {
      setAuthorized(true);
    }

    // Check existing lockout
    const lockoutTs = getLockoutTimestamp();
    if (lockoutTs) {
      const remaining = lockoutTs + LOCKOUT_DURATION_MS - Date.now();
      if (remaining > 0) {
        setLockedOut(true);
        setRemainingMs(remaining);
      } else {
        // Lockout expired — clean up
        localStorage.removeItem(LOCKOUT_TS_KEY);
        localStorage.removeItem(ATTEMPTS_KEY);
      }
    }

    setChecking(false);
  }, []);

  // Countdown timer during lockout
  useEffect(() => {
    if (!lockedOut) return;

    const interval = setInterval(() => {
      const lockoutTs = getLockoutTimestamp();
      const remaining = lockoutTs + LOCKOUT_DURATION_MS - Date.now();
      if (remaining <= 0) {
        setLockedOut(false);
        setRemainingMs(0);
        localStorage.removeItem(LOCKOUT_TS_KEY);
        localStorage.removeItem(ATTEMPTS_KEY);
        clearInterval(interval);
      } else {
        setRemainingMs(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockedOut]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (lockedOut) return;

      const trimmed = code.trim().toLowerCase();
      const codeHash = djb2Hash(trimmed);
      const success = trimmed === VALID_CODE;

      if (success) {
        sessionStorage.setItem(ACCESS_KEY, VALID_CODE);
        setAuthorized(true);
        setError(false);
        localStorage.removeItem(ATTEMPTS_KEY);
        localStorage.removeItem(LOCKOUT_TS_KEY);
        // Fire-and-forget audit log
        logAccessAttempt({ success: true, codeHash, lockedOut: false });
      } else {
        const newCount = getAttemptCount() + 1;
        localStorage.setItem(ATTEMPTS_KEY, String(newCount));

        if (newCount >= MAX_ATTEMPTS) {
          const now = Date.now();
          localStorage.setItem(LOCKOUT_TS_KEY, String(now));
          setLockedOut(true);
          setRemainingMs(LOCKOUT_DURATION_MS);
          setError(false);
          logAccessAttempt({ success: false, codeHash, lockedOut: true });
        } else {
          setError(true);
          logAccessAttempt({ success: false, codeHash, lockedOut: false });
        }
      }
    },
    [code, lockedOut],
  );

  if (checking) return null;
  if (authorized) return <>{children}</>;

  const lockoutMinutes = Math.ceil(remainingMs / 60_000);

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="max-w-sm w-full border border-line bg-card rounded-2xl p-8 text-center">
        <h1 className="text-xl font-semibold text-txt mb-2">Executive Dashboard</h1>
        <p className="text-sm text-muted mb-6">Enter the access code to continue.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            placeholder="Access code"
            aria-label="Executive dashboard access code"
            className={`ra-input text-center ${error ? 'border-red-500/60' : ''}`}
            autoFocus
            autoComplete="off"
            disabled={lockedOut}
          />
          {error && <p className="text-xs text-red-400">Invalid access code</p>}
          {lockedOut && (
            <p className="text-xs text-red-400">
              Too many failed attempts. Try again in {lockoutMinutes} minute
              {lockoutMinutes !== 1 ? 's' : ''}.
            </p>
          )}
          <button
            type="submit"
            disabled={lockedOut}
            className="w-full py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </form>
        <p className="text-xs text-muted/50 mt-4">
          Contact your account representative for access.
        </p>
      </div>
    </main>
  );
}
