'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { computeMarginImpact, formatUSD, formatNumber } from '@/lib/marginModel';

// Conservative fixed assumptions matching observed median deployment outcomes.
// Users who want to tune these can use the full model at /margin-impact/.
const FIXED = {
  scrapReductionPts: 1.5,           // Observed median 1.5pt improvement
  revenueMultiplier: 2.5,           // Rough revenue-to-material-cost ratio
  laborFraction: 0.15,              // Labor ≈ 15% of revenue
  contributionMarginPct: 20,
  preventableReworkLaborPct: 4,
  reworkReductionPct: 40,
  throughputImprovementPct: 2,
  includeOversightRisk: false,
};

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

interface SliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}

function Slider({ id, label, min, max, step, value, onChange, format }: SliderProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label htmlFor={id} className="text-sm font-medium text-txt">
          {label}
        </label>
        <span className="font-mono text-sm text-accent-2 tabular-nums">{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-line accent-accent"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={format(value)}
      />
      <div className="flex justify-between text-[10px] text-muted/60 mt-1">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

function ResultRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-3 border-b border-line last:border-0 ${highlight ? 'py-4' : ''}`}>
      <span className={`text-sm ${highlight ? 'font-semibold text-txt' : 'text-muted'}`}>{label}</span>
      <span className={`font-mono tabular-nums ${highlight ? 'text-xl font-bold text-accent-2' : 'text-sm text-txt'}`}>
        {value}
      </span>
    </div>
  );
}

export default function QuickEstimateCalculator() {
  const [tons, setTons] = useState(12_500);
  const [scrapRate, setScrapRate] = useState(8);
  const [costPerTon, setCostPerTon] = useState(850);

  const results = useMemo(() => {
    const targetScrap = clamp(scrapRate - FIXED.scrapReductionPts, 0, scrapRate);
    const revenue = tons * costPerTon * FIXED.revenueMultiplier;
    const labor = revenue * FIXED.laborFraction;

    try {
      return computeMarginImpact({
        annualTonsProcessed: tons,
        avgMaterialCostPerTon: costPerTon,
        annualFabricationRevenue: revenue,
        annualFabricationLaborCost: labor,
        incrementalContributionMarginPct: FIXED.contributionMarginPct,
        currentScrapRatePct: scrapRate,
        targetScrapRatePct: targetScrap,
        preventableReworkLaborPct: FIXED.preventableReworkLaborPct,
        reworkReductionPct: FIXED.reworkReductionPct,
        throughputImprovementPct: FIXED.throughputImprovementPct,
        includeOversightRisk: FIXED.includeOversightRisk,
      });
    } catch {
      return null;
    }
  }, [tons, scrapRate, costPerTon]);

  const tonsSaved = results?.material.tonsSaved ?? 0;
  const materialSavings = results?.material.dollarsSaved ?? 0;
  const totalEbitda = results?.totals.annualEbitdaIncrease ?? 0;

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="border border-line bg-card rounded-2xl p-7 space-y-7">
        <Slider
          id="tons"
          label="Annual tonnage processed"
          min={500}
          max={50_000}
          step={500}
          value={tons}
          onChange={setTons}
          format={(v) => `${formatNumber(v, { maximumFractionDigits: 0 })} t`}
        />
        <Slider
          id="scrap"
          label="Current scrap rate"
          min={2}
          max={15}
          step={0.5}
          value={scrapRate}
          onChange={setScrapRate}
          format={(v) => `${v.toFixed(1)}%`}
        />
        <Slider
          id="cost"
          label="Material cost per ton"
          min={300}
          max={2_000}
          step={50}
          value={costPerTon}
          onChange={setCostPerTon}
          format={(v) => formatUSD(v, { maximumFractionDigits: 0 })}
        />

        <p className="text-xs text-muted/70 border-t border-line pt-4">
          Assumes a 1.5-point scrap reduction — the observed median across deployments. Labor,
          throughput, and oversight inputs are set to conservative defaults.
        </p>
      </div>

      {/* Live Results */}
      <div
        className="border border-line bg-card rounded-2xl p-7"
        aria-live="polite"
        aria-atomic="true"
        aria-label="Estimated annual impact"
      >
        <p className="text-xs uppercase tracking-widest text-muted mb-5">Estimated Annual Impact</p>

        <div>
          <ResultRow
            label="Tons recovered"
            value={`${formatNumber(tonsSaved, { maximumFractionDigits: 1 })} t / yr`}
          />
          <ResultRow
            label="Material savings"
            value={formatUSD(materialSavings)}
          />
          <ResultRow
            label="Labor & throughput contribution"
            value={formatUSD(totalEbitda - materialSavings)}
          />
          <ResultRow
            label="Total EBITDA impact"
            value={formatUSD(totalEbitda)}
            highlight
          />
        </div>

        <div className="mt-6 pt-5 border-t border-line grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Low friction', value: results?.pricing.lowFrictionAnnual ?? 0 },
            { label: 'Base', value: results?.pricing.baseAnnual ?? 0 },
            { label: 'Full deploy', value: results?.pricing.aggressiveAnnual ?? 0 },
          ].map(({ label, value }) => (
            <div key={label} className="border border-line rounded-lg px-3 py-2.5">
              <div className="text-[10px] text-muted uppercase tracking-wide mb-1">{label}</div>
              <div className="font-mono text-sm text-txt">{formatUSD(value)} / yr</div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted/60 mt-3 text-center">Indicative platform investment range</p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/margin-impact/"
          className="flex-1 text-center px-5 py-3 rounded-lg border border-line hover:border-accent/50 text-sm font-medium text-muted hover:text-txt transition-all"
        >
          Build full EBITDA model →
        </Link>
        <Link
          href="/commercial/#contact"
          className="flex-1 text-center px-5 py-3 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-accent/25"
        >
          Request a scoped consultation
        </Link>
      </div>

      <p className="text-xs text-muted/60 text-center leading-relaxed">
        Results are estimates based on observed customer data. Individual outcomes depend on shop
        configuration, material mix, and operator conditions. Not a guarantee of performance.
      </p>
    </div>
  );
}
