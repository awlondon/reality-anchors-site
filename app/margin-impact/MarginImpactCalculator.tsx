'use client';

import { useEffect, useRef, useState } from 'react';
import { computeMarginImpact } from '@/lib/marginModel';
import InputSection from './InputSection';
import ResultPanel from './ResultPanel';
import EnterpriseRollup from './EnterpriseRollup';
import AcronymHint from './AcronymHint';

const defaultInputs = {
  annualTonsProcessed: 25000,
  avgMaterialCostPerTon: 850,
  annualFabricationRevenue: 40000000,
  annualFabricationLaborCost: 6000000,
  incrementalContributionMarginPct: 20,
  currentScrapRatePct: 8,
  targetScrapRatePct: 6.5,
  preventableReworkLaborPct: 4,
  reworkReductionPct: 40,
  throughputImprovementPct: 2,
  includeOversightRisk: true,
  annualQALaborCost: 500000,
  annualMajorErrorCost: 250000,
  errorReductionPct: 30,
};

const REVEAL_DURATION_MS = 2500;

export default function MarginImpactCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState<any>(null);
  const [showAnnualImpact, setShowAnnualImpact] = useState(false);
  const [error, setError] = useState('');
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!results || !resultsRef.current) return;

    setShowAnnualImpact(false);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startY = window.scrollY;
    const targetY = Math.max(
      0,
      resultsRef.current.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35,
    );

    if (reduceMotion) {
      window.scrollTo({ top: targetY, behavior: 'auto' });
      setShowAnnualImpact(true);
      return;
    }

    const revealTimer = window.setTimeout(() => {
      setShowAnnualImpact(true);
    }, 0);

    let animationFrame = 0;
    const startTime = performance.now();

    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const animateScroll = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / REVEAL_DURATION_MS, 1);
      const easedProgress = easeInOutCubic(progress);
      const nextY = startY + (targetY - startY) * easedProgress;
      window.scrollTo(0, nextY);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animateScroll);
      } else {
        setShowAnnualImpact(true);
      }
    };

    animationFrame = window.requestAnimationFrame(animateScroll);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(revealTimer);
    };
  }, [results]);

  function handleCalculate() {
    try {
      setResults(computeMarginImpact(inputs));
      setError('');
    } catch (e: any) {
      setError(e?.message || 'Unable to compute model.');
      setResults(null);
    }
  }

  return (
    <div className="space-y-12">
      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-medium">Execution errors quietly erode margin.</h2>
            <p className="mt-2 text-sm text-neutral-600">This model estimates <AcronymHint acronym="EBITDA" caption="Earnings Before Interest, Taxes, Depreciation, and Amortization" /> impact from material efficiency, labor efficiency, throughput capacity, and oversight risk reduction.</p>
          </div>
          <div className="rounded-lg border border-neutral-200 p-4 text-sm min-w-56">
            <div className="text-neutral-500">Signal</div>
            <div className="font-semibold mt-1">A 1% scrap shift can materially impact EBITDA.</div>
          </div>
        </div>
      </section>

      <InputSection inputs={inputs} setInputs={setInputs} />

      <div className="flex justify-center">
        <button onClick={handleCalculate} className="bg-black text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-neutral-800 transition">
          Calculate Margin Impact
        </button>
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      {results && (
        <div ref={resultsRef} className="space-y-12">
          <div
            className={`overflow-hidden transition-all duration-[2500ms] ease-out ${
              showAnnualImpact ? 'max-h-[1200px] translate-y-0 opacity-100' : 'max-h-0 translate-y-6 opacity-0'
            }`}
          >
            <ResultPanel results={results} />
          </div>
          <EnterpriseRollup
            perFacilityEbitdaIncrease={results.totals.annualEbitdaIncrease}
            perFacilityRevenue={inputs.annualFabricationRevenue}
          />
        </div>
      )}
    </div>
  );
}
