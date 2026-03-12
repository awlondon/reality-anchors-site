'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';

const ACCESS_KEY = 'ra_exec_access';
const VALID_CODE = process.env.NEXT_PUBLIC_EXEC_ACCESS_CODE ?? '';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000; // 1 minute lockout after max attempts

/**
 * Simple hash to avoid storing plaintext code in sessionStorage.
 * This is NOT cryptographic security — just mild obfuscation for a client-side gate.
 */
async function hashCode(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function AccessGate({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const locked = Date.now() < lockedUntil;

  // Check session on mount
  useEffect(() => {
    (async () => {
      const stored = sessionStorage.getItem(ACCESS_KEY);
      if (stored) {
        const expected = await hashCode(VALID_CODE);
        if (stored === expected) setAuthorized(true);
      }
      setChecking(false);
    })();
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (!locked) return;
    timerRef.current = setInterval(() => {
      if (Date.now() >= lockedUntil) {
        setAttempts(0);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [locked, lockedUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;

    if (code.trim().toLowerCase() === VALID_CODE) {
      const hashed = await hashCode(VALID_CODE);
      sessionStorage.setItem(ACCESS_KEY, hashed);
      setAuthorized(true);
      setError(false);
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setError(true);
      if (next >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS);
      }
    }
  };

  if (checking) return null;
  if (authorized) return <>{children}</>;

  const remainingSec = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="max-w-sm w-full border border-line bg-card rounded-2xl p-8 text-center">
        <h1 className="text-xl font-semibold text-txt mb-2">Executive Dashboard</h1>
        <p className="text-sm text-muted mb-6">
          Enter the access code to continue.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(false); }}
            placeholder="Access code"
            aria-label="Executive dashboard access code"
            className={`ra-input text-center ${error ? 'border-red-500/60' : ''}`}
            autoFocus
            autoComplete="off"
            disabled={locked}
          />
          {error && !locked && (
            <p className="text-xs text-red-400">
              Invalid access code ({MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts !== 1 ? 's' : ''} remaining)
            </p>
          )}
          {locked && (
            <p className="text-xs text-red-400">
              Too many attempts. Try again in {remainingSec}s.
            </p>
          )}
          <button
            type="submit"
            disabled={locked}
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
