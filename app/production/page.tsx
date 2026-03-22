import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import PhotoBackground from '@/components/PhotoBackground';
import IntegrationDiagram from '@/components/IntegrationDiagram';
import { regimeCatalog } from '@/lib/siteData';
import { CTA } from '@/lib/constants';
import CaseStudies from '@/components/CaseStudies';
import PhotoDivider from '@/components/PhotoDivider';
import { getDividersForPage } from '@/data/photoDividers';
import { ScrapRanges } from './Charts';

export const metadata: Metadata = {
  title: 'Production — Execution Intelligence for Daily Operations',
  description: 'Everything in Pilot plus advanced analytics, QA scoring, custom calibration profiles, and priority support. $3,200/bench/mo.',
  alternates: { canonical: '/production/' },
  openGraph: {
    title: 'Production | Reality Anchors',
    description: 'Execution intelligence for daily operations — analytics, QA scoring, custom calibration, and priority support.',
  },
};

const productionRegimes = regimeCatalog.filter((regime) => ['structural-fabrication', 'multi-project-optimization', 'machine-calibration'].includes(regime.id));

const dividers = getDividersForPage('production');

export default function ProductionPage() {
  return (
    <main id="main-content" className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Reality Anchors Production',
            provider: { '@type': 'Organization', name: 'Reality Anchors' },
            description: 'Execution intelligence for daily operations — analytics, QA scoring, custom calibration, and priority support.',
            url: 'https://realityanchorsltd.com/production/',
            areaServed: 'US',
            serviceType: 'Fabrication Execution Software',
          }),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 border-b border-line">
        <PhotoBackground src="/images/commercial-fabrication.jpg" opacity={0.18} position="center 30%" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Solutions / Production</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-txt mb-5 leading-tight">
            Execution intelligence for daily operations
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed mb-6">
            Everything in Pilot plus advanced analytics, QA scoring, custom calibration profiles, and priority support. The tier most teams scale into after proving ROI.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {['$3,200/bench/mo', 'Recommended', 'Priority support (24h)'].map((t) => (
              <span key={t} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-line text-muted">{t}</span>
            ))}
          </div>
          <IntegrationDiagram />
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href={CTA.primary.href} className="px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px">
              {CTA.primary.label}
            </Link>
            <Link href="#contact" className="px-5 py-2.5 rounded-lg border border-line hover:border-accent/40 text-txt text-sm font-semibold transition-all">
              {CTA.secondary.label}
            </Link>
          </div>
        </div>
      </section>

      {/* Features — what Production adds over Pilot */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-txt mb-6">What Production adds</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-line bg-card rounded-2xl p-7">
              <h3 className="text-sm font-semibold text-txt mb-4">Everything in Pilot</h3>
              <ul className="flex flex-col gap-2.5">
                {['AR-guided execution overlay', 'Daily usage dashboards', 'Email support (48h SLA)'].map((i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
                ))}
              </ul>
            </div>
            <div className="border border-accent/30 bg-gradient-to-b from-accent/5 to-card rounded-2xl p-7">
              <h3 className="text-sm font-semibold text-txt mb-4">Plus in Production</h3>
              <ul className="flex flex-col gap-2.5">
                {['Advanced analytics & QA scoring', 'Custom calibration profiles', 'Priority support (24h SLA)'].map((i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Problem — what breaks without execution validation */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-txt mb-6">What this solves</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Material waste', desc: 'Miscuts, wrong bar marks, and untracked offcuts add up to 6–10% scrap on a typical commercial shop.', stat: '6–10% typical scrap' },
              { title: 'Rework and delays', desc: 'Manual errors caught late in the process mean re-fabrication, missed deadlines, and overtime.', stat: '20+ hrs/month rework' },
              { title: 'No execution data', desc: 'Without per-step records, you can\'t trace problems, prove quality, or optimize future jobs.', stat: 'Zero audit trail' },
            ].map((item) => (
              <div key={item.title} className="border border-line bg-card rounded-2xl p-6">
                <p className="text-sm font-semibold text-txt mb-2">{item.title}</p>
                <p className="text-xs text-muted leading-relaxed mb-3">{item.desc}</p>
                <p className="text-xs font-mono text-accent-2">{item.stat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Economics */}
      <section className="pb-14">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-3">Economics</h2>
            <p className="text-muted text-sm mb-4">
              We do not price against self-reported scrap rates. Instead, we use industry-typical ranges by segment and apply conservative deltas. This prevents pricing inflation and keeps contracts stable over time.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="ra-table">
                <thead><tr><th>Segment</th><th>Typical scrap</th><th>After Reality Anchors</th><th>Annual savings potential</th></tr></thead>
                <tbody>
                  <tr><td>Small commercial shop</td><td className="font-mono text-muted">6–10%</td><td className="font-mono text-accent-2">4–7%</td><td className="font-mono text-txt">$8k–$25k</td></tr>
                  <tr><td>Prefab yard</td><td className="font-mono text-muted">4–7%</td><td className="font-mono text-accent-2">2.5–5%</td><td className="font-mono text-txt">$25k–$80k</td></tr>
                  <tr><td>Multi-bench operation</td><td className="font-mono text-muted">3–6%</td><td className="font-mono text-accent-2">2–4%</td><td className="font-mono text-txt">$50k–$150k+</td></tr>
                </tbody>
              </table>
            </div>
            <ScrapRanges />
            <p className="text-xs text-muted/70 mt-4">Contracts reference a baseline model version for clarity.</p>
          </div>
        </div>
      </section>

      <CaseStudies />

      {dividers[0] && <PhotoDivider {...dividers[0]} />}

      {/* Rollout — pilot program */}
      <section className="pb-14">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-accent/30 bg-gradient-to-b from-accent/5 to-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-3">Start with a pilot</h2>
            <p className="text-muted text-sm mb-5">
              Validate fit and measure impact before a broader rollout. Walk away after 60 days if the numbers don&apos;t work — no lock-in.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-5">
              {[
                { phase: 'Week 1–2', title: 'Onboarding', desc: 'Baseline metrics captured, workflows configured, operators trained.' },
                { phase: 'Week 3–8', title: 'Validation', desc: '60-day window measuring scrap, rework, and throughput against baselines.' },
                { phase: 'Week 9+', title: 'Decision', desc: 'Review results against baselines. Scale, adjust, or walk away — no lock-in.' },
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
                Join Our Waitlist
              </Link>
              <Link href={CTA.primary.href} className="px-5 py-2.5 rounded-lg border border-line hover:border-accent/40 text-txt text-sm font-semibold transition-all">
                {CTA.primary.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Risk reversal */}
      <section className="pb-14">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-4">
          <div className="border border-line bg-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-txt mb-3">What gets tracked</h3>
            <ul className="flex flex-col gap-2">
              {['Scrap percent and offcut inventory', 'Miscut and rework events', 'Throughput (tons, bars, work orders)', 'Operator actions with timestamps', 'Audit exports (job-level and run-level)'].map((i) => (
                <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
              ))}
            </ul>
          </div>
          <div className="border border-line bg-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-txt mb-3">What you keep</h3>
            <ul className="flex flex-col gap-2">
              {['Your existing machines and processes', 'Full control — operators confirm every step', 'All execution data (exportable to ERP/QA)', 'Transparent, logged savings metrics', 'Freedom to walk away after validation'].map((i) => (
                <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="relative overflow-hidden py-14">
        <PhotoBackground src="/images/quality-control.jpg" opacity={0.05} gradient="from-bg/95 via-bg/90 to-bg/95" position="center 50%" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-3">Programs for production operations</h2>
            <p className="text-muted text-sm mb-6">
              Paired with baseline measurement and a 60-day validation window.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {productionRegimes.map((regime) => (
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

      <LeadForm id="contact" />
      <Footer />
    </main>
  );
}
