import type { Metadata } from 'next';
import Link from 'next/link';
import { workcells, type WorkcellStatus } from '@/data/workcells';
import { getTestimonialsForPage } from '@/data/testimonials';
import TestimonialBreak from '@/components/TestimonialBreak';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Industries — Fabrication Workcells | Reality Anchors',
  description:
    'Reality Anchors execution validation across rebar, plate, pipe, and precast workcells. One execution layer, every fabrication type.',
  alternates: { canonical: '/industries/' },
};

const STATUS_LABEL: Record<WorkcellStatus, string> = {
  live: 'Live',
  'coming-soon': 'Coming Soon',
  adjacent: 'Exploring',
};

const STATUS_STYLE: Record<WorkcellStatus, string> = {
  live: 'bg-green-500/15 text-green-400 border-green-500/30',
  'coming-soon': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  adjacent: 'bg-muted/10 text-muted border-line',
};

export default function IndustriesPage() {
  const testimonials = getTestimonialsForPage('industries');

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Reality Anchors Fabrication Workcells',
            description:
              'Industrial fabrication workcells supported by the Reality Anchors execution validation platform.',
            itemListElement: workcells.map((w, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: w.name,
              description: w.description,
              url:
                w.status === 'live'
                  ? `https://realityanchorsltd.com/industries/${w.slug}/`
                  : undefined,
            })),
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-bg pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted mb-4">
            Workcell Applicability
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight text-txt max-w-3xl">
            One execution layer. Every workcell.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
            The same validation loop &mdash; Guide, Validate, Record &mdash; applies wherever
            irreversible fabrication actions happen. Rebar cut &amp; bend is the flagship deployment.
            Adjacent workcells follow the same pattern.
          </p>
        </div>
      </section>

      {/* ── Core loop (brief) ─────────────────────────────────── */}
      <section className="bg-bg-2 border-y border-line py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 'Guide',
                copy: 'Turn specifications into step-by-step workstation actions. Operators know what to do next.',
              },
              {
                step: 'Validate',
                copy: 'Each step is checked against the live job and machine profile before it becomes irreversible.',
              },
              {
                step: 'Record',
                copy: 'Every decision logged and reproducible. Clean data flows upstream to planning and QA.',
              },
            ].map(({ step, copy }) => (
              <div key={step}>
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-accent mb-2">
                  {step}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted/70">
            <Link href="/platform/" className="text-accent hover:text-accent-2 transition-colors">
              How the platform works &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* ── Workcell grid ─────────────────────────────────────── */}
      <section className="bg-bg py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-txt mb-3">
            Where it applies today &mdash; and next
          </h2>
          <p className="text-muted mb-12 max-w-2xl">
            Each workcell is a specific fabrication context where the execution layer is configured,
            deployed, and validated independently.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {workcells.map((wc) => (
              <div
                key={wc.id}
                className={`relative border rounded-xl p-6 transition-all ${
                  wc.status === 'live'
                    ? 'border-line bg-card hover:border-accent/40'
                    : 'border-line/50 bg-card/50'
                }`}
              >
                {/* Status badge */}
                <span
                  className={`inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border mb-4 ${STATUS_STYLE[wc.status]}`}
                >
                  {STATUS_LABEL[wc.status]}
                </span>

                <h3
                  className={`text-xl font-semibold mb-2 ${
                    wc.status === 'live' ? 'text-txt' : 'text-muted'
                  }`}
                >
                  {wc.name}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-4">{wc.description}</p>

                {/* Live workcell: metrics + CTA */}
                {wc.status === 'live' && wc.metrics.length > 0 && (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {wc.metrics.map((m) => (
                        <div
                          key={m.label}
                          className="border border-line/70 bg-bg/50 rounded-lg px-3 py-2"
                        >
                          <div className="text-base font-bold text-accent-2 font-mono">
                            {m.value}
                          </div>
                          <div className="text-[11px] text-muted">{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={`/industries/${wc.slug}/`}
                      className="inline-block text-sm font-semibold text-accent hover:text-accent-2 transition-colors"
                    >
                      Explore {wc.shortName} workcell &rarr;
                    </Link>
                  </>
                )}

                {/* Coming-soon / adjacent: interest CTA */}
                {wc.status !== 'live' && (
                  <Link
                    href="#contact"
                    className="inline-block text-sm text-muted hover:text-txt transition-colors"
                  >
                    Notify me when available &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ───────────────────────────────────────── */}
      {testimonials[0] && (
        <TestimonialBreak
          id={testimonials[0].id}
          quote={testimonials[0].quote}
          attribution={testimonials[0].attribution}
          company={testimonials[0].company}
          backgroundSrc={testimonials[0].backgroundSrc}
        />
      )}

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-bg py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-txt mb-4">
            Start with one workcell. Expand as you validate.
          </h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">
            Most deployments begin with rebar cut &amp; bend &mdash; the highest-scrap, highest-volume
            workcell in most fabrication yards. The platform extends from there.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/industries/rebar-cut-bend/"
              className="px-7 py-4 rounded-lg bg-accent hover:bg-blue-500 text-white font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/25"
            >
              See Rebar Cut &amp; Bend
            </Link>
            <Link
              href="/calculator/"
              className="px-7 py-4 rounded-lg border border-white/25 hover:border-white/50 hover:bg-white/6 text-txt font-semibold transition-all hover:-translate-y-0.5"
            >
              Estimate Savings
            </Link>
          </div>
        </div>
      </section>

      <LeadForm
        heading="Interested in a workcell not yet listed?"
        description="Tell us about your fabrication context and we'll assess applicability."
      />
      <Footer />
    </main>
  );
}
