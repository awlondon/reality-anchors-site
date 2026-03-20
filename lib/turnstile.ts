/**
 * Client-side helper for Cloudflare Turnstile token verification.
 *
 * Calls the Cloudflare Worker to verify a Turnstile token server-side.
 * Returns true if the token is valid (user is human), false otherwise.
 *
 * If Turnstile is not configured (no NEXT_PUBLIC_TURNSTILE_VERIFY_URL),
 * returns true — making Turnstile opt-in during development.
 */

const VERIFY_TIMEOUT_MS = 5_000;

export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const verifyUrl = process.env.NEXT_PUBLIC_TURNSTILE_VERIFY_URL;
  if (!verifyUrl) return true;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

    const res = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) return false;
    const data = (await res.json()) as { success: boolean };
    return data.success;
  } catch {
    return process.env.NODE_ENV === 'development';
  }
}
