'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { computeMarginImpact, formatUSD, formatNumber } from '@/lib/marginModel';
import { setCalculatorContext } from '@/lib/calculatorContext';
import { trackEvent } from '@/lib/analytics';

// Conservative fixed assumptions matching observed median deployment outcomes.
// Users who want to tune these can use the full model at /margin-impact/.
const FIXED = {
  scrapReductionPts: 1.5,
  revenueMultiplier: 2.5,
  laborFraction: 0.15,
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
        skipVolumeScale: true,
      });
    } catch {
      return null;
    }
  }, [tons, scrapRate, costPerTon]);

  const tonsSaved = results?.material.tonsSaved ?? 0;
  const materialSavings = results?.material.dollarsSaved ?? 0;
  const totalEbitda = results?.totals.annualEbitdaIncrease ?? 0;

  // Persist state to sessionStorage so the lead form picks up the financial context.
  // Fire a debounced analytics event — only after the user stops sliding for 800 ms.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setCalculatorContext({
      annualTons: tons,
      scrapRatePct: scrapRate,
      costPerTon,
      estimatedEbitda: totalEbitda,
      estimatedMaterialSavings: materialSavings,
      estimatedTonsSaved: tonsSaved,
      materialDollarsSaved: results?.material.dollarsSaved ?? 0,
      laborDollarsSaved: results?.labor.dollarsSaved ?? 0,
      throughputContribution: results?.throughput.ebitdaContribution ?? 0,
      oversightRiskSaved: results?.oversightRisk.dollarsSaved ?? 0,
    });

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      trackEvent('calculator_interaction', {
        annualTons: tons,
        scrapRatePct: scrapRate,
        costPerTon,
        estimatedEbitda: Math.round(totalEbitda),
      });
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [tons, scrapRate, costPerTon, totalEbitda, materialSavings, tonsSaved]);

  const handlePrint = useCallback(() => {
    trackEvent('calculator_print', { estimatedEbitda: Math.round(totalEbitda) });
    window.print();
  }, [totalEbitda]);

  const today = new Date().toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/*
        Print stylesheet — only active when window.print() is called.
        Hides interactive UI and shows the print-only branded artifact.
      */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          [data-print], [data-print] * { visibility: visible !important; }
          [data-print] { position: fixed; inset: 0; padding: 2.5cm; background: white; }
          [data-no-print] { display: none !important; }
        }
      `}</style>

      {/* Print-only branded estimate document */}
      <div data-print aria-hidden="true">
        <div style={{ fontFamily: 'system-ui, sans-serif', color: '#0f172a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #e2e8f0' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Reality Anchors Limited</div>
              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Scrap Recovery Estimate</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8' }}>
              <div>Generated {today}</div>
              <div>ra.primarydesignco.com</div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '0.75rem' }}>Facility Inputs</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <tbody>
                {([
                  ['Annual tonnage', `${formatNumber(tons, { maximumFractionDigits: 0 })} t`],
                  ['Current scrap rate', `${scrapRate.toFixed(1)}%`],
                  ['Material cost per ton', formatUSD(costPerTon, { maximumFractionDigits: 0 })],
                  ['Assumed scrap reduction', '1.5 pts (observed median)'],
                ] as [string, string][]).map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.4rem 0', color: '#64748b' }}>{k}</td>
                    <td style={{ padding: '0.4rem 0', textAlign: 'right', fontWeight: 500 }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '0.75rem' }}>Estimated Annual Impact</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <tbody>
                {([
                  ['Tons recovered', `${formatNumber(tonsSaved, { maximumFractionDigits: 1 })} t / yr`],
                  ['Material savings', formatUSD(materialSavings)],
                  ['Labor & throughput contribution', formatUSD(totalEbitda - materialSavings)],
                ] as [string, string][]).map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.4rem 0', color: '#64748b' }}>{k}</td>
                    <td style={{ padding: '0.4rem 0', textAlign: 'right' }}>{v}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: '2px solid #e2e8f0' }}>
                  <td style={{ padding: '0.6rem 0', fontWeight: 700, fontSize: '1rem' }}>Total EBITDA impact</td>
                  <td style={{ padding: '0.6rem 0', textAlign: 'right', fontWeight: 700, fontSize: '1rem', color: '#2563eb' }}>{formatUSD(totalEbitda)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '0.75rem' }}>Indicative Platform Investment</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <tbody>
                {([
                  ['Low friction', formatUSD(results?.pricing.lowFrictionAnnual ?? 0)],
                  ['Base', formatUSD(results?.pricing.baseAnnual ?? 0)],
                  ['Full deployment', formatUSD(results?.pricing.aggressiveAnnual ?? 0)],
                ] as [string, string][]).map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.4rem 0', color: '#64748b' }}>{k}</td>
                    <td style={{ padding: '0.4rem 0', textAlign: 'right' }}>{v} / yr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            Results are estimates based on observed customer data. Individual outcomes depend on shop configuration, material mix, and operator conditions. Not a guarantee of performance.
          </div>
        </div>
      </div>

      {/* Interactive UI */}
      <div className="space-y-8" data-no-print>
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
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs uppercase tracking-widest text-muted">Estimated Annual Impact</p>
            <button
              onClick={handlePrint}
              aria-label="Download estimate as PDF"
              className="text-xs text-muted/70 hover:text-txt border border-line hover:border-muted/50 rounded-md px-3 py-1.5 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>

          <div>
            <ResultRow
              label="Tons recovered"
              value={`${formatNumber(tonsSaved, { maximumFractionDigits: 1 })} t / yr`}
            />
            <ResultRow label="Material savings" value={formatUSD(materialSavings)} />
            <ResultRow
              label="Labor & throughput contribution"
              value={formatUSD(totalEbitda - materialSavings)}
            />
            <ResultRow label="Total EBITDA impact" value={formatUSD(totalEbitda)} highlight />
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
    </>
  );
}
