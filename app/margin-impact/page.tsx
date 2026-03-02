import type { Metadata } from 'next';
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
    <main id="main-content" className="min-h-screen bg-neutral-50 text-neutral-900 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Fabrication Margin Impact Model',
            description: 'Interactive tool to model the EBITDA impact of structured execution validation across material, labor, throughput, and oversight costs.',
            url: 'https://realityanchorsltd.com/margin-impact/',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
            provider: { '@type': 'Organization', name: 'Reality Anchors Limited' },
          }),
        }}
      />
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
