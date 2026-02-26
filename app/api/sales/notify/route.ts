import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const webhookUrl = process.env.SALES_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json({ error: 'missing_webhook' }, { status: 500 });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'upstream_failed' }, { status: 502 });
    }

    return NextResponse.json({ status: 'sent' });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
