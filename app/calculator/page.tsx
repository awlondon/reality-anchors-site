import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import PhotoBackground from '@/components/PhotoBackground';
import QuickEstimateCalculator from './QuickEstimateCalculator';

export const metadata: Metadata = {
  title: 'Quick Estimate — Scrap Recovery Calculator',
  description: 'Three sliders, instant results. Model your facility\'s annual scrap recovery and EBITDA impact in under 60 seconds.',
  alternates: { canonical: '/calculator/' },
  openGraph: {
    title: 'Quick Estimate Calculator | Reality Anchors',
    description: 'Estimate your fabrication scrap savings in under 60 seconds with three simple inputs.',
  },
};

export default function CalculatorPage() {
  return (
    <main id="main-content" className="pt-20">
      {/* Header */}
      <section className="relative overflow-hidden py-16 border-b border-line">
        <PhotoBackground src="/images/cnc-precision.jpg" opacity={0.12} position="center 50%" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Tools</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-txt mb-5 leading-tight">
            Quick Estimate
          </h1>
          <p className="text-xl text-muted max-w-2xl leading-relaxed">
            Three inputs, instant results. See how scrap reduction translates to material savings and EBITDA impact for your operation.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {['60-second estimate', 'Print to PDF', 'No account required'].map((t) => (
              <span key={t} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-line text-muted">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="relative overflow-hidden py-14">
        <PhotoBackground src="/images/methodology-measurement.jpg" opacity={0.04} gradient="from-bg/95 via-bg/90 to-bg/95" position="center 60%" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <QuickEstimateCalculator />

          {/* Upgrade prompt */}
          <div className="mt-10 border border-line bg-card rounded-2xl p-7 text-center">
            <h2 className="text-lg font-semibold text-txt mb-2">Need more control?</h2>
            <p className="text-muted text-sm mb-5 max-w-md mx-auto">
              The full Margin Impact Model lets you tune labor costs, rework rates, throughput improvement, and oversight risk — with a detailed EBITDA waterfall breakdown.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/margin-impact/"
                className="px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px"
              >
                Open full EBITDA model
              </Link>
              <Link
                href="/commercial/#contact"
                className="px-5 py-2.5 rounded-lg border border-line hover:border-accent/40 text-txt text-sm font-semibold transition-all"
              >
                Request a scoped assessment
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
