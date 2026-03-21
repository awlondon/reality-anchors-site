import type { Metadata } from 'next';
import Link from 'next/link';
import { workcells } from '@/data/workcells';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Platform — Execution Validation Architecture | Reality Anchors',
  description:
    'The FCC-OS execution layer: Guide, Validate, Record across every industrial fabrication workcell. Offline-first, audit-ready, ERP-compatible.',
  alternates: { canonical: '/platform/' },
};

const CORE_LOOP = [
  {
    step: 'Guide',
    headline: 'Action-ready workstation instructions',
    copy: 'Turn specifications, cut lists, and schedules into clear step-by-step actions. Operators see exactly what to do next — no second-guessing drawings, no manual look-ups.',
    metric: '< 0.7%',
    metricLabel: 'Fabrication errors',
  },
  {
    step: 'Validate',
    headline: 'In-process verification before the action is irreversible',
    copy: 'Each step is checked against the live job context, measured reality anchors, machine profile, and tolerance envelope. Deviations are caught before they turn into scrap, delay, or rework.',
    metric: '8%',
    metricLabel: 'Max scrap reduction',
  },
  {
    step: 'Record',
    headline: 'Operational traceability from bench to audit',
    copy: 'Every decision, measurement, and operator action is logged with timestamps and device context. Your ERP, detailing, and QA systems receive cleaner data on material use, timing, and outcomes.',
    metric: '99%',
    metricLabel: 'Execution accuracy',
  },
];

const TECH_CAPABILITIES = [
  {
    title: 'Offline-first architecture',
    description:
      'Full execution capability with no network dependency. Data syncs when connectivity returns — no interruption to bench operations.',
  },
  {
    title: 'Edge inference',
    description:
      'Deterministic on-device measurement and validation run at the workstation. Decisions happen in milliseconds, not cloud round-trips.',
  },
  {
    title: 'Reality anchor measurement',
    description:
      'Any identified object of known dimensions can establish scale in-frame. The platform uses that measured reference as a ruler for everything else it validates.',
  },
  {
    title: 'Immutable audit trail',
    description:
      'Every event is tamper-evident and append-only. Operator actions, machine readings, and validation outcomes form a continuous, reproducible record.',
  },
  {
    title: 'Versioned machine profiles',
    description:
      'Machine calibration data is tracked over time. Drift is visible, and profile changes require controlled release — no silent overrides.',
  },
  {
    title: 'Role-based access',
    description:
      'Operators, supervisors, QA, and admins see different surfaces. Governance controls are built in, not bolted on.',
  },
  {
    title: 'Structured exports',
    description:
      'Per-run reports, per-job trace logs, exception registries, and calibration summaries export in formats your ERP and QA systems expect.',
  },
];

const liveWorkcells = workcells.filter((w) => w.status === 'live');
const expansionWorkcells = workcells.filter((w) => w.status !== 'live');

