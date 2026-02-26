'use client';

import { useMemo } from 'react';
import type { ExecEvent } from '@/lib/execAnalytics';
import { globalPosterior, sourcePosteriorFromGlobal } from '@/lib/hierBayes';

export type SourcePosterior = {
  mean: number;
  lower: number;
  upper: number;
  exposures: number;
  submits: number;
};

export function computeSourcePosteriors(events: ExecEvent[], trafficSource: string) {
  const allByRegime = new Map<string, { exposures: number; submits: number }>();
  const sourceByRegime = new Map<string, { exposures: number; submits: number }>();

  for (const event of events) {
    if (!event.regimeId) continue;

    const all = allByRegime.get(event.regimeId) ?? { exposures: 0, submits: 0 };
    if (event.type === 'regime_enter') all.exposures += 1;
    if (event.type === 'lead_form_submit') all.submits += 1;
    allByRegime.set(event.regimeId, all);

    if ((event.trafficSource ?? 'unknown') !== trafficSource) continue;
    const src = sourceByRegime.get(event.regimeId) ?? { exposures: 0, submits: 0 };
    if (event.type === 'regime_enter') src.exposures += 1;
    if (event.type === 'lead_form_submit') src.submits += 1;
    sourceByRegime.set(event.regimeId, src);
  }

  const posteriors: Record<string, SourcePosterior> = {};

  for (const [regimeId, globalStats] of Array.from(allByRegime.entries())) {
    const srcStats = sourceByRegime.get(regimeId) ?? { exposures: 0, submits: 0 };
    const g = globalPosterior(globalStats.submits, globalStats.exposures);
    const s = sourcePosteriorFromGlobal(srcStats.submits, srcStats.exposures, g.mean, 30, regimeId);

    posteriors[regimeId] = {
      mean: s.mean,
      lower: s.lower,
      upper: s.upper,
      exposures: srcStats.exposures,
      submits: srcStats.submits,
    };
  }

  return posteriors;
}

export function useSourcePosteriors(events: ExecEvent[], trafficSource: string) {
  return useMemo(() => computeSourcePosteriors(events, trafficSource), [events, trafficSource]);
}
