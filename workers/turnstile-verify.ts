/**
 * Cloudflare Worker — Turnstile token verification.
 *
 * Deployment:
 *   1. Create a Worker in your Cloudflare dashboard (or use wrangler)
 *   2. Paste this code
 *   3. Add secret: TURNSTILE_SECRET_KEY (from Cloudflare Turnstile dashboard)
 *   4. Set the deployed Worker URL as NEXT_PUBLIC_TURNSTILE_VERIFY_URL
 */

interface Env {
  TURNSTILE_SECRET_KEY: string;
}

const ALLOWED_ORIGINS = [
  'https://realityanchorsltd.com',
  'http://localhost:3000',
];

function corsHeaders(origin: string | null): HeadersInit {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json() as { token?: string };
    if (!body.token) {
      return new Response(JSON.stringify({ success: false, error: 'Missing token' }), {
        status: 400,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }

    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: body.token,
        remoteip: request.headers.get('CF-Connecting-IP') ?? undefined,
      }),
    });

    const result = await verifyResponse.json() as { success: boolean };

    return new Response(JSON.stringify({ success: result.success }), {
      status: result.success ? 200 : 403,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    });
  },
};
