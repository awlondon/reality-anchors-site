'use client';

import { useEffect, useRef, useState } from 'react';
import { formatPct, formatUSD } from '@/lib/marginModel';
import AcronymHint from './AcronymHint';
import EbitdaCompositionChart from '@/components/charts/EbitdaCompositionChart';

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
  const annualEbitdaRef = useRef<HTMLDivElement | null>(null);
  const [isAnnualEbitdaVisible, setIsAnnualEbitdaVisible] = useState(false);

  useEffect(() => {
    const element = annualEbitdaRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAnnualEbitdaVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="bg-neutral-900 text-white rounded-xl p-8 space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-6">
          Annual <AcronymHint acronym="EBITDA" caption="Earnings Before Interest, Taxes, Depreciation, and Amortization" /> Impact
        </h2>
        <div className="grid md:grid-cols-4 gap-6 text-sm">
          <ResultCard title="Material Savings" value={formatUSD(results.material.dollarsSaved)} />
          <ResultCard title="Labor Savings" value={formatUSD(results.labor.dollarsSaved)} />
          <ResultCard title="Throughput Contribution" value={formatUSD(results.throughput.ebitdaContribution)} />
          <ResultCard title="Oversight / Risk" value={formatUSD(results.oversightRisk.dollarsSaved)} />
        </div>
      </div>

      <EbitdaCompositionChart
        ariaLabel="EBITDA impact composition breakdown"
        segments={[
          { label: 'Material', value: results.material.dollarsSaved, color: '#2e7deb' },
          { label: 'Labor', value: results.labor.dollarsSaved, color: '#6fb0ff' },
          { label: 'Throughput', value: results.throughput.ebitdaContribution, color: '#38E18E' },
          { label: 'Oversight', value: results.oversightRisk.dollarsSaved, color: '#f59e0b' },
        ]}
        total={results.totals.annualEbitdaIncrease}
      />

      <div
        ref={annualEbitdaRef}
        className={`border-t border-neutral-700 pt-6 transition-all duration-500 ease-out ${
          isAnnualEbitdaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
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
