import Link from 'next/link';

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 pt-24">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white border border-neutral-200 rounded-xl p-8">
          <p className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Updated tool</p>
          <h1 className="text-2xl font-semibold mb-3">This calculator has moved.</h1>
          <p className="text-neutral-600 mb-6">
            The board-oriented model is now available at the Margin Impact page.
          </p>
          <Link href="/margin-impact/" className="inline-flex bg-black text-white px-5 py-2.5 rounded-md text-sm font-medium">
            Open Margin Impact Model
          </Link>
        </div>
      </div>
    </main>
  );
}
