import MarginImpactCalculator from './MarginImpactCalculator';

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
