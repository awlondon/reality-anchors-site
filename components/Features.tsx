'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { stagger, fadeUp } from '@/lib/motion';

const regimes = [
  {
    name: 'Structural Fabrication Regime',
    description:
      'Anchor-controlled bending and cut-stock planning with machine-specific calibration loops and operator-safe execution.',
    stat: '8% avg scrap reduction',
    statTwo: '<1% fabrication error rate',
    cta: 'See Fabrication Intelligence',
    href: '/commercial/',
    bg: 'from-slate-900 via-slate-800 to-slate-950',
    accent: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
  },
  {
    name: 'Cross-Project Optimization Regime',
    description:
      'Merge multi-job cut plans, convert leftovers into tagged inventory, and route reusable stock before new purchase orders.',
    stat: '18–35% scrap reutilization increase',
    statTwo: '4–12 hrs/week planning saved',
    cta: 'Optimize Across Jobs',
    href: '/industrial/',
    bg: 'from-zinc-900 via-slate-800 to-zinc-950',
    accent: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
  },
  {
    name: 'Machine Calibration Regime',
    description:
      'BLE angle telemetry and stretch-table learning detect drift in real time and continuously tune machine profiles.',
    stat: 'Real-time angle tracking',
    statTwo: 'Drift alerts + stretch profile updates',
    cta: 'See Calibration Mode',
    href: '/industrial/',
    bg: 'from-slate-950 via-indigo-950 to-slate-900',
    accent: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40',
  },
  {
    name: 'Vehicle Stability & Grip Regime',
    description:
      'Speed × surface × load envelopes provide threshold proximity alerts before slip events become safety incidents.',
    stat: 'Live slip-threshold detection',
    statTwo: 'Insurance-grade telemetry stream',
    cta: 'Explore Fleet Safety Layer',
    href: '/commercial/',
    bg: 'from-zinc-900 via-neutral-800 to-slate-950',
    accent: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
  },
  {
    name: 'AR Execution Regime',
    description:
      'Overlay allowable execution states directly on the work zone and gate action with deterministic GO / NO-GO checks.',
    stat: 'Hands-free workflow guidance',
    statTwo: 'Live bend verification + audit logs',
    cta: 'See AR Execution',
    href: '/commercial/',
    bg: 'from-slate-900 via-cyan-950 to-slate-950',
    accent: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40',
  },
  {
    name: 'AI Governance Regime',
    description:
      'Model quorum checks, confidence decay monitoring, and rollback triggers keep decision outputs deterministic and auditable.',
    stat: 'Disagreement frequency tracking',
    statTwo: 'Drift alerts + schema validation',
    cta: 'Review Governance Controls',
    href: '/pricing-methodology/',
    bg: 'from-slate-950 via-violet-950 to-slate-900',
    accent: 'bg-violet-500/20 text-violet-200 border-violet-400/40',
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-bg-2 border-y border-line/70">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mb-14"
        >
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Regime Playbook</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-txt max-w-3xl leading-tight">
            Sector-specific regimes staged as proof-of-capability anchors between funnel steps
          </h2>
          <p className="mt-4 text-muted max-w-2xl">
            Each block combines a visual context panel, measurable KPI deltas, and a route to the next conversion action.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-6"
        >
          {regimes.map((regime) => (
            <motion.article
              key={regime.name}
              variants={fadeUp}
              className={`relative overflow-hidden rounded-2xl border border-line/70 bg-gradient-to-br ${regime.bg}`}
            >
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(46,125,235,0.2),transparent_35%)]" />
              <div className="relative p-7 md:p-8 min-h-[280px] flex flex-col">
                <h3 className="text-xl font-semibold text-white mb-3">{regime.name}</h3>
                <p className="text-slate-200/90 text-sm leading-relaxed max-w-xl">{regime.description}</p>

                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  <div className={`rounded-lg border px-3 py-2 text-xs font-semibold ${regime.accent}`}>{regime.stat}</div>
                  <div className={`rounded-lg border px-3 py-2 text-xs font-semibold ${regime.accent}`}>{regime.statTwo}</div>
                </div>

                <Link
                  href={regime.href}
                  className="mt-auto pt-7 text-sm font-semibold text-white hover:text-accent-2 transition-colors"
                >
                  {regime.cta} →
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
