'use client';

import { formatPct, formatUSD } from '@/lib/marginModel';

type Results = any;

function ResultCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md border border-neutral-700 p-4">
      <div className="text-neutral-400 text-xs mb-1">{title}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}

export default function ResultPanel({ results }: { results: Results }) {
  return (
    <section className="bg-neutral-900 text-white rounded-xl p-8 space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-6">Annual EBITDA Impact</h2>
        <div className="grid md:grid-cols-4 gap-6 text-sm">
          <ResultCard title="Material Savings" value={formatUSD(results.material.dollarsSaved)} />
          <ResultCard title="Labor Savings" value={formatUSD(results.labor.dollarsSaved)} />
          <ResultCard title="Throughput Contribution" value={formatUSD(results.throughput.ebitdaContribution)} />
          <ResultCard title="Oversight / Risk" value={formatUSD(results.oversightRisk.dollarsSaved)} />
        </div>
      </div>

      <div className="border-t border-neutral-700 pt-6">
        <div className="text-3xl font-semibold">{formatUSD(results.totals.annualEbitdaIncrease)}</div>
        <div className="text-neutral-400 mt-2">
          EBITDA Margin Improvement: +{formatPct(results.totals.ebitdaMarginImprovementPct)}
        </div>
      </div>

      <div className="border-t border-neutral-700 pt-6 text-sm text-neutral-300">
        <div className="font-medium mb-3">Execution Infrastructure Investment Range</div>
        <div className="flex justify-between"><span>Low Friction</span><span>{formatUSD(results.pricing.lowFrictionAnnual)} / year</span></div>
        <div className="flex justify-between"><span>Base</span><span>{formatUSD(results.pricing.baseAnnual)} / year</span></div>
        <div className="flex justify-between"><span>Full Deployment</span><span>{formatUSD(results.pricing.aggressiveAnnual)} / year</span></div>
      </div>
    </section>
  );
}
