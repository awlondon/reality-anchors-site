import { NextRequest, NextResponse } from 'next/server';
import { globalPosterior, sourcePosteriorFromGlobal } from '@/lib/hierBayes';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const events = Array.isArray(body?.events) ? body.events : [];

    const agg = new Map<string, Map<string, { n: number; k: number }>>();

    for (const e of events) {
      const regimeId = e?.regimeId;
      const src = e?.trafficSource ?? 'unknown';
      if (!regimeId) continue;

      if (!agg.has(regimeId)) agg.set(regimeId, new Map());
      const bySrc = agg.get(regimeId)!;
      if (!bySrc.has(src)) bySrc.set(src, { n: 0, k: 0 });
      const cell = bySrc.get(src)!;

      if (e.type === 'regime_enter') cell.n += 1;
      if (e.type === 'lead_form_submit') cell.k += 1;
    }

    const result: Record<string, unknown> = {};

    for (const [regimeId, bySrc] of agg.entries()) {
      let N = 0;
      let K = 0;
      for (const { n, k } of bySrc.values()) {
        N += n;
        K += k;
      }

      const global = globalPosterior(K, N, 1, 9);
      const sources: Record<string, unknown> = {};

      for (const [trafficSource, { n, k }] of bySrc.entries()) {
        sources[trafficSource] = sourcePosteriorFromGlobal(k, n, global.mean, 30, regimeId);
      }

      result[regimeId] = { global, sources, exposures: N, submits: K };
    }

    return NextResponse.json({ status: 'ok', posteriors: result });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
