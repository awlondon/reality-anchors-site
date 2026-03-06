import type { Metadata } from 'next';
import Link from 'next/link';
import DiligenceGate from './DiligenceGate';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Technical Diligence — Reality Anchors',
  description:
    'Executive abstract and gated technical diligence package for investors, acquirers, and enterprise procurement teams evaluating Reality Anchors.',
  alternates: { canonical: '/diligence/' },
};

const ABSTRACT_SECTIONS = [
  {
    title: 'Architecture',
    content:
      'Offline-first mobile + web platform with edge inference, structured sync, and immutable event logging. Static-export marketing site backed by Firebase for lead capture and analytics. Flutter app with camera, OCR, AR, and BLE telemetry integration.',
  },
  {
    title: 'Deployment model',
    content:
      'Cloud-native SaaS with zero on-prem infrastructure. Per-facility onboarding with a 60-day validation window. Baseline metrics are modeled from published industry scrap rates — not self-reported. Subscription is value-aligned: 8\u201320% of modeled annual savings.',
  },
  {
    title: 'Unit economics',
    content:
      'Revenue model tied to measurable operational improvement (scrap reduction, labor rework avoidance, throughput uplift). No percentage-of-savings contracts. Pricing scales with benches, tonnage, and regime scope — not feature checklists.',
  },
  {
    title: 'Competitive position',
    content:
      'Positioned at the intersection of MES traceability and connected-worker guidance — specifically for irreversible fabrication actions. Not a generic SOP platform. Not a classical MES replacement. The execution layer that turns digital intent into verified physical outcomes.',
  },
  {
    title: 'Expansion vector',
    content:
      'Rebar cut & bend is the flagship workcell. The same Guide \u2192 Validate \u2192 Record loop applies to plate/press brake, pipe/tube, and precast reinforcement. Each workcell is a separately configured, independently validated regime deployment.',
  },
];

export default function DiligencePage() {
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            name: 'Reality Anchors Technical Diligence Package',
            description:
              'Executive abstract covering platform architecture, deployment model, unit economics, and competitive positioning.',
            url: 'https://realityanchorsltd.com/diligence/',
            author: {
              '@type': 'Organization',
              name: 'Reality Anchors',
            },
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-bg pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted mb-4">
            For Investors &amp; Acquirers
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight text-txt max-w-3xl">
            Technical Diligence Package
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
            Executive abstract covering platform architecture, deployment model, unit economics, and
            competitive positioning. The full package &mdash; including architecture diagrams,
            security posture, data model overview, and pilot methodology &mdash; is available on
            request.
          </p>
        </div>
      </section>

      {/* ── Executive abstract (public, indexable) ─────────────── */}
      <section className="bg-bg py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-txt mb-10">
            Executive abstract
          </h2>
          <div className="space-y-10">
            {ABSTRACT_SECTIONS.map(({ title, content }) => (
              <div key={title}>
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-accent mb-3">
                  {title}
                </h3>
                <p className="text-muted leading-relaxed">{content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gated download ────────────────────────────────────── */}
      <section id="download" className="bg-bg-2 border-y border-line py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-txt mb-4 text-center">
            Download full diligence package
          </h2>
          <p className="text-muted mb-10 text-center max-w-xl mx-auto">
            Includes architecture diagrams, security and compliance posture, data model
            documentation, validation methodology, and pilot engagement framework.
          </p>
          <DiligenceGate />
        </div>
      </section>

      {/* ── Related pages ─────────────────────────────────────── */}
      <section className="bg-bg py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-xl font-semibold text-txt mb-6">Related</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/platform/"
              className="px-5 py-3 rounded-lg border border-line hover:border-accent/40 text-sm text-muted hover:text-txt transition-colors"
            >
              Platform Architecture
            </Link>
            <Link
              href="/board-strategy/"
              className="px-5 py-3 rounded-lg border border-line hover:border-accent/40 text-sm text-muted hover:text-txt transition-colors"
            >
              Board Strategy
            </Link>
            <Link
              href="/pricing-methodology/"
              className="px-5 py-3 rounded-lg border border-line hover:border-accent/40 text-sm text-muted hover:text-txt transition-colors"
            >
              Pricing Methodology
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
