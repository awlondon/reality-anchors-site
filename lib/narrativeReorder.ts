import type { IntentState } from '@/lib/conversionModel';
import type { SourcePosterior } from '@/lib/useSourcePosteriors';

type RegimeLike = { slug: string };

export function reorderRegimes<T extends RegimeLike>(regimes: T[], intent: IntentState) {
  const map = new Map(regimes.map((r) => [r.slug, r]));

  const sequences: Record<IntentState, string[]> = {
    low: [
      'structural-fabrication',
      'multi-project-optimization',
      'machine-calibration',
      'fleet-grip',
      'ar-execution',
      'ai-governance',
    ],
    emerging: [
      'multi-project-optimization',
      'structural-fabrication',
      'ai-governance',
      'machine-calibration',
      'ar-execution',
      'fleet-grip',
    ],
    high: [
      'ai-governance',
      'structural-fabrication',
      'machine-calibration',
      'multi-project-optimization',
      'ar-execution',
      'fleet-grip',
    ],
  };

  const order = sequences[intent];
  const ordered = order.map((slug) => map.get(slug)).filter(Boolean) as T[];
  const remaining = regimes.filter((r) => !order.includes(r.slug));
  return [...ordered, ...remaining];
}

export function reorderBySource<T extends RegimeLike>(
  regimes: T[],
  sourcePosteriors: Record<string, SourcePosterior>,
  globalPosteriors: Record<string, SourcePosterior>,
  minExposure = 20
) {
  return [...regimes].sort((a, b) => {
    const sa = sourcePosteriors[a.slug];
    const sb = sourcePosteriors[b.slug];
    const ga = globalPosteriors[a.slug];
    const gb = globalPosteriors[b.slug];

    const wa = sa && sa.exposures >= minExposure ? sa.upper : ga?.mean ?? 0;
    const wb = sb && sb.exposures >= minExposure ? sb.upper : gb?.mean ?? 0;

    return wb - wa;
  });
}
