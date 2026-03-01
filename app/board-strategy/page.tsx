import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import PhotoBackground from '@/components/PhotoBackground';
import TestimonialBreak from '@/components/TestimonialBreak';
import { getTestimonialsForPage } from '@/data/testimonials';
import { EbitdaWaterfall, ArrRamp, ScrapSensitivity } from './Charts';

export const metadata: Metadata = {
  title: 'Board-Level Strategic Narrative — Completing the Digital Fabrication Stack',
  description: 'Executive narrative on why execution-layer validation is inevitable fabrication infrastructure, including EBITDA uplift, SaaS capture strategy, and 5-year ARR ramp framing.',
  openGraph: {
    title: 'Board-Level Strategic Narrative | Reality Anchors',
    description: 'Executive narrative on execution-layer validation as inevitable fabrication infrastructure.',
  },
};

const testimonial = getTestimonialsForPage('board-strategy').find((t) => t.id === 'it-director-multisite')!;

export default function BoardStrategyPage() {
  return (
    <main id="main-content" className="pt-20">
      <section className="relative overflow-hidden py-16 border-b border-line">
        <PhotoBackground src="/images/boardroom-strategy.jpg" opacity={0.12} position="center 30%" />
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Executive Brief · Fabrication Strategy</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-txt mb-5 leading-tight">Completing the Digital Fabrication Stack</h1>
          <p className="text-xl text-muted max-w-3xl leading-relaxed">
            Planning systems digitized intent. Execution remains the final under-digitized layer. Reality Anchors is execution infrastructure that validates physical work before irreversible actions occur.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/commercial/#contact" className="px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px">
              Discuss strategic integration
            </Link>
            <Link href="/margin-impact/" className="px-5 py-2.5 rounded-lg border border-line hover:border-accent/40 text-txt text-sm font-semibold transition-all">
              Review value inputs
            </Link>
          </div>
        </div>
      </section>

      <div className="relative overflow-hidden">
        <PhotoBackground src="/images/structural-steel.jpg" opacity={0.04} gradient="from-bg/95 via-bg/90 to-bg/95" position="center 50%" />
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-14 flex flex-col gap-8">
        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">Executive Summary</h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            The fabrication software stack has matured in estimating, detailing, scheduling, procurement, and reporting. The remaining structural gap is execution validation at the workstation.
          </p>
          <p className="text-sm text-muted leading-relaxed">
            This is not incremental tooling. It is the next infrastructure layer: connecting digital intent to verifiable physical outcomes and returning clean feedback data upstream.
          </p>
        </section>

        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">Why Execution Control Is Inevitable</h2>
          <ul className="flex flex-col gap-2.5 text-sm text-muted">
            {[
              'Digitization in complex industries consistently moves from planning to execution control.',
              'Material alteration is irreversible; prevention economics dominate correction economics.',
              'Margin pressure and labor variability make execution variance financially intolerable.',
              'Planning-only digital threads remain probabilistic without execution confirmation.',
            ].map((item) => (
              <li key={item} className="flex gap-3"><span className="text-accent">›</span>{item}</li>
            ))}
          </ul>
        </section>

        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">Strategic Implications for ERP & Detailing Leaders</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Without execution validation</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted">
                {['Limited margin influence', 'Incomplete digital-thread narrative', 'Lower differentiation at the shop floor', 'Higher vulnerability to execution-layer entrants'].map((i) => (
                  <li key={i} className="flex gap-3"><span className="text-accent">›</span>{i}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">With execution validation</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted">
                {['Verified outcomes feed planning refinement', 'Higher data fidelity across modules', 'Stronger retention via workflow embedding', 'Clear, board-level ROI narrative'].map((i) => (
                  <li key={i} className="flex gap-3"><span className="text-accent">›</span>{i}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">EBITDA Uplift Framing (Representative Mid-Size Fabricator)</h2>
          <p className="text-sm text-muted mb-5">
            Illustrative assumptions: $40M revenue, 8% EBITDA margin, 25,000 tons annual throughput, $850/ton steel cost, 8% baseline scrap.
          </p>
          <div className="table-scroll-wrapper overflow-x-auto mb-6">
            <table className="ra-table">
              <thead><tr><th>Driver</th><th>Illustrative impact</th><th>Annual EBITDA effect</th></tr></thead>
              <tbody>
                <tr><td>Scrap reduction</td><td>8.0% → 6.5% (1.5 pts)</td><td className="font-mono text-accent-2">~$319k</td></tr>
                <tr><td>Labor rework reduction</td><td>40% reduction on preventable rework labor</td><td className="font-mono text-accent-2">~$96k</td></tr>
                <tr><td>Throughput/capacity lift</td><td>2% extra capacity, 20% contribution margin</td><td className="font-mono text-accent-2">~$160k</td></tr>
                <tr><td>Total</td><td>Direct annual uplift</td><td className="font-mono text-txt">~$575k</td></tr>
              </tbody>
            </table>
          </div>
          <EbitdaWaterfall />
          <p className="text-sm text-muted mt-4">
            EBITDA moves from approximately <span className="font-mono text-txt">$3.2M</span> to <span className="font-mono text-txt">$3.775M</span> (8.0% → 9.4% margin), or ~17–18% EBITDA uplift.
          </p>
        </section>

        <TestimonialBreak
          id={testimonial.id}
          quote={testimonial.quote}
          attribution={testimonial.attribution}
          company={testimonial.company}
          backgroundSrc={testimonial.backgroundSrc}
        />

        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">SaaS Pricing Capture Strategy (Value Extraction Range)</h2>
          <p className="text-sm text-muted mb-5">
            Based on ~<span className="font-mono text-txt">$575k</span> annual customer EBITDA uplift, sustainable early capture is typically <span className="font-mono text-txt">8–15%</span> of created value to preserve adoption velocity and procurement acceptance.
          </p>
          <div className="table-scroll-wrapper overflow-x-auto mb-5">
            <table className="ra-table">
              <thead><tr><th>Scenario</th><th>Annual price</th><th>Capture of value</th><th>Customer ROI multiple</th></tr></thead>
              <tbody>
                <tr><td>Conservative (land)</td><td className="font-mono text-accent-2">$46k</td><td className="font-mono">8%</td><td className="font-mono">~12.5×</td></tr>
                <tr><td>Base (steady state)</td><td className="font-mono text-accent-2">$69k</td><td className="font-mono">12%</td><td className="font-mono">~8.3×</td></tr>
                <tr><td>Aggressive (scaled proof)</td><td className="font-mono text-accent-2">$86k</td><td className="font-mono">15%</td><td className="font-mono">~6.7×</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted/70">
            Practical band for most facilities: <span className="font-mono text-txt">$60k–$75k/year</span> once pilot proof is established.
          </p>
        </section>

        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">5-Year Investor ARR Ramp (Base Case)</h2>
          <ArrRamp />
          <p className="text-sm text-muted mb-5">
            Model assumptions: <span className="font-mono text-txt">$70k ACV</span> per facility, early churn moderation, and net revenue retention expansion as execution workflows embed into daily operations.
          </p>
          <div className="table-scroll-wrapper overflow-x-auto mb-5">
            <table className="ra-table">
              <thead><tr><th>Year</th><th>Facilities</th><th>ARR</th><th>Ramp note</th></tr></thead>
              <tbody>
                <tr><td className="font-mono">1</td><td className="font-mono">10</td><td className="font-mono text-accent-2">$0.7M</td><td>Proof and controlled expansion</td></tr>
                <tr><td className="font-mono">2</td><td className="font-mono">35</td><td className="font-mono text-accent-2">$2.4M</td><td>Category establishment</td></tr>
                <tr><td className="font-mono">3</td><td className="font-mono">95</td><td className="font-mono text-accent-2">$6.9M</td><td>Regional scaling</td></tr>
                <tr><td className="font-mono">4</td><td className="font-mono">220</td><td className="font-mono text-accent-2">$16.5M</td><td>Enterprise penetration</td></tr>
                <tr><td className="font-mono">5</td><td className="font-mono">420</td><td className="font-mono text-txt">$32.4M</td><td>Category consolidation</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted">
            Illustrative Year-5 valuation bands at ARR multiples: <span className="font-mono text-txt">6× = $194M</span>, <span className="font-mono text-txt">8× = $259M</span>, <span className="font-mono text-txt">10× = $324M</span>, <span className="font-mono text-txt">12× = $389M</span>.
          </p>
        </section>

        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">Sensitivity: Scrap Improvement vs EBITDA</h2>
          <div className="table-scroll-wrapper overflow-x-auto mb-4">
            <table className="ra-table">
              <thead><tr><th>Absolute scrap reduction</th><th>Estimated EBITDA uplift</th></tr></thead>
              <tbody>
                <tr><td className="font-mono">1.0 pt</td><td className="font-mono text-accent-2">~$212k</td></tr>
                <tr><td className="font-mono">1.5 pts</td><td className="font-mono text-accent-2">~$319k</td></tr>
                <tr><td className="font-mono">2.0 pts</td><td className="font-mono text-accent-2">~$425k</td></tr>
              </tbody>
            </table>
          </div>
          <ScrapSensitivity />
          <p className="text-xs text-muted/70 mt-4">Illustrative ranges; final results depend on facility mix, throughput, workforce patterns, and baseline discipline.</p>
        </section>

        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">Board-Level Conclusion</h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            Execution validation is margin-expansion infrastructure, not optional tooling. It improves cost structure, throughput predictability, compliance traceability, and planning accuracy simultaneously.
          </p>
          <p className="text-sm text-muted leading-relaxed">
            The strategic question is not whether execution digitizes. It is who owns the execution layer that anchors the rest of the fabrication stack.
          </p>
        </section>
      </div>
      </div>

      <Footer />
    </main>
  );
}
