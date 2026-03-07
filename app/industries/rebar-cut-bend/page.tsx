import type { Metadata } from 'next';
import Link from 'next/link';
import VideoShowcase from '@/components/VideoShowcase';
// TODO: Re-enable with real testimonials
// import TestimonialBreak from '@/components/TestimonialBreak';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';
// import { getTestimonialsForPage } from '@/data/testimonials';
import { getWorkcellBySlug } from '@/data/workcells';
import { getRegimesByWorkcell } from '@/lib/siteData';

const workcell = getWorkcellBySlug('rebar-cut-bend')!;
const regimes = getRegimesByWorkcell('rebar-cut-bend');

export const metadata: Metadata = {
  title: 'Rebar Cut & Bend Software — Execution Validation for Fabrication Yards | Reality Anchors',
  description:
    'AI-guided rebar cut and bend validation software. Reduce scrap, eliminate rework, and build traceable execution records. Designed for fabrication yards running on specifications.',
  alternates: { canonical: '/industries/rebar-cut-bend/' },
  openGraph: {
    title: 'Rebar Cut & Bend Software | Reality Anchors',
    description:
      'AI-guided rebar fabrication execution — every cut measured, every bend verified, every ton accounted for.',
  },
};

export default function RebarCutBendPage() {
  // const testimonials = getTestimonialsForPage('industries:rebar-cut-bend');

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Reality Anchors — Rebar Cut & Bend',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web, iOS, Android',
            description: workcell.description,
            url: 'https://realityanchorsltd.com/industries/rebar-cut-bend/',
            provider: {
              '@type': 'Organization',
              name: 'Reality Anchors',
              url: 'https://realityanchorsltd.com',
            },
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-bg pt-32 pb-16 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={workcell.heroImage}
          alt=""
          aria-hidden="true"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/60 to-bg pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted mb-4">
            Flagship Workcell
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight text-txt max-w-3xl">
            Every Cut Measured. Every Bend Verified. Every Ton Accounted For.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
            {workcell.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/calculator/"
              className="px-7 py-4 rounded-lg bg-accent hover:bg-blue-500 text-white font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/25"
            >
              Estimate Your Savings
            </Link>
            <Link
              href="#contact"
              className="px-7 py-4 rounded-lg border border-white/25 hover:border-white/50 hover:bg-white/6 text-txt font-semibold transition-all hover:-translate-y-0.5"
            >
              Talk to a Representative
            </Link>
          </div>

          {/* KPIs */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
            {workcell.metrics.map(({ value, label }) => (
              <div
                key={label}
                className="border border-line/70 bg-card/50 backdrop-blur-sm rounded-xl px-4 py-3"
              >
                <div className="text-xl font-bold text-accent-2 font-mono">{value}</div>
                <div className="text-xs text-muted mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visual showcase (rebar-specific SVG scenes) ────────── */}
      <VideoShowcase />

      {/* TODO: Re-enable with real testimonials */}

      {/* ── Workflow ──────────────────────────────────────────── */}
      <section className="bg-bg py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-txt mb-3">
            Four steps from cut list to audit-ready record
          </h2>
          <p className="text-muted mb-12 max-w-2xl">
            No complex integrations required. Start with manual entry and scale into automated
            workflows as your operation grows.
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {workcell.workflowSteps.map((step, i) => (
              <div key={i} className="border border-line rounded-xl p-5 bg-card">
                <div className="text-xs font-bold tracking-widest text-accent mb-3 font-mono">
                  0{i + 1}
                </div>
                <p className="text-sm text-muted leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programs deployed in rebar workcell ───────────────── */}
      <section className="bg-bg-2 border-y border-line py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-txt mb-3">
            Programs deployed in rebar cut &amp; bend
          </h2>
          <p className="text-muted mb-10 max-w-2xl">
            Each program is a validation regime tuned to a specific operational concern.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {regimes.map((regime) => (
              <div
                key={regime.id}
                className="border border-line rounded-xl p-6 bg-card hover:border-accent/40 transition-colors"
              >
                <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-muted mb-3">
                  {regime.tier}
                </span>
                <h3 className="text-lg font-semibold text-txt mb-2">{regime.title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-4">{regime.description}</p>
                <div className="space-y-2">
                  {regime.metrics.map((m) => (
                    <div key={m.label} className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-accent-2 font-mono">{m.value}</span>
                      <span className="text-xs text-muted">{m.label}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={regime.learnMoreHref}
                  className="inline-block mt-4 text-sm text-accent hover:text-accent-2 transition-colors"
                >
                  Learn more &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Integrations ──────────────────────────────────────── */}
      <section className="bg-bg py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-txt mb-3">
            What connects to the rebar workcell
          </h2>
          <p className="text-muted mb-10 max-w-2xl">
            Reality Anchors works alongside your detailing and ERP systems &mdash; turning plans into
            verified outcomes on the shop floor.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {workcell.integrations.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 border border-line rounded-xl p-5 bg-card"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-txt font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI section ───────────────────────────────────────── */}
      <section className="bg-bg-2 border-y border-line py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-txt mb-4">
            Model the impact for your operation
          </h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">
            Use the Quick Estimate calculator to see projected material savings, labor reduction, and
            EBITDA impact based on your tonnage and scrap profile.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/calculator/"
              className="px-7 py-4 rounded-lg bg-accent hover:bg-blue-500 text-white font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/25"
            >
              Quick Estimate
            </Link>
            <Link
              href="/margin-impact/"
              className="px-7 py-4 rounded-lg border border-white/25 hover:border-white/50 hover:bg-white/6 text-txt font-semibold transition-all hover:-translate-y-0.5"
            >
              Full Margin Model
            </Link>
          </div>
        </div>
      </section>

      {/* TODO: Re-enable with real testimonials */}

      <LeadForm
        heading="See if rebar cut & bend fits your operation"
        description="Complete the form and we'll return with a fit assessment, suggested rollout scope, and an estimate of what you could save."
      />
      <Footer />
    </main>
  );
}
