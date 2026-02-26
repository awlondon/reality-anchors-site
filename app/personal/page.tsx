import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';

export const metadata: Metadata = {
  title: 'Personal',
  description: 'Curated regimes for individuals and small shops. Pre-built, pre-tested, and versioned before release.',
};

const features = [
  { cap: 'Manual job entry', inc: true, note: 'First-class. Always available.' },
  { cap: 'Photo import / OCR', inc: true, note: 'Optional; always confirmable.' },
  { cap: 'Cut workflow', inc: true, note: 'Step + counter + stop logic.' },
  { cap: 'Bend workflow', inc: true, note: 'Mark positions + angles + gating.' },
  { cap: 'Offline mode', inc: true, note: 'Local-first. Sync optional.' },
];

export default function PersonalPage() {
  return (
    <main className="pt-20">
      {/* Page header */}
      <section className="py-16 border-b border-line">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Solutions / Personal</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-txt mb-5 leading-tight">Personal</h1>
          <p className="text-xl text-muted max-w-2xl leading-relaxed">
            Curated regimes for individuals and small shops. Quality-controlled modes only: pre-built, pre-tested, and versioned before release.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {['$5–$50/month', 'Curated regimes', 'Offline-first'].map((t) => (
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
              {['Individual operators', 'Training and skill reinforcement', 'Small shops wanting standardized steps', 'Anyone who prefers deterministic procedures over "feel"'].map((i) => (
                <li key={i} className="flex gap-3 text-sm text-muted">
                  <span className="text-accent mt-0.5">›</span>{i}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-4">What it solves</h2>
            <ul className="flex flex-col gap-2.5">
              {['Reduces mental math and hand transcription', 'Enforces admissibility gates (GO/NO-GO)', 'Provides consistent step sequences and counters', 'Creates a lightweight personal audit log'].map((i) => (
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
            <h2 className="text-lg font-semibold text-txt mb-2">Regime subscriptions</h2>
            <p className="text-muted text-sm mb-6">
              Regimes are curated packages: a deterministic rule set, UI flows, validation gates, and known-good calibration defaults. New regimes are released only after internal testing.
            </p>
            <div className="overflow-x-auto">
              <table className="ra-table">
                <thead>
                  <tr><th>Tier</th><th>Monthly</th><th>Includes</th></tr>
                </thead>
                <tbody>
                  <tr><td>Core</td><td className="font-mono text-accent-2">$5</td><td className="text-muted text-sm">Single workflow regime, standard validation gates</td></tr>
                  <tr><td>Pro</td><td className="font-mono text-accent-2">$20</td><td className="text-muted text-sm">Multiple regimes, saved templates, extended logging</td></tr>
                  <tr><td>Specialty</td><td className="font-mono text-accent-2">$50</td><td className="text-muted text-sm">Niche regimes, advanced constraints, priority releases</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted/60 mt-4">AR overlays are planned; not required for personal v1.</p>
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
