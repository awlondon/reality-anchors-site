import type { Metadata } from 'next';
import Link from 'next/link';
import MarginImpactCalculator from './MarginImpactCalculator';

export const metadata: Metadata = {
  title: 'Margin Impact Calculator — Quantify EBITDA Uplift',
  description: 'Interactive tool to model the EBITDA impact of structured execution validation across material, labor, throughput, and oversight costs.',
  alternates: { canonical: '/margin-impact/' },
  openGraph: {
    title: 'Margin Impact Calculator | Reality Anchors',
    description: 'Quantify the EBITDA impact of execution validation for your fabrication operation.',
  },
};

export default function MarginImpactPage() {
  return (
    <main id="main-content" className="min-h-screen bg-bg text-txt pt-20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight">Fabrication Margin Impact Model</h1>
          <p className="mt-3 text-muted max-w-2xl">
            Quantify the EBITDA impact of structured execution validation across material, labor, throughput, and oversight costs.
          </p>
        </header>

        <MarginImpactCalculator />

        {/* CTA */}
        <div className="mt-14 bg-white rounded-xl border border-neutral-200 p-8 text-center">
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">Ready to validate these numbers?</h2>
          <p className="text-neutral-600 text-sm mb-6 max-w-md mx-auto">
            Share your model with our team for a scoped assessment against your actual shop data — no commitment required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/commercial/#contact"
              className="px-6 py-3 rounded-lg bg-black hover:bg-neutral-800 text-white text-sm font-semibold transition-all hover:-translate-y-px hover:shadow-lg"
            >
              Request a scoped assessment
            </Link>
            <Link
              href="/calculator/"
              className="px-6 py-3 rounded-lg border border-neutral-200 hover:border-neutral-400 text-neutral-700 text-sm font-medium transition-all"
            >
              ← Back to Quick Estimate
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
