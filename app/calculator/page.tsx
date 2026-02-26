'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { trackEvent } from '@/lib/analytics';

const BASELINES = {
  small_shop: { label: 'Small commercial shop', baseline: 0.08, delta: 0.02 },
  prefab:     { label: 'Prefab yard',            baseline: 0.055, delta: 0.015 },
  industrial: { label: 'Industrial',              baseline: 0.035, delta: 0.01 },
};

type Segment = keyof typeof BASELINES;

function formatUSD(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function formatPct(n: number) {
  return (n * 100).toFixed(1) + '%';
}

function planTier(annual: number): string {
  if (annual <= 15000)  return '$2k–$3k / year';
  if (annual <= 50000)  return '$6k–$9k / year';
  if (annual <= 150000) return '$15k–$25k / year';
  return 'Custom enterprise agreement';
}

interface Results {
  baselineScrap: string;
  deltaScrap: string;
  materialSavings: string;
  laborSavings: string;
  totalSavings: string;
  planTier: string;
  total: number;
}

export default function CalculatorPage() {
  const [tons, setTons] = useState('60');
  const [steelCost, setSteelCost] = useState('900');
  const [segment, setSegment] = useState<Segment>('small_shop');
  const [benches, setBenches] = useState('2');
  const [laborRate, setLaborRate] = useState('85');
  const [hoursSaved, setHoursSaved] = useState('0.10');
  const [showLabor, setShowLabor] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  const calculate = useCallback(() => {
    const t = parseFloat(tons) || 0;
    const sc = parseFloat(steelCost) || 0;
    const lr = parseFloat(laborRate) || 0;
    const hs = parseFloat(hoursSaved) || 0;
    const seg = BASELINES[segment];

    const materialSavings = t * 12 * sc * seg.delta;
    const laborSavings = showLabor ? t * 12 * hs * lr : 0;
    const total = materialSavings + laborSavings;

    setResults({
      baselineScrap: formatPct(seg.baseline),
      deltaScrap: formatPct(seg.delta),
      materialSavings: formatUSD(materialSavings),
      laborSavings: showLabor ? formatUSD(laborSavings) : '—',
      totalSavings: formatUSD(total),
      planTier: planTier(total),
      total,
    });
    trackEvent('calculator_run', { segment, tons: t, steelCost: sc });
  }, [tons, steelCost, segment, laborRate, hoursSaved, showLabor]);

  const reset = () => {
    setTons('60'); setSteelCost('900'); setSegment('small_shop');
    setBenches('2'); setLaborRate('85'); setHoursSaved('0.10');
    setResults(null);
  };

  const inp = 'ra-input';

  return (
    <main className="pt-20">
      <section className="py-16 border-b border-line">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Tools / Calculator</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-txt mb-4 leading-tight">Savings Calculator</h1>
          <p className="text-xl text-muted max-w-2xl leading-relaxed">
            Estimates annual material savings using industry baseline scrap rates by segment — not self-reported scrap — with conservative improvement deltas.
          </p>
          <p className="text-xs text-muted/60 mt-3">v1 front-end estimate tool. Onboarding includes a more detailed workflow and instrumentation plan.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-6">Inputs</h2>
            <form onSubmit={(e) => { e.preventDefault(); calculate(); }} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">Tons / month</span>
                  <input type="number" min="0" step="0.1" value={tons} onChange={(e) => setTons(e.target.value)} className={inp} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">Steel cost / ton (USD)</span>
                  <input type="number" min="0" step="1" value={steelCost} onChange={(e) => setSteelCost(e.target.value)} className={inp} />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">Segment</span>
                  <select value={segment} onChange={(e) => setSegment(e.target.value as Segment)} className={inp}>
                    {Object.entries(BASELINES).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">Benches</span>
                  <input type="number" min="1" step="1" value={benches} onChange={(e) => setBenches(e.target.value)} className={inp} />
                </label>
              </div>

              {/* Labor toggle */}
              <div className="border border-line rounded-xl overflow-hidden">
                <button
                  type="button"
                  className="w-full px-4 py-3 flex items-center justify-between text-sm text-muted hover:text-txt transition-colors"
                  onClick={() => setShowLabor(!showLabor)}
                >
                  <span className="font-semibold">Optional labor estimate</span>
                  <svg className={`w-4 h-4 transition-transform ${showLabor ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showLabor && (
                  <div className="px-4 pb-4 grid grid-cols-2 gap-4 border-t border-line">
                    <label className="flex flex-col gap-1.5 mt-4">
                      <span className="text-xs font-semibold text-muted uppercase tracking-wide">Loaded rate ($/hr)</span>
                      <input type="number" min="0" value={laborRate} onChange={(e) => setLaborRate(e.target.value)} className={inp} />
                    </label>
                    <label className="flex flex-col gap-1.5 mt-4">
                      <span className="text-xs font-semibold text-muted uppercase tracking-wide">Hrs saved / ton</span>
                      <input type="number" min="0" step="0.01" value={hoursSaved} onChange={(e) => setHoursSaved(e.target.value)} className={inp} />
                    </label>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-1">
                <button type="submit" className="flex-1 py-3 rounded-lg bg-accent hover:bg-blue-500 text-white font-semibold text-sm transition-all hover:-translate-y-px">
                  Calculate
                </button>
                <button type="button" onClick={reset} className="px-4 py-3 rounded-lg border border-line hover:border-accent/40 text-muted text-sm font-semibold transition-all">
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Results */}
          <div className="border border-line bg-card rounded-2xl p-7" aria-live="polite">
            <h2 className="text-lg font-semibold text-txt mb-6">Results</h2>
            {results ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Baseline scrap (model)', value: results.baselineScrap },
                    { label: 'Delta scrap (conservative)', value: results.deltaScrap },
                    { label: 'Annual material savings', value: results.materialSavings },
                    { label: 'Annual labor savings', value: results.laborSavings },
                  ].map(({ label, value }) => (
                    <div key={label} className="border border-line rounded-xl p-4">
                      <div className="text-xs text-muted mb-1">{label}</div>
                      <div className="font-mono font-bold text-accent-2">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-line pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted">Predicted annual total</span>
                    <span className="font-mono font-bold text-txt text-lg">{results.totalSavings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Indicative subscription</span>
                    <span className="font-mono text-accent-2 text-sm">{results.planTier}</span>
                  </div>
                </div>

                <p className="text-xs text-muted/70">Subscription typically 10–25% of modeled annual value. Final pricing depends on bench scope, workflow complexity, and instrumentation needs.</p>

                <div className="flex gap-3 mt-1">
                  <Link href="/commercial/#contact" className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold text-center transition-all hover:-translate-y-px">
                    Request quote range
                  </Link>
                  <Link href="/" className="px-4 py-2.5 rounded-lg border border-line hover:border-accent/40 text-muted text-sm font-semibold transition-all">
                    Home
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-muted text-sm">
                Enter your inputs and click Calculate.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Assumptions */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-4">Assumptions used</h2>
            <div className="overflow-x-auto mb-4">
              <table className="ra-table">
                <thead><tr><th>Segment</th><th>Baseline scrap</th><th>Delta scrap</th></tr></thead>
                <tbody>
                  {Object.values(BASELINES).map((b) => (
                    <tr key={b.label}>
                      <td>{b.label}</td>
                      <td className="font-mono text-accent-2">{formatPct(b.baseline)}</td>
                      <td className="font-mono text-txt">{formatPct(b.delta)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted/70">
              Typical modeled delta is generally 1–3 percentage points depending on segment. These assumptions should be refined as you collect anonymized distributions.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
