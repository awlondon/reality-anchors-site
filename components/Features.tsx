'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PhotoBackground from '@/components/PhotoBackground';
import { stagger, fadeUp } from '@/lib/motion';
import { regimeCatalog } from '@/lib/siteData';

const CORE_TIERS = new Set(['Core', 'Pro']);

const displayOverrides: Record<string, {
  stat: string;
  statTwo: string;
  cta: string;
  href: string;
  bg: string;
  accent: string;
  imageMobile: string;
}> = {
  'structural-fabrication': {
    stat: '8% avg scrap reduction',
    statTwo: '<1% fabrication error rate',
    cta: 'See Fabrication Intelligence',
    href: '/commercial/',
    bg: 'from-slate-900 via-slate-800 to-slate-950',
    accent: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
    imageMobile: '/assets/regimes/structural-fabrication-mobile.svg',
  },
  'multi-project-optimization': {
    stat: '18–35% scrap reutilization increase',
    statTwo: '4–12 hrs/week planning saved',
    cta: 'Optimize Across Jobs',
    href: '/industrial/',
    bg: 'from-zinc-900 via-slate-800 to-zinc-950',
    accent: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    imageMobile: '/assets/regimes/multi-project-optimization-mobile.svg',
  },
  'machine-calibration': {
    stat: 'Real-time angle tracking',
    statTwo: 'Drift alerts + stretch profile updates',
    cta: 'See Calibration Mode',
    href: '/industrial/',
    bg: 'from-slate-950 via-indigo-950 to-slate-900',
    accent: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40',
    imageMobile: '/assets/regimes/machine-calibration-mobile.svg',
  },
  'fleet-grip': {
    stat: 'Live slip-risk alerts',
    statTwo: 'Insurance-grade telemetry stream',
    cta: 'Explore Fleet Safety Layer',
    href: '/commercial/',
    bg: 'from-zinc-900 via-neutral-800 to-slate-950',
    accent: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
    imageMobile: '/assets/regimes/fleet-grip-mobile.svg',
  },
  'ar-execution': {
    stat: 'Hands-free workflow guidance',
    statTwo: 'Live bend verification + audit logs',
    cta: 'See AR Execution',
    href: '/commercial/',
    bg: 'from-slate-900 via-cyan-950 to-slate-950',
    accent: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40',
    imageMobile: '/assets/regimes/ar-execution-mobile.svg',
  },
  'ai-governance': {
    stat: 'Reliability trend tracking',
    statTwo: 'Drift alerts + audit-ready logs',
    cta: 'Review Governance Controls',
    href: '/pricing-methodology/',
    bg: 'from-slate-950 via-violet-950 to-slate-900',
    accent: 'bg-violet-500/20 text-violet-200 border-violet-400/40',
    imageMobile: '/assets/regimes/ai-governance-mobile.svg',
  },
};

const coreRegimes = regimeCatalog.filter((r) => CORE_TIERS.has(r.tier));
const advancedRegimes = regimeCatalog.filter((r) => !CORE_TIERS.has(r.tier));

function RegimeCard({ regime, compact = false }: { regime: typeof regimeCatalog[number]; compact?: boolean }) {
  const display = displayOverrides[regime.id];
  if (!display) return null;

  if (compact) {
    return (
      <motion.article
        key={regime.id}
        variants={fadeUp}
        className="relative overflow-hidden rounded-xl border border-line/50 bg-card/80"
      >
        <div className="p-5 flex flex-col">
          <h3 className="text-base font-semibold text-txt/80 mb-2">{regime.title}</h3>
          <p className="text-muted text-xs leading-relaxed mb-3">{regime.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`rounded-md border px-2 py-1 text-[11px] font-semibold ${display.accent} opacity-70`}>{display.stat}</span>
          </div>
          <Link
            href={display.href}
            className="text-xs font-semibold text-muted hover:text-accent-2 transition-colors"
          >
            {display.cta} →
          </Link>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      key={regime.id}
      variants={fadeUp}
      className={`relative overflow-hidden rounded-2xl border border-line/70 bg-gradient-to-br ${display.bg}`}
    >
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(46,125,235,0.2),transparent_35%)]" />
      <div className="absolute inset-y-0 right-0 w-28 sm:w-44 md:w-48 opacity-70 pointer-events-none">
        <picture>
          <source media="(max-width: 767px)" srcSet={display.imageMobile} />
          <img
            src={regime.image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain object-right p-3"
          />
        </picture>
      </div>
      <div className="relative p-7 md:p-8 min-h-[280px] flex flex-col">
        <h3 className="text-xl font-semibold text-white mb-3">{regime.title}</h3>
        <p className="text-slate-200/90 text-sm leading-relaxed max-w-[80%] sm:max-w-[70%] md:max-w-[72%]">{regime.description}</p>
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          <div className={`rounded-lg border px-3 py-2 text-xs font-semibold ${display.accent}`}>{display.stat}</div>
          <div className={`rounded-lg border px-3 py-2 text-xs font-semibold ${display.accent}`}>{display.statTwo}</div>
        </div>
        <Link
          href={display.href}
          className="mt-auto pt-7 text-sm font-semibold text-white hover:text-accent-2 transition-colors"
        >
          {display.cta} →
        </Link>
      </div>
    </motion.article>
  );
}

export default function Features() {
  return (
    <section className="relative overflow-hidden py-24 bg-bg-2 border-y border-line/70">
      <PhotoBackground src="/images/sparks-metal.jpg" opacity={0.08} gradient="from-bg-2/90 via-bg-2/80 to-bg-2/95" position="center 40%" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mb-14"
        >
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">Core Capabilities</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-txt max-w-3xl leading-tight">
            Fabrication execution, validated at every step
          </h2>
          <p className="mt-4 text-muted max-w-2xl">
            Reality Anchors works alongside your detailing and ERP systems — turning plans into verified outcomes on the shop floor.
          </p>
        </motion.div>

        {/* Core regimes — full-size cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-6"
        >
          {coreRegimes.map((regime) => (
            <RegimeCard key={regime.id} regime={regime} />
          ))}
        </motion.div>

        {/* Advanced capabilities — compact cards */}
        {advancedRegimes.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="mt-14"
          >
            <motion.p variants={fadeUp} className="text-xs font-bold tracking-[0.18em] uppercase text-muted mb-6">
              Advanced Capabilities
            </motion.p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {advancedRegimes.map((regime) => (
                <RegimeCard key={regime.id} regime={regime} compact />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
