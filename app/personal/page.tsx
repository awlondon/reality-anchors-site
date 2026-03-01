import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import PhotoBackground from '@/components/PhotoBackground';
import TestimonialBreak from '@/components/TestimonialBreak';
import { regimeCatalog } from '@/lib/siteData';
import { getTestimonialsForPage } from '@/data/testimonials';

export const metadata: Metadata = {
  title: 'Personal Plans — Execution Guidance for Solo Operators',
  description: 'Practical execution layer for solo operators and small teams. $49-$349/month for 1-8 seats with offline-first operation.',
  openGraph: {
    title: 'Personal Plans | Reality Anchors',
    description: 'Execution guidance for solo operators and small teams — fewer errors, cleaner handoffs, path to scale.',
  },
};


const personalRegimes = regimeCatalog.filter((regime) => ['Core', 'Pro'].includes(regime.tier)).slice(0, 3);

const features = [
  { cap: 'Manual job entry', note: 'First-class for every plan.' },
  { cap: 'Photo import + OCR assist', note: 'Optional import with manual verification.' },
  { cap: 'Cut + bend execution guidance', note: 'Step sequence, counters, and hold points.' },
  { cap: 'Offline-first operation', note: 'Works on device; sync when connected.' },
  { cap: 'Progressive upgrade path', note: 'Transition to Commercial without rework or data migration.' },
];

const pricingTiers = [
  {
    tier: 'Solo',
    monthly: '$49',
    includes: '1 operator seat, core execution workflows, personal job history',
    fit: 'Independent tradesperson or side business',
  },
  {
    tier: 'Studio',
    monthly: '$149',
    includes: 'Up to 3 seats, shared templates, QA checkpoints, exportable work logs',
    fit: 'Small shop standardizing repeatable work',
  },
  {
    tier: 'Crew',
    monthly: '$349',
    includes: 'Up to 8 seats, supervisor view, calibration packs, onboarding support',
    fit: 'Growing team preparing for commercial-grade operations',
  },
];

const testimonial = getTestimonialsForPage('personal')[0]!;

