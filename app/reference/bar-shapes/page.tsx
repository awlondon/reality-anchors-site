import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import BarShapeGrid from '@/components/BarShapeGrid';

export const metadata: Metadata = {
  title: 'IS 2502 Bar Shapes — Cut Length Calculator & Shape Reference | Reality Anchors',
  description:
    'Interactive reference for all 11 IS 2502 bar shapes. See how each bar bends, calculate cut lengths with Table II allowances, and explore parametric shapes from Tables III, V, VI, VIII, and IX.',
  alternates: { canonical: '/reference/bar-shapes/' },
  openGraph: {
    title: 'IS 2502 Bar Shapes — Interactive Reference | Reality Anchors',
    description:
      'Explore IS 2502 bar shapes with live bending animations and cut length calculations. A free reference tool for rebar fabrication teams.',
  },
};

export default function BarShapesPage() {
  return (
    <main id="main-content" className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'IS 2502 Bar Shape Explorer',
            applicationCategory: 'ReferenceApplication',
            description:
              'Interactive reference tool for IS 2502 standard bar bending shapes with cut length calculator.',
            url: 'https://realityanchorsltd.com/reference/bar-shapes/',
            provider: {
              '@type': 'Organization',
              name: 'Reality Anchors',
              url: 'https://realityanchorsltd.com',
            },
            featureList: [
              'IS 2502 Table III, V, VI, VIII, IX shapes',
              'Parametric cut length calculator',
              'Table II hook and bend allowances',
              'Bar bending animation',
            ],
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative py-16 border-b border-line" style={{ backgroundColor: '#0C0F14' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono px-2 py-1 rounded border border-line text-muted">
              IS 2502 : 1963
            </span>
            <span className="text-xs font-mono text-muted">Reference Tool</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-txt mb-4">
            Bar Shape Explorer
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            See how your bar bends. All 11 standard shapes from IS 2502 with live cut length
            calculations and Table II allowances. Tap any shape to adjust parameters.
          </p>
        </div>
      </section>

      {/* ── Shape Grid ────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          <BarShapeGrid />
        </div>
      </section>

      {/* ── Reference Notes ───────────────────────────────────── */}
      <section className="py-12 border-t border-line">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-xl font-semibold text-txt mb-6">How cut length is calculated</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-line p-5" style={{ backgroundColor: '#141820' }}>
              <h3 className="text-sm font-semibold text-txt mb-2 font-mono">Table II — Hook & Bend Allowances</h3>
              <p className="text-sm text-muted leading-relaxed">
                Cut lengths account for material consumed in bends and hooks. IS 2502 Table II
                provides standard allowances for each bar size and steel grade combination.
                The calculator applies these automatically when you select your bar size.
              </p>
            </div>
            <div className="rounded-xl border border-line p-5" style={{ backgroundColor: '#141820' }}>
              <h3 className="text-sm font-semibold text-txt mb-2 font-mono">Table XI — Tolerances</h3>
              <p className="text-sm text-muted leading-relaxed">
                All cut lengths are rounded up to the next 25mm per IS 2502 Table XI requirements.
                This ensures bars are cut to practical lengths that accommodate site tolerances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-14 border-t border-line">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold text-txt mb-3">
            Get bend instructions on your phone
          </h2>
          <p className="text-muted mb-6 max-w-lg mx-auto">
            The Reality Anchors app gives your fabrication team step-by-step bar bending
            sequences with real-time validation — right at the bending table.
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:-translate-y-px"
            style={{ backgroundColor: '#F97316' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4" y="1" width="8" height="14" rx="1.5" />
              <line x1="7" y1="12" x2="9" y2="12" />
            </svg>
            Learn about the app
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
