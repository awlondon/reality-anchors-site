'use client';

import { useState, useEffect, type ReactNode } from 'react';

const ACCESS_KEY = 'ra_exec_access';
const VALID_CODE = 'ra2026'; // Simple gate — not a security boundary

export default function AccessGate({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(ACCESS_KEY);
    if (stored === VALID_CODE) setAuthorized(true);
    setChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().toLowerCase() === VALID_CODE) {
      sessionStorage.setItem(ACCESS_KEY, VALID_CODE);
      setAuthorized(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (checking) return null;
  if (authorized) return <>{children}</>;

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="max-w-sm w-full border border-line bg-card rounded-2xl p-8 text-center">
        <h1 className="text-xl font-semibold text-txt mb-2">Executive Dashboard</h1>
        <p className="text-sm text-muted mb-6">
          Enter the access code to continue.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(false); }}
            placeholder="Access code"
            className={`ra-input text-center ${error ? 'border-red-500/60' : ''}`}
            autoFocus
            autoComplete="off"
          />
          {error && <p className="text-xs text-red-400">Invalid access code</p>}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all"
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