export default function PersonalPage() {
  return (
    <main id="main-content" className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Reality Anchors Personal',
            description: 'Execution guidance for solo operators and small teams — fewer errors, cleaner handoffs, path to scale.',
            url: 'https://ra.primarydesignco.com/personal/',
            brand: { '@type': 'Organization', name: 'Reality Anchors Limited' },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'AUD',
              lowPrice: '49',
              highPrice: '349',
              offerCount: 3,
            },
          }),
        }}
      />
      {/* Page header */}
      <section className="relative overflow-hidden py-16 border-b border-line">
        <PhotoBackground src="/images/workshop-personal.jpg" opacity={0.15} position="center 60%" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Solutions / Personal</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-txt mb-5 leading-tight">Personal</h1>
          <p className="text-xl text-muted max-w-2xl leading-relaxed">
            A practical execution layer for solo operators and small teams that need fewer errors, cleaner handoffs, and a clear path into larger-scale deployments.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {['$49–$349/month', 'Built for 1–8 seats', 'Scales into Commercial'].map((t) => (
              <span key={t} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-line text-muted">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16">
        <PhotoBackground src="/images/operator-work.jpg" opacity={0.06} gradient="from-bg/95 via-bg/85 to-bg/95" position="center 50%" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-4">Who it&apos;s for</h2>
            <ul className="flex flex-col gap-2.5">
              {['Independent operators', 'Small fabrication crews (2–8 people)', 'Shops replacing whiteboards and ad-hoc notes', 'Teams building toward commercial-grade operations'].map((i) => (
                <li key={i} className="flex gap-3 text-sm text-muted">
                  <span className="text-accent mt-0.5">›</span>{i}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-4">What it solves</h2>
            <ul className="flex flex-col gap-2.5">
              {['Cuts rework from missed bends, mis-reads, and sequence drift', 'Builds repeatable operator habits without heavy SOP overhead', 'Captures execution proof for customer updates and QA reviews', 'Establishes workflow discipline before scaling into multi-project work'].map((i) => (
                <li key={i} className="flex gap-3 text-sm text-muted">
                  <span className="text-accent mt-0.5">›</span>{i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-8 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-2">Personal SaaS plans</h2>
            <p className="text-muted text-sm mb-6">
              Personal pricing is seat-based so small teams can start quickly, then transition into Commercial plans without retraining or data migration. Every tier includes the same workflow foundation; higher tiers add coordination and governance.
            </p>
            <div className="overflow-x-auto">
              <table className="ra-table">
                <thead>
                  <tr><th>Tier</th><th>Monthly</th><th>Includes</th><th>Intended fit</th></tr>
                </thead>
                <tbody>
                  {pricingTiers.map((tier) => (
                    <tr key={tier.tier}>
                      <td>{tier.tier}</td>
                      <td className="font-mono text-accent-2">{tier.monthly}</td>
                      <td className="text-muted text-sm">{tier.includes}</td>
                      <td className="text-muted text-sm">{tier.fit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 border border-line/50 rounded-xl bg-bg/50 px-5 py-4">
              <h3 className="text-sm font-semibold text-txt mb-3">What the savings look like</h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted mb-1">Solo · 200 t/yr</p>
                  <p className="font-mono text-accent-2 text-lg font-semibold">~$5k</p>
                  <p className="text-[11px] text-muted">annual savings · 9× ROI</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted mb-1">Studio · 800 t/yr</p>
                  <p className="font-mono text-accent-2 text-lg font-semibold">~$21k</p>
                  <p className="text-[11px] text-muted">annual savings · 12× ROI</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted mb-1">Crew · 3,000 t/yr</p>
                  <p className="font-mono text-accent-2 text-lg font-semibold">~$79k</p>
                  <p className="text-[11px] text-muted">annual savings · 19× ROI</p>
                </div>
              </div>
              <p className="text-[10px] text-muted/50 mt-3 text-center">Illustrative estimates based on $850/ton steel, 8% baseline scrap, 1.5pt improvement. Actual results vary by operation.</p>
            </div>
            <div className="mt-5 border-t border-line pt-4">
              <p className="text-xs text-muted/70"><strong className="text-txt">Ready for more?</strong> Crew gets you started. When you need audit logs, multi-bench coordination, or formal compliance controls, <Link href="/commercial/" className="text-accent hover:text-blue-400 font-semibold">Commercial</Link> picks up where Crew leaves off — with your existing workflows intact.</p>
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

      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-lg font-semibold text-txt mb-4">Curated program examples</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {personalRegimes.map((regime) => (
              <article key={regime.id} className="min-w-[290px] border border-line bg-card rounded-2xl p-5">
                <p className="text-[11px] uppercase tracking-wide text-accent mb-2">{regime.tier}</p>
                <h3 className="text-base font-semibold text-txt">{regime.title}</h3>
                <p className="text-sm text-muted mt-2">{regime.description}</p>
                <p className="text-sm text-accent-2 font-semibold mt-3">{regime.metrics[0]?.label}: {regime.metrics[0]?.value}</p>
                <Link href={regime.learnMoreHref} className="inline-block mt-3 text-sm font-semibold text-accent hover:text-blue-400">
                  Quick view →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-8 pb-16">
        <PhotoBackground src="/images/steel-closeup.jpg" opacity={0.05} gradient="from-bg/95 via-bg/90 to-bg/95" position="center" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-5">Included in every plan</h2>
            <div className="overflow-x-auto">
              <table className="ra-table">
                <thead>
                  <tr><th>Capability</th><th>Details</th></tr>
                </thead>
                <tbody>
                  {features.map((f) => (
                    <tr key={f.cap}>
                      <td>{f.cap}</td>
                      <td className="text-muted text-sm">{f.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <LeadForm
        id="contact"
        heading="Get started with Personal"
        description="Tell us about your operation and we'll help you pick the right plan. No commitment required."
      />
      <Footer />
    </main>
  );
}
