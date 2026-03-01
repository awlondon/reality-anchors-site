import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import PhotoBackground from '@/components/PhotoBackground';
import TestimonialBreak from '@/components/TestimonialBreak';
import { regimeCatalog } from '@/lib/siteData';
import { getTestimonialsForPage } from '@/data/testimonials';
import { ScrapRanges } from './Charts';

export const metadata: Metadata = {
  title: 'Commercial Solutions — Execution Intelligence for Fabrication Yards',
  description: 'Execution-layer infrastructure for crews and yards. Value-amplification pricing aligned to measurable scrap reduction and margin improvement.',
  openGraph: {
    title: 'Commercial Solutions | Reality Anchors',
    description: 'Execution intelligence for fabrication yards — measurable scrap reduction, audit-ready workflows, and value-aligned pricing.',
  },
};

const commercialRegimes = regimeCatalog.filter((regime) => ['structural-fabrication', 'multi-project-optimization', 'machine-calibration'].includes(regime.id));

const testimonial = getTestimonialsForPage('commercial').find((t) => t.id === 'procurement-lead-supply')!;

export default function CommercialPage() {
  return (
    <main id="main-content" className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Reality Anchors Commercial',
            provider: { '@type': 'Organization', name: 'Reality Anchors Limited' },
            description: 'Execution intelligence for fabrication yards — measurable scrap reduction, audit-ready workflows, and value-aligned pricing.',
            url: 'https://ra.primarydesignco.com/commercial/',
            areaServed: 'AU',
            serviceType: 'Fabrication Execution Software',
          }),
        }}
      />
      {/* Header */}
      <section className="relative overflow-hidden py-16 border-b border-line">
        <PhotoBackground src="/images/commercial-fabrication.jpg" opacity={0.18} position="center 30%" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Solutions / Commercial</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-txt mb-5 leading-tight">Commercial</h1>
          <p className="text-xl text-muted max-w-2xl leading-relaxed">
            Execution intelligence for crews and fabrication yards. Designed to reinforce upstream planning tools through verified downstream execution outcomes.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/margin-impact/" className="px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px">
              Estimate savings
            </Link>
            <Link href="#contact" className="px-5 py-2.5 rounded-lg border border-line hover:border-accent/40 text-txt text-sm font-semibold transition-all">
              Talk to a representative
            </Link>
          </div>
        </div>
      </section>

      {/* Strategic deployment model */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-3">Strategic deployment model</h2>
            <p className="text-muted text-sm mb-4">
              Reality Anchors uses a <strong className="text-txt">value-amplification deployment model</strong> based on measurable execution impact and facility rollout scope.
            </p>
            <p className="text-muted text-sm mb-5">
              We scope deployment by facility profile, throughput, and execution complexity, then align commercial terms to expected margin and performance improvement.
            </p>
            <ul className="flex flex-col gap-2 mb-5">
              {['A predicted annual savings range', 'A suggested subscription range aligned to that value', 'A usage layer that scales with bench activity'].map((i) => (
                <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
              ))}
            </ul>
            <div className="text-xs text-muted/70 border border-line/50 rounded-xl px-4 py-3 bg-bg/50">
              No performance audits. No revenue-share disputes. No percentage-of-savings contracts.
            </div>
          </div>
        </div>
      </section>

      {/* Baseline integrity */}
      <section className="pb-14">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-3">Baseline integrity</h2>
            <p className="text-muted text-sm mb-4">
              We do not price against self-reported scrap rates. Instead, we use published industry ranges by segment and apply conservative deltas. This prevents pricing inflation and keeps contracts stable over time.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="ra-table">
                <thead><tr><th>Segment</th><th>Typical scrap range</th><th>Model baseline</th></tr></thead>
                <tbody>
                  <tr><td>Small commercial shop</td><td className="font-mono text-accent-2">6–10%</td><td className="font-mono text-txt">8.0%</td></tr>
                  <tr><td>Prefab yard</td><td className="font-mono text-accent-2">4–7%</td><td className="font-mono text-txt">5.5%</td></tr>
                  <tr><td>Industrial (for reference)</td><td className="font-mono text-accent-2">2–5%</td><td className="font-mono text-txt">3.5%</td></tr>
                </tbody>
              </table>
            </div>
            <ScrapRanges />
            <p className="text-xs text-muted/70 mt-4">Contracts reference a published baseline model version for clarity.</p>
          </div>
        </div>
      </section>

      {/* Step 1 + What gets instrumented */}
      <section className="relative overflow-hidden pb-14">
        <PhotoBackground src="/images/steel-closeup.jpg" opacity={0.06} gradient="from-bg/95 via-bg/85 to-bg/95" position="center" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-3">Step 1 — Model your operational delta</h2>
            <p className="text-muted text-sm mb-4">
              We estimate a material delta (scrap reduction), labor delta (rework/time reduction), and risk delta (error frequency reduction). Modeled assumptions are conservative by default.
            </p>
            <pre className="codeblock text-xs mb-4">{`AnnualSavings ≈
(Tons/month × 12 × SteelCost/ton × ScrapDelta)
+ (Tons/month × 12 × LaborHoursDelta × LoadedRate)`}</pre>
            <p className="text-xs text-muted/70">In onboarding, we align metrics to what you already track.</p>
          </div>
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-4">What gets instrumented</h2>
            <ul className="flex flex-col gap-2.5 mb-4">
              {['Scrap percent and offcut inventory', 'Miscut / rework events', 'Throughput indicators (tons, bars, work orders)', 'Operator actions, timestamps, machine profiles', 'Audit exports (job-level and run-level)'].map((i) => (
                <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
              ))}
            </ul>
            <p className="text-xs text-muted/70">All savings are measured using transparent, logged metrics.</p>
          </div>
        </div>
      </section>

      {/* Step 2 — Subscription tiers */}
      <section className="pb-14">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-3">Step 2 — Align subscription to value</h2>
            <p className="text-muted text-sm mb-6">
              Your subscription is typically set at 8–20% of modeled annual savings. This keeps upside strongly in your favor while supporting continuous product development and support.
            </p>

            <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Suggested annual plans</h3>
            <div className="overflow-x-auto mb-8">
              <table className="ra-table">
                <thead><tr><th>Predicted annual value</th><th>Typical annual subscription</th><th>Intended fit</th></tr></thead>
                <tbody>
                  <tr><td className="font-mono text-accent-2">Up to $15k</td><td className="font-mono text-txt">$1.5k–$2.5k</td><td className="text-muted text-sm">Small bench, low volume</td></tr>
                  <tr><td className="font-mono text-accent-2">$15k–$50k</td><td className="font-mono text-txt">$6k–$9k</td><td className="text-muted text-sm">Typical small-to-mid shop</td></tr>
                  <tr><td className="font-mono text-accent-2">$50k–$150k</td><td className="font-mono text-txt">$15k–$25k</td><td className="text-muted text-sm">High utilisation benches</td></tr>
                  <tr><td className="font-mono text-accent-2">$150k+</td><td className="font-mono text-txt">Custom enterprise agreement</td><td className="text-muted text-sm">Multi-bench / multi-facility</td></tr>
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Usage alignment layer</h3>
                <ul className="flex flex-col gap-2">
                  {['Active benches', 'Monthly tonnage above baseline', 'Advanced optimization batch frequency'].map((i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">60-day validation window</h3>
                <ul className="flex flex-col gap-2">
                  {['Onboarding instruments baseline metrics', 'Modeled assumptions validated against observed performance', 'Subscription tier recalibrated if materially misaligned'].map((i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-xs text-muted/70 mb-5">Final pricing depends on bench count, instrumentation scope, calibration governance requirements, and multi-project optimization complexity.</p>

            <div className="flex flex-wrap gap-3">
              <Link href="/margin-impact/" className="px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px">
                Estimate savings
              </Link>
              <Link href="#contact" className="px-5 py-2.5 rounded-lg border border-line hover:border-accent/40 text-txt text-sm font-semibold transition-all">
                Request a quote range
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TestimonialBreak
        id={testimonial.id}
        quote={testimonial.quote}
        attribution={testimonial.attribution}
        company={testimonial.company}
        backgroundSrc={testimonial.backgroundSrc}
      />

      <section className="relative overflow-hidden pb-14">
        <PhotoBackground src="/images/quality-control.jpg" opacity={0.05} gradient="from-bg/95 via-bg/90 to-bg/95" position="center 50%" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-3">Regimes commonly deployed in commercial benches</h2>
            <p className="text-muted text-sm mb-6">
              These programs are typically paired with a baseline implementation and a 60-day validation window.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {commercialRegimes.map((regime) => (
                <article key={regime.id} className="rounded-xl border border-line/80 bg-bg/60 p-4">
                  <p className="text-[11px] uppercase tracking-wide text-accent mb-2">{regime.tier}</p>
                  <h3 className="text-sm font-semibold text-txt">{regime.title}</h3>
                  <p className="text-xs text-muted mt-2">{regime.metrics[0]?.label}: {regime.metrics[0]?.value}</p>
                  <Link href={regime.learnMoreHref} className="inline-block mt-3 text-xs font-semibold text-accent hover:text-blue-400">Learn more →</Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pilot program — middle-of-funnel confidence builder */}
      <section className="pb-14">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-accent/30 bg-gradient-to-b from-accent/5 to-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-3">Pilot program</h2>
            <p className="text-muted text-sm mb-5">
              Not ready for a full deployment? Start with a structured pilot to validate fit and measure impact before committing to a broader rollout.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-5">
              {[
                { phase: 'Week 1–2', title: 'Onboarding', desc: 'Baseline metrics captured, workflows configured, operators trained.' },
                { phase: 'Week 3–8', title: 'Validation', desc: '60-day window measuring scrap, rework, and throughput against baselines.' },
                { phase: 'Week 9+', title: 'Decision', desc: 'Review measured outcomes. Scale, adjust, or walk away — no lock-in.' },
              ].map((step) => (
                <div key={step.phase} className="border border-line rounded-xl bg-bg/50 px-4 py-3">
                  <p className="text-[10px] font-bold tracking-wide uppercase text-accent mb-1">{step.phase}</p>
                  <p className="text-sm font-semibold text-txt mb-1">{step.title}</p>
                  <p className="text-xs text-muted">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="#contact" className="px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px">
                Start a pilot
              </Link>
              <Link href="/calculator/" className="px-5 py-2.5 rounded-lg border border-line hover:border-accent/40 text-txt text-sm font-semibold transition-all">
                Estimate impact first
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LeadForm id="contact" />
      <Footer />
    </main>
  );
}
