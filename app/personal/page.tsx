import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import { regimeCatalog } from '@/lib/siteData';

export const metadata: Metadata = {
  title: 'Personal Plans — Execution Guidance for Solo Operators',
  description: 'Practical execution layer for solo operators and small teams. $19-$199/month for 1-8 seats with offline-first operation.',
  openGraph: {
    title: 'Personal Plans | Reality Anchors',
    description: 'Execution guidance for solo operators and small teams — fewer errors, cleaner handoffs, path to scale.',
  },
};


const personalRegimes = regimeCatalog.filter((regime) => ['Core', 'Pro'].includes(regime.tier)).slice(0, 3);

const features = [
  { cap: 'Manual job entry', inc: true, note: 'First-class for every plan.' },
  { cap: 'Photo import + OCR assist', inc: true, note: 'Optional import with manual verification.' },
  { cap: 'Cut + bend execution guidance', inc: true, note: 'Step sequence, counters, and hold points.' },
  { cap: 'Offline-first operation', inc: true, note: 'Works on device; sync when connected.' },
  { cap: 'Progressive upgrade path', inc: true, note: 'Move from personal to commercial workflows without rework.' },
];

const pricingTiers = [
  {
    tier: 'Solo',
    monthly: '$19',
    includes: '1 operator seat, core execution workflows, personal job history',
    fit: 'Independent tradesperson or side business',
  },
  {
    tier: 'Studio',
    monthly: '$79',
    includes: 'Up to 3 seats, shared templates, QA checkpoints, exportable work logs',
    fit: 'Small shop standardizing repeatable work',
  },
  {
    tier: 'Crew',
    monthly: '$199',
    includes: 'Up to 8 seats, supervisor view, calibration packs, onboarding support',
    fit: 'Growing team preparing for commercial-grade operations',
  },
];

export default function PersonalPage() {
  return (
    <main id="main-content" className="pt-20">
      {/* Page header */}
      <section className="py-16 border-b border-line">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Solutions / Personal</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-txt mb-5 leading-tight">Personal</h1>
          <p className="text-xl text-muted max-w-2xl leading-relaxed">
            A practical execution layer for solo operators and small teams that need fewer errors, cleaner handoffs, and a clear path into larger-scale deployments.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {['$19–$199/month', 'Built for 1–8 seats', 'Scales into Commercial'].map((t) => (
              <span key={t} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-line text-muted">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-4">Who it&apos;s for</h2>
            <ul className="flex flex-col gap-2.5">
              {['Independent operators', 'Two-to-eight person fabrication crews', 'Shops replacing whiteboards and ad-hoc notes', 'Teams that want to graduate into commercial operations'].map((i) => (
                <li key={i} className="flex gap-3 text-sm text-muted">
                  <span className="text-accent mt-0.5">›</span>{i}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-4">What it solves</h2>
            <ul className="flex flex-col gap-2.5">
              {['Reduces rework from missed bends, mis-reads, and sequence drift', 'Creates repeatable operator behavior without heavy SOP overhead', 'Captures execution proof that can feed customer updates and QA reviews', 'Establishes workflow discipline before moving into multi-project environments'].map((i) => (
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
            <p className="text-xs text-muted/60 mt-4">Need more than 8 seats, cross-project rollups, or formal compliance controls? Move to Commercial or Industrial packaging without changing your bench workflow foundation.</p>
          </div>
        </div>
      </section>

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

      <section className="py-8 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-5">Feature surface</h2>
            <div className="overflow-x-auto">
              <table className="ra-table">
                <thead>
                  <tr><th>Capability</th><th>Included</th><th>Notes</th></tr>
                </thead>
                <tbody>
                  {features.map((f) => (
                    <tr key={f.cap}>
                      <td>{f.cap}</td>
                      <td>
                        <span className="text-green-400 font-semibold text-sm">{f.inc ? 'Yes' : '—'}</span>
                      </td>
                      <td className="text-muted text-sm">{f.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <LeadForm id="contact" />
      <Footer />
    </main>
  );
}
