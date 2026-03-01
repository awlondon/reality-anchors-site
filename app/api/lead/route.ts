import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// In-memory rate limiter — max 5 submissions per IP per 60 seconds.
//
// Limitations of this approach:
//   - State resets on every cold start / server restart.
//   - Does NOT protect against distributed spam across multiple serverless
//     instances (each instance has its own Map).
//
// To upgrade to persistent, cross-instance rate limiting:
//   1. Install @upstash/ratelimit and @upstash/redis:
//        npm i @upstash/ratelimit @upstash/redis
//   2. Replace this block with:
//        import { Ratelimit } from '@upstash/ratelimit';
//        import { Redis } from '@upstash/redis';
//        const ratelimit = new Ratelimit({
//          redis: Redis.fromEnv(),
//          limiter: Ratelimit.slidingWindow(5, '60 s'),
//        });
//      Then call: const { success } = await ratelimit.limit(ip);
//   3. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to env vars.
// ---------------------------------------------------------------------------
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 5;
// Periodic sweep interval prevents unbounded map growth under sustained traffic.
const CLEANUP_INTERVAL_MS = 5 * 60_000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Remove entries whose window has already expired.
function sweepExpiredEntries() {
  const now = Date.now();
  for (const [ip, entry] of Array.from(rateLimitMap.entries())) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}

// Run cleanup on a timer so long-running server processes don't accumulate stale keys.
if (typeof setInterval !== 'undefined') {
  setInterval(sweepExpiredEntries, CLEANUP_INTERVAL_MS);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX_REQUESTS;
}

const RECIPIENTS = [
  'russell.d.brunner@gmail.com',
  'alexlwlondon@gmail.com',
  'primarydesigncompany@gmail.com',
];

interface CalculatorContext {
  annualTons?: number;
  scrapRatePct?: number;
  costPerTon?: number;
  estimatedEbitda?: number;
  estimatedMaterialSavings?: number;
  estimatedTonsSaved?: number;
}

interface LeadPayload {
  name: string;
  email: string;
  company: string;
  role: string;
  message?: string;
  sessionId?: string;
  regimeId?: string | null;
  source?: string;
  submittedAt?: string;
  /** Honeypot — must be empty; bots that auto-fill fields will populate this */
  _hp?: string;
  /** Calculator state captured from /calculator before form submission */
  calculatorContext?: CalculatorContext;
}

function asText(value?: string | null) {
  return value?.trim() || 'N/A';
}

function fmtUSD(value?: number) {
  if (value == null || !Number.isFinite(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function buildLeadEmail(payload: LeadPayload, ipAddress: string | null, userAgent: string | null) {
  const submittedAt = payload.submittedAt ?? new Date().toISOString();
  const ctx = payload.calculatorContext;

  const fields = [
    ['Name', asText(payload.name)],
    ['Email', asText(payload.email)],
    ['Company', asText(payload.company)],
    ['Role', asText(payload.role)],
    ['Message', asText(payload.message)],
    ['Session ID', asText(payload.sessionId)],
    ['Regime ID', asText(payload.regimeId)],
    ['Source', asText(payload.source ?? 'request_contact_form')],
    ['Submitted At', asText(submittedAt)],
    ['IP Address', asText(ipAddress)],
    ['User Agent', asText(userAgent)],
  ];

  const calcFields: [string, string][] = ctx ? [
    ['Calculator — Annual Tonnage', ctx.annualTons != null ? `${ctx.annualTons.toLocaleString()} t` : 'N/A'],
    ['Calculator — Scrap Rate', ctx.scrapRatePct != null ? `${ctx.scrapRatePct.toFixed(1)}%` : 'N/A'],
    ['Calculator — Cost per Ton', fmtUSD(ctx.costPerTon)],
    ['Calculator — Est. Material Savings', fmtUSD(ctx.estimatedMaterialSavings)],
    ['Calculator — Est. Total EBITDA Impact', fmtUSD(ctx.estimatedEbitda)],
  ] : [];

  const text = [
    'Reality Anchors - Request Contact Submission',
    '',
    ...fields.map(([key, value]) => `${key}: ${value}`),
    ...(calcFields.length ? ['', '— Calculator Context —', ...calcFields.map(([key, value]) => `${key}: ${value}`)] : []),
  ].join('\n');

  const html = `
    <h2>Reality Anchors - Request Contact Submission</h2>
    <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; font-family: Arial, sans-serif;">
      <tbody>
        ${fields
          .map(
            ([key, value]) =>
              `<tr><th align="left" style="background:#f5f5f5;">${key}</th><td>${value}</td></tr>`
          )
          .join('')}
        ${calcFields.length ? `
        <tr><th colspan="2" align="left" style="background:#eff6ff; color:#1d4ed8;">Calculator Context (from /calculator)</th></tr>
        ${calcFields.map(([key, value]) => `<tr><th align="left" style="background:#f5f5f5;">${key}</th><td><strong>${value}</strong></td></tr>`).join('')}
        ` : ''}
      </tbody>
    </table>
  `;

  return { text, html, submittedAt };
}

export async function POST(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ipAddress = forwardedFor?.split(',')[0]?.trim() ?? 'unknown';

  if (isRateLimited(ipAddress)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const payload = (await request.json().catch(() => null)) as LeadPayload | null;
  if (!payload?.name || !payload?.email || !payload?.company || !payload?.role) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  // Reject if honeypot field is filled (bot behaviour)
  if (payload._hp) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.LEAD_FROM_EMAIL ?? 'Reality Anchors <leads@realityanchors.co>';

  if (!resendApiKey) {
    return NextResponse.json({ error: 'missing_email_configuration' }, { status: 500 });
  }

  const userAgent = request.headers.get('user-agent');
  const { text, html, submittedAt } = buildLeadEmail(payload, ipAddress, userAgent);

  let resendResponse: Response;
  try {
    resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        from: fromEmail,
        to: RECIPIENTS,
        reply_to: payload.email,
        subject: `New Request Contact submission from ${payload.company}`,
        text,
        html,
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ error: 'email_request_failed', details: message }, { status: 502 });
  }

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text().catch(() => 'unknown_error');
    return NextResponse.json({ error: 'email_send_failed', details: errorText }, { status: 502 });
  }

  return NextResponse.json({ ok: true, recipients: RECIPIENTS, submittedAt });
}


export async function GET() {
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
