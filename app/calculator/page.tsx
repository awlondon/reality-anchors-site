import type { Metadata } from 'next';
import QuickEstimateCalculator from './QuickEstimateCalculator';

export const metadata: Metadata = {
  title: 'Scrap Recovery Estimator',
  description:
    'Estimate your annual material savings from structured fabrication execution. Adjust tonnage, scrap rate, and material cost — results update live.',
  alternates: { canonical: '/calculator/' },
};

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-bg text-txt pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-xs uppercase tracking-widest text-muted mb-3">Quick Estimate</p>
        <h1 className="text-3xl font-semibold mb-2 leading-tight">
          Scrap Recovery Estimator
        </h1>
        <p className="text-muted mb-10 max-w-xl leading-relaxed">
          Adjust three inputs. Results update live. Based on an observed median 1.5-point scrap
          rate reduction across Reality Anchors deployments.
        </p>

        <QuickEstimateCalculator />
      </div>
    </main>
  );
}
