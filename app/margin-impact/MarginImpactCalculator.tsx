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

export default function MarginImpactCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState<any>(null);
  const [showAnnualImpact, setShowAnnualImpact] = useState(false);
  const [error, setError] = useState('');
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (results) {
      setShowAnnualImpact(false);
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const revealTimer = window.setTimeout(() => {
        setShowAnnualImpact(true);
      }, 1500);

      return () => window.clearTimeout(revealTimer);
    }
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
          {showAnnualImpact && <ResultPanel results={results} />}
          <EnterpriseRollup
            perFacilityEbitdaIncrease={results.totals.annualEbitdaIncrease}
            perFacilityRevenue={inputs.annualFabricationRevenue}
          />
        </div>
      )}
    </div>
  );
}
