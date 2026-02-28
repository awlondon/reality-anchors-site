import type { Metadata } from 'next';
import MarginImpactCalculator from './MarginImpactCalculator';

export const metadata: Metadata = {
  title: 'Margin Impact Calculator — Quantify EBITDA Uplift',
  description: 'Interactive tool to model the EBITDA impact of structured execution validation across material, labor, throughput, and oversight costs.',
  openGraph: {
    title: 'Margin Impact Calculator | Reality Anchors',
    description: 'Quantify the EBITDA impact of execution validation for your fabrication operation.',
  },
};

export default function MarginImpactPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 pt-20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight">Fabrication Margin Impact Model</h1>
          <p className="mt-3 text-neutral-600 max-w-2xl">
            Quantify the EBITDA impact of structured execution validation across material, labor, throughput, and oversight costs.
          </p>
        </header>

        <MarginImpactCalculator />
      </div>
    </main>
  );
}
