import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import PhotoBackground from '@/components/PhotoBackground';
import IntegrationDiagram from '@/components/IntegrationDiagram';
// TODO: Re-enable with real testimonials
// import TestimonialBreak from '@/components/TestimonialBreak';
import { regimeCatalog } from '@/lib/siteData';
// import { getTestimonialsForPage } from '@/data/testimonials';
import { CTA } from '@/lib/constants';
import PhotoDivider from '@/components/PhotoDivider';
import { getDividersForPage } from '@/data/photoDividers';

export const metadata: Metadata = {
  title: 'Industrial Solutions — Execution Validation at Scale',
  description: 'Enterprise execution validation with ERP integration, compliance-grade traceability, and multi-facility deployment. Pricing aligned to measurable plant savings.',
  alternates: { canonical: '/industrial/' },
  openGraph: {
    title: 'Industrial Solutions | Reality Anchors',
    description: 'Enterprise execution validation — ERP integration, compliance traceability, and multi-facility deployment.',
  },
};

const industrialRegimes = regimeCatalog.filter((regime) => ['machine-calibration', 'ai-governance', 'ar-execution'].includes(regime.id));

// const testimonial = getTestimonialsForPage('industrial').find((t) => t.id === 'quality-manager-precast')!;

const dividers = getDividersForPage('industrial');

export default function IndustrialPage() {
  return (
    <main id="main-content" className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Reality Anchors Industrial',
            provider: { '@type': 'Organization', name: 'Reality Anchors' },
            description: 'Enterprise execution validation — ERP integration, compliance traceability, and multi-facility deployment.',
            url: 'https://realityanchorsltd.com/industrial/',
            areaServed: 'US',
            serviceType: 'Industrial Execution Validation Software',
          }),
        }}
      />

      {/* Hero with integration diagram */}
      <section className="relative overflow-hidden py-16 border-b border-line">
        <PhotoBackground src="/images/industrial-factory.jpg" opacity={0.18} position="center 40%" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Solutions / Industrial</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-txt mb-5 leading-tight">
            Execution validation for high-volume plants
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed mb-8">
            An execution layer between your ERP and the shop floor. Every step validated, every action logged, every export audit-ready.
          </p>
          <IntegrationDiagram />
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="#contact" className="px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px">
              {CTA.secondary.label}
            </Link>
            <Link href={CTA.primary.href} className="px-5 py-2.5 rounded-lg border border-line hover:border-accent/40 text-txt text-sm font-semibold transition-all">
              {CTA.primary.label}
            </Link>
          </div>
        </div>
      </section>

      {/* Deployment architecture */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-txt mb-6">How it fits your stack</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-line bg-card rounded-2xl p-7">
              <h3 className="text-sm font-semibold text-txt mb-4">Inputs from your systems</h3>
              <ul className="flex flex-col gap-2.5">
                {['Digital schedules from ERP / detailing', 'Machine calibration profiles (versioned)', 'Role-based access and permissions', 'Device fleet management constraints'].map((i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
                ))}
              </ul>
            </div>
            <div className="border border-line bg-card rounded-2xl p-7">
              <h3 className="text-sm font-semibold text-txt mb-4">Outputs to your systems</h3>
              <ul className="flex flex-col gap-2.5">
                {['Per-run reports (scrap, time, exceptions)', 'Per-job trace logs (who / what / when)', 'Calibration drift summaries', 'Structured exports for ERP and QA'].map((i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance artifacts */}
      <section className="pb-14">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-3">Compliance documentation the system produces</h2>
            <p className="text-muted text-sm mb-5">
              Reality Anchors generates audit-ready records at every level — from individual operator actions to multi-plant aggregates.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Operational controls</h3>
                <ul className="flex flex-col gap-2">
                  {['Versioned machine profiles', 'QA-released programs only', 'Step validation checkpoints', 'Immutable event streams'].map((i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Audit exports</h3>
                <ul className="flex flex-col gap-2">
                  {['Run-level scrap accounting', 'Operator and station traceability', 'Exception registry (drift, overrides)', 'Standardized reports across shifts'].map((i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {dividers[0] && <PhotoDivider {...dividers[0]} />}

      {/* Scale metrics and economics */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-3">Representative economics</h2>
            <p className="text-muted text-sm mb-4">
              Subscription set at 8–15% of modeled annual savings. ROI stays firmly in your favor.
            </p>
            <div className="border border-line/50 rounded-xl bg-bg/50 px-5 py-4 mb-5">
              <p className="text-xs text-muted mb-3">Mid-size plant: 25,000 t/yr · $850/ton steel · 8% baseline scrap</p>
              <div className="overflow-x-auto mb-3">
                <table className="ra-table">
                  <thead><tr><th>Driver</th><th>Annual impact</th></tr></thead>
                  <tbody>
                    <tr><td>Scrap reduction (1.5 pts)</td><td className="font-mono text-accent-2">~$319k</td></tr>
                    <tr><td>Labor rework reduction</td><td className="font-mono text-accent-2">~$96k</td></tr>
                    <tr><td>Throughput / capacity</td><td className="font-mono text-accent-2">~$160k</td></tr>
                    <tr><td className="font-semibold text-txt">Total annual uplift</td><td className="font-mono text-txt font-semibold">~$575k</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-muted/50">Illustrative; final scope depends on facility profile.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/margin-impact/" className="px-5 py-2.5 rounded-lg border border-line hover:border-accent/40 text-txt text-sm font-semibold transition-all">
                Model your facility
              </Link>
              <Link href="#contact" className="px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px">
                {CTA.secondary.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="relative overflow-hidden pb-14">
        <PhotoBackground src="/images/structural-steel.jpg" opacity={0.05} gradient="from-bg/95 via-bg/90 to-bg/95" position="center 30%" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-3">Industrial program set</h2>
            <p className="text-muted text-sm mb-5">Machine calibration, traceable execution, and compliance-ready controls for ERP-connected plants.</p>
            <div className="grid md:grid-cols-3 gap-4">
              {industrialRegimes.map((regime) => (
                <article key={regime.id} className="rounded-xl border border-line/80 bg-bg/60 p-4">
                  <h3 className="text-sm font-semibold text-txt">{regime.title}</h3>
                  <p className="text-xs text-muted mt-2">{regime.metrics[1]?.label}: {regime.metrics[1]?.value}</p>
                  <Link href={regime.learnMoreHref} className="inline-block mt-3 text-xs font-semibold text-accent hover:text-blue-400">Details →</Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {dividers[1] && <PhotoDivider {...dividers[1]} />}

      <LeadForm
        id="contact"
        heading="Schedule a technical review"
        description="Share your facility profile and we'll return with a scoped assessment, integration requirements, and deployment timeline."
      />
      <Footer />
    </main>
  );
}