export default function PlatformPage() {
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Reality Anchors Platform Architecture',
            description:
              'The FCC-OS execution validation layer for industrial fabrication.',
            url: 'https://realityanchorsltd.com/platform/',
            about: {
              '@type': 'Organization',
              name: 'Reality Anchors',
              url: 'https://realityanchorsltd.com',
            },
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-bg pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted mb-4">
            Platform Architecture
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight text-txt max-w-3xl">
            The execution validation layer between planning and outcomes.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
            Upstream systems generate intent &mdash; schedules, cut lists, specifications.
            Downstream reality is irreversible &mdash; cuts, bends, welds, pours.
            The platform sits at the point of execution: guiding the action, validating it against
            the spec, measuring against reality anchors in-frame, and recording the outcome.
          </p>
        </div>
      </section>

      {/* ── Core loop (detailed) ──────────────────────────────── */}
      <section className="bg-bg-2 border-y border-line py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-txt mb-12">
            The execution loop
          </h2>
          <div className="space-y-12">
            {CORE_LOOP.map(({ step, headline, copy, metric, metricLabel }, i) => (
              <div
                key={step}
                className="grid md:grid-cols-[auto_1fr_auto] gap-6 items-start"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold tracking-widest text-accent font-mono w-6">
                    0{i + 1}
                  </span>
                  <span className="text-sm font-bold tracking-[0.15em] uppercase text-accent">
                    {step}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-txt mb-2">{headline}</h3>
                  <p className="text-sm text-muted leading-relaxed max-w-lg">{copy}</p>
                </div>
                <div className="border border-line rounded-xl px-5 py-3 bg-card text-center min-w-[100px]">
                  <div className="text-xl font-bold text-accent-2 font-mono">{metric}</div>
                  <div className="text-[11px] text-muted mt-1">{metricLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Positioning: what it is and isn't ─────────────────── */}
      <section className="bg-bg py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-txt mb-3">
            Not MES. Not generic SOPs.
          </h2>
          <p className="text-muted mb-10 max-w-2xl">
            The execution layer between your planning tools and the physical outcome. It complements
            ERP and detailing systems — it does not replace them.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: 'Classical MES',
                role: 'Track, schedule, and control production at the plant level.',
                relation: 'Reality Anchors imports scheduling intent and exports verified execution data.',
              },
              {
                label: 'Connected Worker',
                role: 'Digitize SOPs, training, and general work instructions.',
                relation: 'Reality Anchors is fabrication-specific: tied to specifications, tolerances, and irreversible actions.',
              },
              {
                label: 'ERP / Detailing',
                role: 'Generate the plan — schedules, cut lists, material orders.',
                relation: 'Reality Anchors closes the loop: what actually happened vs. what was planned.',
              },
            ].map(({ label, role, relation }) => (
              <div key={label} className="border border-line rounded-xl p-6 bg-card">
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-muted mb-3">
                  {label}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-3">{role}</p>
                <p className="text-sm text-accent-2 leading-relaxed">{relation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workcell applicability ─────────────────────────────── */}
      <section className="bg-bg-2 border-y border-line py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-txt mb-3">
            Same loop, different workcells
          </h2>
          <p className="text-muted mb-10 max-w-2xl">
            The Guide &rarr; Validate &rarr; Record pattern is workcell-agnostic. Each deployment
            configures the inputs, constraints, tolerances, and logging schema for a specific
            fabrication context.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {liveWorkcells.map((wc) => (
              <Link
                key={wc.id}
                href={`/industries/${wc.slug}/`}
                className="flex items-center gap-4 border border-line rounded-xl p-5 bg-card hover:border-accent/40 transition-colors"
              >
                <div className="w-3 h-3 rounded-full bg-green-400 shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-txt">{wc.name}</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-green-400 ml-2">
                    Live
                  </span>
                  <p className="text-xs text-muted mt-1">{wc.tagline}</p>
                </div>
              </Link>
            ))}
            {expansionWorkcells.map((wc) => (
              <div
                key={wc.id}
                className="flex items-center gap-4 border border-line/50 rounded-xl p-5 bg-card/50"
              >
                <div className="w-3 h-3 rounded-full bg-muted/30 shrink-0" />
                <div>
                  <span className="text-sm font-medium text-muted">{wc.name}</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted/60 ml-2">
                    {wc.status === 'coming-soon' ? 'Coming Soon' : 'Exploring'}
                  </span>
                  <p className="text-xs text-muted/60 mt-1">{wc.tagline}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted/70">
            <Link href="/industries/" className="text-accent hover:text-accent-2 transition-colors">
              Full workcell map &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* ── Technology ────────────────────────────────────────── */}
      <section className="bg-bg py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-txt mb-3">
            Built for the shop floor
          </h2>
          <p className="text-muted mb-10 max-w-2xl">
            Infrastructure decisions that reflect how fabrication actually works: intermittent
            connectivity, dusty environments, shift changes, and compliance audits.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TECH_CAPABILITIES.map(({ title, description }) => (
              <div key={title} className="border border-line rounded-xl p-5 bg-card">
                <h3 className="text-sm font-semibold text-txt mb-2">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-bg-2 border-t border-line py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-txt mb-4">
            See it applied to a real workflow
          </h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">
            Rebar cut &amp; bend is the flagship deployment. Walk through the execution loop from
            cut list to audit record.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/industries/rebar-cut-bend/"
              className="px-7 py-4 rounded-lg bg-accent hover:bg-blue-500 text-white font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/25"
            >
              See Rebar Cut &amp; Bend
            </Link>
            <Link
              href="/industries/"
              className="px-7 py-4 rounded-lg border border-white/25 hover:border-white/50 hover:bg-white/6 text-txt font-semibold transition-all hover:-translate-y-0.5"
            >
              View All Workcells
            </Link>
          </div>
        </div>
      </section>

      <LeadForm
        heading="Request a technical review"
        description="Tell us about your fabrication environment and we'll walk through how the platform applies."
      />
      <Footer />
    </main>
  );
}
