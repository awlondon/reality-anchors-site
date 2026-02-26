import { NextRequest, NextResponse } from 'next/server';
import { computeRegimeWeight } from '@/lib/regimeOptimizer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const events = Array.isArray(body?.events) ? body.events : [];

    const byRegime: Record<string, { exposures: number; dwellTotal: number; dwellCount: number; ctaClicks: number; submits: number; highIntentSessions: number; }> = {};

    for (const e of events) {
      if (!e?.regimeId) continue;
      if (!byRegime[e.regimeId]) {
        byRegime[e.regimeId] = { exposures: 0, dwellTotal: 0, dwellCount: 0, ctaClicks: 0, submits: 0, highIntentSessions: 0 };
      }
      const r = byRegime[e.regimeId];
      if (e.type === 'regime_enter') r.exposures += 1;
      if (e.type === 'cta_click') r.ctaClicks += 1;
      if (e.type === 'lead_form_submit') r.submits += 1;
      if (e.type === 'high_intent' || (e.type === 'sales_notification' && e.notificationType === 'high_intent')) r.highIntentSessions += 1;
      if (e.type === 'regime_exit') {
        r.dwellTotal += Number(e.dwellTimeMs ?? 0);
        r.dwellCount += 1;
      }
    }

    const weights = Object.entries(byRegime).map(([regimeId, r]) => {
      const avgDwellMs = r.dwellCount > 0 ? r.dwellTotal / r.dwellCount : 0;
      return {
        regimeId,
        weight: computeRegimeWeight({
          regimeId,
          exposures: r.exposures,
          avgDwellMs,
          ctaClicks: r.ctaClicks,
          submits: r.submits,
          highIntentSessions: r.highIntentSessions,
        }),
      };
    });

    return NextResponse.json({ status: 'ok', weights });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
