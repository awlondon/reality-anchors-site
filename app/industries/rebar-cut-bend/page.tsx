import type { Metadata } from 'next';
import Link from 'next/link';
import VideoShowcase from '@/components/VideoShowcase';
import PhotoDivider from '@/components/PhotoDivider';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';
import { getWorkcellBySlug } from '@/data/workcells';
import { getRegimesByWorkcell } from '@/lib/siteData';
import { getDividersForPage } from '@/data/photoDividers';

const workcell = getWorkcellBySlug('rebar-cut-bend')!;
const regimes = getRegimesByWorkcell('rebar-cut-bend');

export const metadata: Metadata = {
  title: 'Rebar Cut & Bend Fabrication Capture Software',
  description:
    'Calibrated capture and execution validation software for rebar cut and bend workflows. Start with one camera, expand to mixed coverage, and add LiDAR only when precision depth matters.',
  alternates: { canonical: '/industries/rebar-cut-bend/' },
  openGraph: {
    title: 'Rebar Cut & Bend Fabrication Capture Software | Reality Anchors',
    description:
      'Calibrated rebar fabrication capture with one-camera baselines, mixed-camera coverage, and optional LiDAR precision.',
  },
};

const dividers = getDividersForPage('rebar');

export default function RebarCutBendPage() {
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Reality Anchors - Rebar Cut & Bend',
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

      <section className="relative overflow-hidden bg-bg pt-32 pb-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={workcell.heroImage}
          alt=""
          aria-hidden="true"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-luminosity"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/60 to-bg" />
        <div className="relative mx-auto max-w-5xl px-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">Flagship Workcell</p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-txt md:text-6xl">
            Start with one camera. Validate every rebar run. Expand only when the workflow earns it.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{workcell.description}</p>
          <div className="mt-6 max-w-2xl rounded-2xl border border-accent/20 bg-card/70 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Reality Anchor</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Place a known object in frame and the system uses it as a ruler for everything else it validates. In the
              rebar workflow, bar size is determined from measured signals rather than user declaration alone.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/calculator/"
              className="rounded-lg bg-accent px-7 py-4 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg hover:shadow-accent/25"
            >
              Estimate Your Savings
            </Link>
            <Link
              href="#contact"
              className="rounded-lg border border-white/25 px-7 py-4 font-semibold text-txt transition-all hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/6"
            >
              Talk to a Representative
            </Link>
          </div>

          <div className="mt-14 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            {workcell.metrics.map(({ value, label }) => (
              <div key={label} className="rounded-xl border border-line/70 bg-card/50 px-4 py-3 backdrop-blur-sm">
                <div className="font-mono text-xl font-bold text-accent-2">{value}</div>
                <div className="mt-1 text-xs text-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VideoShowcase />

      {dividers[0] && <PhotoDivider {...dividers[0]} />}

      <section className="bg-bg py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-3 text-2xl font-semibold text-txt md:text-3xl">
            The capability ladder from baseline capture to precision depth
          </h2>
          <p className="mb-12 max-w-2xl text-muted">
            Start with a one-camera baseline, then add context and precision only where they create real operational
            value.
          </p>

          <div className="grid gap-6 md:grid-cols-4">
            {workcell.workflowSteps.map((step, index) => (
              <div key={step} className="rounded-xl border border-line bg-card p-5">
                <div className="mb-3 font-mono text-xs font-bold tracking-widest text-accent">0{index + 1}</div>
                <p className="text-sm leading-relaxed text-muted">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-bg-2 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-3 text-2xl font-semibold text-txt md:text-3xl">
            Programs deployed in rebar cut &amp; bend
          </h2>
          <p className="mb-10 max-w-2xl text-muted">
            Each program is a validation regime tuned to a specific operational concern.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {regimes.map((regime) => (
              <div
                key={regime.id}
                className="rounded-xl border border-line bg-card p-6 transition-colors hover:border-accent/40"
              >
                <span className="mb-3 inline-block text-[10px] font-bold uppercase tracking-widest text-muted">
                  {regime.tier}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-txt">{regime.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted">{regime.description}</p>
                <div className="space-y-2">
                  {regime.metrics.map((metric) => (
                    <div key={metric.label} className="flex items-baseline gap-2">
                      <span className="font-mono text-sm font-bold text-accent-2">{metric.value}</span>
                      <span className="text-xs text-muted">{metric.label}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={regime.learnMoreHref}
                  className="mt-4 inline-block text-sm text-accent transition-colors hover:text-accent-2"
                >
                  Learn more &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-3 text-2xl font-semibold text-txt md:text-3xl">What connects to the rebar workcell</h2>
          <p className="mb-10 max-w-2xl text-muted">
            Reality Anchors works alongside your detailing and ERP systems, turning plans into verified outcomes on the
            shop floor.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {workcell.integrations.map((item) => (
              <div key={item} className="flex items-center gap-4 rounded-xl border border-line bg-card p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <svg
                    className="h-5 w-5 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-txt">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-bg-2 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-txt md:text-3xl">Model the impact for your operation</h2>
          <p className="mx-auto mb-8 max-w-xl text-muted">
            Use the Quick Estimate calculator to see projected material savings, labor reduction, and EBITDA impact
            based on your tonnage and scrap profile.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/calculator/"
              className="rounded-lg bg-accent px-7 py-4 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg hover:shadow-accent/25"
            >
              Quick Estimate
            </Link>
            <Link
              href="/margin-impact/"
              className="rounded-lg border border-white/25 px-7 py-4 font-semibold text-txt transition-all hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/6"
            >
              Full Margin Model
            </Link>
          </div>
        </div>
      </section>

      {dividers[1] && <PhotoDivider {...dividers[1]} />}

      <LeadForm
        heading="See if rebar cut & bend fits your operation"
        description="Complete the form and we'll return with a fit assessment, suggested rollout scope, and an estimate of what you could save."
      />
      <Footer />
    </main>
  );
}
