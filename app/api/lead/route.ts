import { NextRequest, NextResponse } from 'next/server';

const RECIPIENTS = [
  'russell.d.brunner@gmail.com',
  'alexlwlondon@gmail.com',
  'primarydesigncompany@gmail.com',
];

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
}

function asText(value?: string | null) {
  return value?.trim() || 'N/A';
}

function buildLeadEmail(payload: LeadPayload, ipAddress: string | null, userAgent: string | null) {
  const submittedAt = payload.submittedAt ?? new Date().toISOString();

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

  const text = [
    'Reality Anchors - Request Contact Submission',
    '',
    ...fields.map(([key, value]) => `${key}: ${value}`),
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
      </tbody>
    </table>
  `;

  return { text, html, submittedAt };
}

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as LeadPayload | null;
  if (!payload?.name || !payload?.email || !payload?.company || !payload?.role) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.LEAD_FROM_EMAIL ?? 'Reality Anchors <leads@realityanchors.co>';

  if (!resendApiKey) {
    return NextResponse.json({ error: 'missing_email_configuration' }, { status: 500 });
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  const ipAddress = forwardedFor?.split(',')[0]?.trim() ?? null;
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
