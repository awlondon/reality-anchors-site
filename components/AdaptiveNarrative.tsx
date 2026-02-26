'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import IntentHeatmapOverlay from '@/components/IntentHeatmapOverlay';
import IntentTraceOverlay from '@/components/IntentTraceOverlay';
import RegimeSection from '@/components/RegimeSection';
import RegimeStorySection from '@/components/RegimeStorySection';
import { reorderBySource, reorderRegimes } from '@/lib/narrativeReorder';
import { getSessionId } from '@/lib/session';
import { useHighIntentNotifier } from '@/lib/useHighIntentNotifier';
import { useLiveIntentStream } from '@/lib/useLiveIntentStream';
import { useSessionIntent } from '@/lib/useSessionIntent';
import { useSourcePosteriors } from '@/lib/useSourcePosteriors';
import { useTrafficAttribution } from '@/lib/useTrafficAttribution';
import type { RegimeContent } from '@/types/regime';

type Props = {
  initialRegimes: RegimeContent[];
};

export default function AdaptiveNarrative({ initialRegimes }: Props) {
  const [regimes, setRegimes] = useState(initialRegimes);
  const [seen, setSeen] = useState<string[]>([]);
  const [aggregate, setAggregate] = useState({
    sessionId: getSessionId() ?? 'unknown',
    maxScrollDepth: 0,
    totalDwellMs: 0,
    regimeCount: 0,
    totalCtaClicks: 0,
    totalFormViews: 0,
    totalFormSubmits: 0,
    kpiReveals: 0,
  });
  const [showHeatmap, setShowHeatmap] = useState(false);

  const { trafficSource } = useTrafficAttribution();
  const { events } = useLiveIntentStream();
  const sourcePosteriors = useSourcePosteriors(events, trafficSource);
  const globalPosteriors = useSourcePosteriors(events, 'direct');

  const lastIntent = useRef<'low' | 'emerging' | 'high'>('low');
  const lastReorderAt = useRef(0);

  const { intent } = useSessionIntent(aggregate);

  useHighIntentNotifier(aggregate, seen);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<Record<string, unknown>>;
      const d = custom.detail ?? {};
      if (d.source !== 'funnel_tracker') return;

      setAggregate((prev) => {
        const next = { ...prev };
        if (d.type === 'scroll_depth') next.maxScrollDepth = Math.max(next.maxScrollDepth, Number(d.depthPercent ?? 0));
        if (d.type === 'regime_enter') {
          next.regimeCount += 1;
          if (typeof d.regimeId === 'string') {
            setSeen((curr) => (curr.includes(d.regimeId as string) ? curr : [...curr, d.regimeId as string]));
          }
        }
        if (d.type === 'regime_exit') next.totalDwellMs += Number(d.dwellTimeMs ?? 0);
        if (d.type === 'cta_click') next.totalCtaClicks += 1;
        if (d.type === 'lead_form_view') next.totalFormViews += 1;
        if (d.type === 'lead_form_submit') next.totalFormSubmits += 1;
        if (d.type === 'kpi_reveal') next.kpiReveals += 1;
        return next;
      });
    };

    window.addEventListener('analytics', handler as EventListener);
    return () => window.removeEventListener('analytics', handler as EventListener);
  }, []);

  useEffect(() => {
    const now = Date.now();
    if (lastIntent.current === intent) return;
    if (now - lastReorderAt.current < 3000) return;
    if (aggregate.totalFormViews > 0 || aggregate.totalFormSubmits > 0) return;

    const seenSet = new Set(seen);
    const seenRegimes = regimes.filter((r) => seenSet.has(r.slug));
    const unseenRegimes = regimes.filter((r) => !seenSet.has(r.slug));

    const intentOrdered = reorderRegimes(unseenRegimes, intent);
    const sourceOrdered = reorderBySource(intentOrdered, sourcePosteriors, globalPosteriors, 20);

    setRegimes([...seenRegimes, ...sourceOrdered]);
    lastIntent.current = intent;
    lastReorderAt.current = now;

    window.dispatchEvent(
      new CustomEvent('analytics', {
        detail: {
          type: 'narrative_reorder',
          intent,
          trafficSource,
        },
      })
    );
  }, [aggregate.totalFormSubmits, aggregate.totalFormViews, globalPosteriors, intent, regimes, seen, sourcePosteriors, trafficSource]);

  const rendered = useMemo(() => regimes, [regimes]);

  return (
    <section className="bg-bg">
      <button
        onClick={() => setShowHeatmap((v) => !v)}
        className="fixed bottom-4 right-4 z-50 rounded border border-white/20 bg-black/50 px-3 py-2 text-xs text-white"
      >
        Heatmap
      </button>
      {showHeatmap ? (
        <>
          <IntentHeatmapOverlay />
          <IntentTraceOverlay />
        </>
      ) : null}
      {rendered.map((regime, index) => (
        <RegimeStorySection key={regime.id} id={regime.slug}>
          <RegimeSection
            id={regime.slug}
            title={regime.title}
            subtitle={regime.subtitle}
            imageSrc={regime.imageUrl}
            imageAlt={regime.imageAlt}
            visualTier={regime.visualTier}
            align={regime.align ?? (index % 2 === 0 ? 'left' : 'right')}
            stats={regime.stats}
            ctaHref={regime.ctaHref}
            animationPreset={regime.animationPreset}
          />
        </RegimeStorySection>
      ))}
    </section>
  );
}
