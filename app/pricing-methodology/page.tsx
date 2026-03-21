import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import PhotoBackground from '@/components/PhotoBackground';
import { pricingModuleStatus } from '@/data/pricing';
import { ScrapBeforeAfter } from './Charts';

export const metadata: Metadata = {
  title: 'Pricing Methodology — Transparent Value-Aligned Pricing',
  description: 'Published baseline models, conservative improvement deltas, and value-aligned subscription structure. No percentage-of-savings contracts.',
  alternates: { canonical: '/pricing-methodology/' },
  openGraph: {
    title: 'Pricing Methodology | Reality Anchors',
    description: 'Transparent pricing methodology with industry-typical baseline models and conservative improvement deltas.',
  },
};

export default function PricingMethodologyPage() {
  return (
    <main id="main-content" className="pt-20">
      {/* Header */}
      <section className="relative overflow-hidden py-16 border-b border-line">
        <PhotoBackground src="/images/methodology-measurement.jpg" opacity={0.15} position="center 50%" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">
            Document RA-WP-001 · Version 1.0 · January 2026
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-txt mb-5 leading-tight">
            Platform Architecture &amp; Pricing Methodology
          </h1>
          <p className="text-xl text-muted max-w-2xl leading-relaxed">
            Transparent pricing based on industry-typical baseline models, conservative improvement deltas, and value-aligned subscription structures.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/commercial/" className="px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px">
              Explore production plans
            </Link>
            <Link href="/margin-impact/" className="px-5 py-2.5 rounded-lg border border-line hover:border-accent/40 text-txt text-sm font-semibold transition-all">
              Run the calculator
            </Link>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="relative overflow-hidden">
        <PhotoBackground src="/images/methodology-measurement.jpg" opacity={0.04} gradient="from-bg/95 via-bg/90 to-bg/95" position="center 60%" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-14 flex flex-col gap-10">

        {/* Purpose */}
        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">1. Purpose</h2>
          <p className="text-muted text-sm leading-relaxed mb-4">
            This document provides a transparent view of Reality Anchors pricing assumptions, baseline models, and subscription structures. Its purpose is to support buyer due diligence, provide contractual stability, and establish a clear causal link between platform value delivery and subscription cost.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            Pricing is not based on self-reported scrap rates or percentage-of-savings models. Instead, it references industry-typical ranges and applies conservative deltas to arrive at a modeled value from which subscription tiers are derived.
          </p>
        </section>

        {/* Baseline Model */}
        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">2. Baseline Model Assumptions (Scrap + Rework)</h2>
          <p className="text-muted text-sm mb-6">
            Segment classifications and baseline scrap/rework rates are modeled from industry-typical ranges. All rates are conservative mid-points intended for pricing illustration, not guaranteed outcomes.
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
          <p className="text-xs text-muted/70">Contracts reference the baseline model version number for contractual stability.</p>
        </section>

        {/* Improvement Deltas */}
        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">3. Conservative Improvement Deltas</h2>
          <p className="text-muted text-sm mb-6">
            Improvement deltas represent modeled reduction targets for scrap and preventable rework based on structured workflow enforcement. Values are set conservatively for pricing purposes and are not guaranteed outcomes.
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
          <ScrapBeforeAfter />
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
            All tiers are priced per bench, per month. Pricing scales with execution complexity and governance requirements, keeping the value proposition clear at every level.
          </p>
          <div className="table-scroll-wrapper overflow-x-auto mb-6">
            <table className="ra-table">
              <thead><tr><th>Tier</th><th>Monthly per bench</th><th>Notes</th></tr></thead>
              <tbody>
                <tr><td>Pilot</td><td className="font-mono text-accent-2">$1,200</td><td className="text-muted text-sm">Solo operators and small crews</td></tr>
                <tr><td>Production</td><td className="font-mono text-accent-2">$3,200</td><td className="text-muted text-sm">Fabrication yards and multi-bench shops</td></tr>
                <tr><td>Enterprise</td><td className="font-mono text-accent-2">$4,800</td><td className="text-muted text-sm">High-volume plants with ERP integration</td></tr>
              </tbody>
              <tbody>
                <tr><td colSpan={3} className="pt-4 pb-2 text-xs font-bold uppercase tracking-[0.15em] text-accent">Device Add-Ons (per device, any tier)</td></tr>
                <tr><td>Context Camera</td><td className="font-mono text-accent-2">$200/device/mo</td><td className="text-muted text-sm">Wider coverage, multi-angle capture</td></tr>
                <tr><td>LiDAR-Equipped Device</td><td className="font-mono text-accent-2">$450/device/mo</td><td className="text-muted text-sm">Sub-mm precision depth</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted/70">Final pricing depends on bench count, instrumentation scope, calibration governance requirements, and multi-project optimization complexity.</p>
        </section>

        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">5. Plan Designations and Enforcement Status</h2>
          <p className="text-muted text-sm mb-6">
            Public pricing uses &quot;included in [Plan]&quot; language to show the intended commercial boundary for each module.
            Where product-level gates are still rolling out, that status is disclosed here rather than implied away.
          </p>
          <div className="table-scroll-wrapper overflow-x-auto mb-5">
            <table className="ra-table">
              <thead><tr><th>Module</th><th>Included in</th><th>Enforcement status</th><th>Current note</th></tr></thead>
              <tbody>
                {pricingModuleStatus.map((module) => (
                  <tr key={module.id}>
                    <td>
                      <div className="font-semibold text-txt">{module.name}</div>
                      <div className="font-mono text-[11px] text-muted/70">{module.id}</div>
                    </td>
                    <td className="text-muted text-sm">{module.includedIn}</td>
                    <td className="text-sm">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          module.enforcementStatus === 'Available now'
                            ? 'bg-emerald-500/10 text-emerald-300'
                            : 'bg-amber-500/10 text-amber-300'
                        }`}
                      >
                        {module.enforcementStatus}
                      </span>
                    </td>
                    <td className="text-muted text-sm">{module.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-xl border border-line/70 bg-bg/50 px-5 py-4">
            <p className="text-sm font-semibold text-txt mb-2">FAQ: Why use &quot;included in&quot; before every gate is enforced?</p>
            <p className="text-sm leading-relaxed text-muted">
              Because the pricing page is describing the commercial plan boundary, not claiming that every entitlement check is already complete.
              The enforcement note makes the rollout state explicit so buyers can see both the intended plan designation and where gate wiring is still in progress.
            </p>
          </div>
        </section>

        {/* Governance */}
        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">6. Governance &amp; Compliance Framework</h2>
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
      </section>

      <Footer />
    </main>
  );
}
