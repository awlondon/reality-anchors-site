'use client';

import { useMemo, useState } from 'react';
import ExecutiveAnalyticsProvider from '@/components/ExecutiveAnalyticsProvider';
import { computeConversionScore } from '@/lib/conversionModel';
import { HOME_EXPERIMENT } from '@/lib/experiments/config';
import type { VariantId } from '@/lib/experiments/types';
import type { ExecRegimeStats } from '@/lib/execAnalytics';
import { summarizeByVariant } from '@/lib/execVariantSummary';
import { computeSourcePosteriors } from '@/lib/useSourcePosteriors';
import { useExperimentSwitchboard } from '@/lib/useExperimentSwitchboard';
import SalesAlertBanner from '@/components/SalesAlertBanner';
import { useLiveSalesAlerts } from '@/lib/useLiveSalesAlerts';

function msToS(ms: number) {
  return (ms / 1000).toFixed(1);
}

function fmtTime(ts: number) {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export default function ExecutiveDashboard() {
  const [minScore, setMinScore] = useState(0);
  const [trafficSource, setTrafficSource] = useState('all');
  const { config, update } = useExperimentSwitchboard(HOME_EXPERIMENT);
  const { alerts, acknowledge } = useLiveSalesAlerts();

  return (
    <ExecutiveAnalyticsProvider>
      {({ events, summary, sessions, reset }) => {
        const filteredRegimes = useMemo(
          () => summary.regimes.filter((r) => r.engagementScore >= minScore),
          [summary.regimes, minScore]
        );

        const scoredSessions = useMemo(
          () => sessions.map((s) => ({ ...s, ...computeConversionScore(s) })).sort((a, b) => b.scorePercent - a.scorePercent),
          [sessions]
        );

        const variantSummary = useMemo(() => summarizeByVariant(events, config.id), [events, config.id]);
        const variantA = variantSummary.find((v) => v.variant === 'A');
        const variantB = variantSummary.find((v) => v.variant === 'B');
        const lift = variantA && variantB ? variantB.submitRate - variantA.submitRate : null;

        const highIntentCount = scoredSessions.filter((s) => s.scorePercent > 70).length;

        const sources = Array.from(new Set(events.map((e) => e.trafficSource).filter(Boolean))) as string[];
        const selectedEvents = trafficSource === 'all' ? events : events.filter((e) => e.trafficSource === trafficSource);
        const selectedPosteriors = computeSourcePosteriors(selectedEvents, trafficSource === 'all' ? 'direct' : trafficSource);
        const globalPosteriors = computeSourcePosteriors(events, 'direct');

        return (
          <>
            <SalesAlertBanner alerts={alerts} onDismiss={acknowledge} />
            <div className="min-h-screen bg-[#0b1220] px-6 py-10 text-white md:px-10">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Executive Engagement</h1>
                <p className="mt-2 text-sm text-white/60">Live scroll + funnel attribution from storytelling events.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white/60">Min score</span>
                  <input type="range" min={0} max={1} step={0.05} value={minScore} onChange={(e) => setMinScore(parseFloat(e.target.value))} />
                  <span className="w-10 text-right tabular-nums">{Math.round(minScore * 100)}%</span>
                </div>
                <select value={trafficSource} onChange={(e) => setTrafficSource(e.target.value)} className="rounded border border-white/20 bg-transparent px-2 py-1 text-xs">
                  <option value="all">all sources</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
                <button onClick={reset} className="rounded-lg border border-white/15 px-3 py-2 text-sm transition hover:border-white/30">Reset</button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-8">
              <Kpi label="Events" value={summary.totalEvents.toLocaleString()} />
              <Kpi label="Regimes seen" value={summary.uniqueRegimes.toString()} />
              <Kpi label="Max depth" value={`${summary.maxScrollDepth}%`} />
              <Kpi label="CTA clicks" value={summary.totalCtaClicks.toString()} />
              <Kpi label="Form views" value={summary.totalFormViews.toString()} />
              <Kpi label="Form submits" value={summary.totalFormSubmits.toString()} />
              <Kpi label="High-intent" value={highIntentCount.toString()} />
              <Kpi label="Reorders" value={summary.totalReorders.toString()} />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Panel title="Timeline (per minute)">
                <div className="space-y-2 text-xs text-white/70">
                  {summary.timeline.slice(-12).map((t) => (
                    <div key={t.t} className="grid grid-cols-4 gap-3 rounded border border-white/10 bg-white/5 px-3 py-2">
                      <span>{fmtTime(t.t)}</span>
                      <span>Depth {t.maxDepth}%</span>
                      <span>CTA {t.ctaClicks}</span>
                      <span>Submits {t.formSubmits}</span>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Session conversion probability">
                <div className="max-h-[360px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-white/60">
                      <tr className="border-b border-white/10">
                        <th className="py-2 pr-4">Session</th>
                        <th className="py-2 pr-4">Prob.</th>
                        <th className="py-2 pr-4">Depth</th>
                        <th className="py-2 pr-4">Dwell</th>
                        <th className="py-2 pr-4">CTA</th>
                        <th className="py-2 pr-4">Submits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scoredSessions.map((s) => (
                        <tr key={s.sessionId} className="border-b border-white/5">
                          <td className="py-2 pr-4 text-xs tabular-nums">{s.sessionId.slice(0, 8)}</td>
                          <td className="py-2 pr-4 tabular-nums">{s.scorePercent}%</td>
                          <td className="py-2 pr-4 tabular-nums">{s.maxScrollDepth}%</td>
                          <td className="py-2 pr-4 tabular-nums">{msToS(s.totalDwellMs)}s</td>
                          <td className="py-2 pr-4 tabular-nums">{s.totalCtaClicks}</td>
                          <td className="py-2 pr-4 tabular-nums">{s.totalFormSubmits}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Panel title="Experiment: Narrative Variant Performance">
                {lift !== null ? (
                  <p className="mb-3 text-xs text-white/60">Submit rate lift (B vs A): {(lift * 100).toFixed(2)}%</p>
                ) : null}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-white/60">
                      <tr className="border-b border-white/10">
                        <th className="py-3 pr-4">Variant</th>
                        <th className="py-3 pr-4">Exposures</th>
                        <th className="py-3 pr-4">CTA Rate</th>
                        <th className="py-3 pr-4">Submit Rate</th>
                        <th className="py-3 pr-4">Avg Dwell (s)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variantSummary.map((v) => (
                        <tr key={v.variant} className="border-b border-white/5">
                          <td className="py-3 pr-4 font-medium">{v.variant}</td>
                          <td className="py-3 pr-4 tabular-nums">{v.exposures}</td>
                          <td className="py-3 pr-4 tabular-nums">{(v.ctaRate * 100).toFixed(1)}%</td>
                          <td className="py-3 pr-4 tabular-nums">{(v.submitRate * 100).toFixed(1)}%</td>
                          <td className="py-3 pr-4 tabular-nums">{v.avgDwellSecPerSession.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>

              <Panel title="Experiment Switchboard">
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Enabled</span>
                    <button
                      onClick={() => update({ ...config, isEnabled: !config.isEnabled })}
                      className="rounded border border-white/20 px-3 py-1 text-xs"
                    >
                      {config.isEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>

                  {(Object.keys(config.traffic) as VariantId[]).map((variant) => (
                    <label key={variant} className="block">
                      <div className="mb-1 text-xs text-white/70">{variant}: {(config.traffic[variant] * 100).toFixed(0)}%</div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={config.traffic[variant]}
                        onChange={(e) => {
                          const next = parseFloat(e.target.value);
                          const otherVariants = (Object.keys(config.traffic) as VariantId[]).filter((v) => v !== variant);
                          const remaining = Math.max(0, 1 - next);
                          const split = otherVariants.length > 0 ? remaining / otherVariants.length : 0;
                          const traffic = { ...config.traffic, [variant]: next };
                          for (const ov of otherVariants) traffic[ov] = split;
                          update({ ...config, traffic });
                        }}
                      />
                    </label>
                  ))}
                </div>
              </Panel>
            </div>


            <div className="mt-10">
              <Panel title="Bayesian ranking by traffic source">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-white/60">
                      <tr className="border-b border-white/10">
                        <th className="py-3 pr-4">Regime</th>
                        <th className="py-3 pr-4">Mean</th>
                        <th className="py-3 pr-4">95% CI</th>
                        <th className="py-3 pr-4">Exposures</th>
                        <th className="py-3 pr-4">Lift vs global</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(selectedPosteriors)
                        .sort(([, a], [, b]) => b.mean - a.mean)
                        .map(([regimeId, posterior]) => {
                          const global = globalPosteriors[regimeId];
                          const liftValue = posterior.mean - (global?.mean ?? 0);
                          return (
                            <tr key={regimeId} className="border-b border-white/5">
                              <td className="py-3 pr-4 font-medium">{regimeId}</td>
                              <td className="py-3 pr-4 tabular-nums">{(posterior.mean * 100).toFixed(1)}%</td>
                              <td className="py-3 pr-4 tabular-nums">[{(posterior.lower * 100).toFixed(1)} – {(posterior.upper * 100).toFixed(1)}]</td>
                              <td className="py-3 pr-4 tabular-nums">{posterior.exposures}</td>
                              <td className={`py-3 pr-4 tabular-nums ${liftValue >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                                {(liftValue * 100).toFixed(2)}%
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </div>

            <div className="mt-10">
              <Panel title="Regime ranking">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-white/60">
                      <tr className="border-b border-white/10">
                        <th className="py-3 pr-4">Regime</th>
                        <th className="py-3 pr-4">Score</th>
                        <th className="py-3 pr-4">Avg dwell</th>
                        <th className="py-3 pr-4">Enters</th>
                        <th className="py-3 pr-4">CTA</th>
                        <th className="py-3 pr-4">Form views</th>
                        <th className="py-3 pr-4">Submits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegimes.map((r: ExecRegimeStats) => (
                        <tr key={r.regimeId} className="border-b border-white/5">
                          <td className="py-3 pr-4 font-medium">{r.regimeId}</td>
                          <td className="py-3 pr-4 tabular-nums">{Math.round(r.engagementScore * 100)}%</td>
                          <td className="py-3 pr-4 tabular-nums">{msToS(r.avgDwellMs)}s</td>
                          <td className="py-3 pr-4 tabular-nums">{r.enters}</td>
                          <td className="py-3 pr-4 tabular-nums">{r.ctaClicks}</td>
                          <td className="py-3 pr-4 tabular-nums">{r.formViews}</td>
                          <td className="py-3 pr-4 tabular-nums">{r.formSubmits}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </div>
            </div>
          </>
        );
      }}
    </ExecutiveAnalyticsProvider>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1b33] p-5">
      <h2 className="text-sm font-semibold tracking-wide text-white/90">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1b33] p-4">
      <div className="text-xs uppercase tracking-wide text-white/60">{label}</div>
      <div className="mt-2 text-xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
