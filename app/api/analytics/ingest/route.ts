import { NextRequest, NextResponse } from 'next/server';

const seen = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.eventId || !body.type || !body.timestamp) {
      return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
    }

    if (seen.has(body.eventId)) {
      return NextResponse.json({ status: 'duplicate' });
    }

    seen.add(body.eventId);

    return NextResponse.json({ status: 'ok' });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
