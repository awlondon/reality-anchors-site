import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import { regimeCatalog } from '@/lib/siteData';

export const metadata: Metadata = {
  title: 'Industrial',
  description: 'High-volume environments with traceability, calibration governance, and integration readiness.',
};

const industrialRegimes = regimeCatalog.filter((regime) => ['machine-calibration', 'ai-governance', 'ar-execution'].includes(regime.id));

export default function IndustrialPage() {
  return (
    <main className="pt-20">
      <section className="py-16 border-b border-line">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Solutions / Industrial</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-txt mb-5 leading-tight">Industrial</h1>
          <p className="text-xl text-muted max-w-2xl leading-relaxed">
            High-volume environments need an execution layer that increases planning-system fidelity, traceability, and margin control at scale.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {['Throughput', 'Traceability', 'Calibration', 'Integration'].map((t) => (
              <span key={t} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-line text-muted">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-4">Industrial outcomes</h2>
            <ul className="flex flex-col gap-2.5">
              {['Run-level scrap accounting and reuse inventory', 'Operator and station traceability', 'Versioned machine calibration profiles', 'QA exports suitable for internal audits', 'Standardized execution across shifts'].map((i) => (
                <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
              ))}
            </ul>
          </div>
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-4">Integration model</h2>
            <ul className="flex flex-col gap-2.5 mb-4">
              {['Imports from digital schedules (when available)', 'Structured exports for ERP / QA systems', 'Role-based access and immutable event logs', 'Device fleet management constraints'].map((i) => (
                <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
              ))}
            </ul>
            <p className="text-xs text-muted/70">Designed to complement ERP and QA systems with reliable execution records from the workstation.</p>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-3">Strategic fit for detailing and ERP leaders</h2>
            <p className="text-muted text-sm mb-6">
              Reality Anchors complements ERP and detailing platforms by validating physical execution and returning clean feedback data that improves planning accuracy over time.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Operational controls</h3>
                <ul className="flex flex-col gap-2">
                  {['Machine profiles (versioned)', 'Programs (released only after QA)', 'Step validation checkpoints', 'Immutable event streams (optional)'].map((i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Operational exports</h3>
                <ul className="flex flex-col gap-2">
                  {['Per-run reports (scrap, time, exceptions)', 'Per-job trace logs (who/what/when)', 'Exception registry (drift, overrides)', 'Calibration drift summaries'].map((i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted"><span className="text-accent">›</span>{i}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-3">Commercial structure for industrial deployments</h2>
            <p className="text-muted text-sm mb-4">
              Enterprise agreements are structured around facility count, governance requirements, integration scope, and compliance documentation needs.
            </p>
            <Link href="#contact" className="inline-flex px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px">
              Schedule a technical review
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-7">
            <h2 className="text-lg font-semibold text-txt mb-3">Industrial program set</h2>
            <p className="text-muted text-sm mb-5">Machine calibration support, traceable execution, and compliance-ready controls for ERP-connected plants.</p>
            <div className="grid md:grid-cols-3 gap-4">
              {industrialRegimes.map((regime) => (
                <article key={regime.id} className="rounded-xl border border-line/80 bg-bg/60 p-4">
                  <h3 className="text-sm font-semibold text-txt">{regime.title}</h3>
                  <p className="text-xs text-muted mt-2">{regime.metrics[1]?.label}: {regime.metrics[1]?.value}</p>
                  <Link href={regime.learnMoreHref} className="inline-block mt-3 text-xs font-semibold text-accent hover:text-blue-400">Details →</Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LeadForm id="contact" />
      <Footer />
    </main>
  );
}
