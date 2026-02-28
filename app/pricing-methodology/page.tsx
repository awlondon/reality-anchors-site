import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Pricing Methodology — Transparent Value-Aligned Pricing',
  description: 'Published baseline models, conservative improvement deltas, and value-aligned subscription structure. No percentage-of-savings contracts.',
  openGraph: {
    title: 'Pricing Methodology | Reality Anchors',
    description: 'Transparent pricing methodology with published baseline models and conservative improvement deltas.',
  },
};

export default function PricingMethodologyPage() {
  return (
    <main id="main-content" className="pt-20">
      {/* Header */}
      <section className="py-16 border-b border-line">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">
            Document RA-WP-001 · Version 1.0 · January 2026
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-txt mb-5 leading-tight">
            Platform Architecture &amp; Pricing Methodology
          </h1>
          <p className="text-xl text-muted max-w-2xl leading-relaxed">
            Transparent pricing based on published industry baseline models, conservative improvement deltas, and value-aligned subscription structures.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/commercial/" className="px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px">
              Explore commercial plans
            </Link>
            <Link href="/margin-impact/" className="px-5 py-2.5 rounded-lg border border-line hover:border-accent/40 text-txt text-sm font-semibold transition-all">
              Run the calculator
            </Link>
          </div>
        </div>
      </section>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-6 py-14 flex flex-col gap-10">

        {/* Purpose */}
        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">1. Purpose</h2>
          <p className="text-muted text-sm leading-relaxed mb-4">
            This document provides a transparent view of Reality Anchors pricing assumptions, baseline models, and subscription structures. Its purpose is to support buyer due diligence, provide contractual stability, and establish a clear causal link between platform value delivery and subscription cost.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            Pricing is not based on self-reported scrap rates or percentage-of-savings models. Instead, it references published industry ranges and applies conservative deltas to arrive at a modeled value from which subscription tiers are derived.
          </p>
        </section>

        {/* Baseline Model */}
        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">2. Baseline Model Assumptions (Scrap + Rework)</h2>
          <p className="text-muted text-sm mb-6">
            Segment classifications and baseline scrap/rework rates are derived from published Australian Standards, fabrication surveys, and operator benchmark studies. All rates are conservative mid-points of observable ranges.
          </p>
          <div className="table-scroll-wrapper overflow-x-auto mb-6">
            <table className="ra-table">
              <thead><tr><th>Segment</th><th>Scrap range</th><th>Scrap model baseline</th><th>Basis</th></tr></thead>
              <tbody>
                <tr>
                  <td>Small commercial shop</td>
                  <td className="font-mono text-accent-2">6–10%</td>
                  <td className="font-mono text-txt">8.0%</td>
                  <td className="text-muted text-sm">Mid-point, conservative</td>
                </tr>
                <tr>
                  <td>Prefab yard</td>
                  <td className="font-mono text-accent-2">4–7%</td>
                  <td className="font-mono text-txt">5.5%</td>
                  <td className="text-muted text-sm">Mid-point, conservative</td>
                </tr>
                <tr>
                  <td>Industrial</td>
                  <td className="font-mono text-accent-2">2–5%</td>
                  <td className="font-mono text-txt">3.5%</td>
                  <td className="text-muted text-sm">Mid-point, conservative</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="table-scroll-wrapper overflow-x-auto mb-4">
            <table className="ra-table">
              <thead><tr><th>Rework metric</th><th>Industry range</th><th>Model baseline</th><th>Basis</th></tr></thead>
              <tbody>
                <tr>
                  <td>Fabrication remake rate (% of pieces)</td>
                  <td className="font-mono text-accent-2">1.0–3.0%</td>
                  <td className="font-mono text-txt">1.5%</td>
                  <td className="text-muted text-sm">Conservative benchmark midpoint</td>
                </tr>
                <tr>
                  <td>Blended remake cost per affected piece</td>
                  <td className="font-mono text-accent-2">$8–$40</td>
                  <td className="font-mono text-txt">$20</td>
                  <td className="text-muted text-sm">Material + labor + bench disruption allowance</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted/70">Contracts reference the published baseline model version number for contractual stability.</p>
        </section>

        {/* Improvement Deltas */}
        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">3. Conservative Improvement Deltas</h2>
          <p className="text-muted text-sm mb-6">
            Improvement deltas represent expected reduction in scrap and preventable rework attributable to structured workflow enforcement. Values are set at lower observable bounds to preserve conservative estimates.
          </p>
          <div className="table-scroll-wrapper overflow-x-auto mb-6">
            <table className="ra-table">
              <thead><tr><th>Segment</th><th>Baseline</th><th>Conservative delta</th><th>Post-deployment model</th></tr></thead>
              <tbody>
                <tr>
                  <td>Small commercial shop</td>
                  <td className="font-mono">8.0%</td>
                  <td className="font-mono text-accent-2">2.0 pts</td>
                  <td className="font-mono text-txt">6.0%</td>
                </tr>
                <tr>
                  <td>Prefab yard</td>
                  <td className="font-mono">5.5%</td>
                  <td className="font-mono text-accent-2">1.5 pts</td>
                  <td className="font-mono text-txt">4.0%</td>
                </tr>
                <tr>
                  <td>Industrial</td>
                  <td className="font-mono">3.5%</td>
                  <td className="font-mono text-accent-2">1.0 pt</td>
                  <td className="font-mono text-txt">2.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="table-scroll-wrapper overflow-x-auto mb-6">
            <table className="ra-table">
              <thead><tr><th>Rework metric</th><th>Baseline</th><th>Conservative delta</th><th>Post-deployment model</th></tr></thead>
              <tbody>
                <tr>
                  <td>Remake rate (% of pieces)</td>
                  <td className="font-mono">1.5%</td>
                  <td className="font-mono text-accent-2">0.8 pts</td>
                  <td className="font-mono text-txt">0.7%</td>
                </tr>
                <tr>
                  <td>Relative improvement</td>
                  <td className="font-mono">—</td>
                  <td className="font-mono text-accent-2">40–70%</td>
                  <td className="font-mono text-txt">Steady-state target band</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="codeblock text-xs">{`AnnualMaterialSavings =
  TonsPerMonth × 12 × SteelCostPerTon × ScrapDelta

AnnualLaborSavings (optional) =
  TonsPerMonth × 12 × HoursSavedPerTon × LoadedLaborRate

AnnualReworkSavings =
  PiecesPerMonth × 12 × (ReworkBaseline - ReworkPost) × BlendedReworkCostPerPiece`}</div>
        </section>

        {/* Subscription structure */}
        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">4. Value-Aligned Subscription Structure</h2>
          <p className="text-muted text-sm mb-6">
            Subscription tiers are set at 10–25% of modeled annual savings. This fraction keeps the upside strongly in the buyer&apos;s favor while maintaining commercial sustainability and full product support.
          </p>
          <div className="table-scroll-wrapper overflow-x-auto mb-6">
            <table className="ra-table">
              <thead><tr><th>Modeled annual value</th><th>Typical subscription</th><th>Notes</th></tr></thead>
              <tbody>
                <tr><td className="font-mono text-accent-2">Up to $15k</td><td className="font-mono text-txt">$2k–$3k</td><td className="text-muted text-sm">Small bench, low volume</td></tr>
                <tr><td className="font-mono text-accent-2">$15k–$50k</td><td className="font-mono text-txt">$6k–$9k</td><td className="text-muted text-sm">Typical small-to-mid shop</td></tr>
                <tr><td className="font-mono text-accent-2">$50k–$150k</td><td className="font-mono text-txt">$15k–$25k</td><td className="text-muted text-sm">High utilisation benches</td></tr>
                <tr><td className="font-mono text-accent-2">$150k+</td><td className="font-mono text-txt">Custom</td><td className="text-muted text-sm">Multi-bench / multi-facility</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted/70">Final pricing depends on bench count, instrumentation scope, calibration governance requirements, and multi-project optimization complexity.</p>
        </section>

        {/* Governance */}
        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">5. Governance &amp; Compliance Framework</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Versioning</h3>
              <ul className="flex flex-col gap-2">
                {['Baseline model versioned and referenced in contracts', 'Regime releases after internal QA review', 'Machine calibration profiles versioned', 'Subscription tier recalibration at 60-day window'].map((i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Auditability</h3>
              <ul className="flex flex-col gap-2">
                {['Immutable event streams', 'Per-run scrap and time reports', 'Exception registry for drift and overrides', 'Role-based access controls'].map((i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-wrap gap-4">
          <Link href="/commercial/#contact" className="px-6 py-3.5 rounded-lg bg-accent hover:bg-blue-500 text-white font-semibold transition-all hover:-translate-y-px">
            Request enterprise assessment
          </Link>
          <Link href="/margin-impact/" className="px-6 py-3.5 rounded-lg border border-line hover:border-accent/40 text-txt font-semibold transition-all">
            Run savings calculator
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
