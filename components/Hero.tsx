'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import StructuredFieldBackground from '@/components/StructuredFieldBackground';
import { trackEvent } from '@/lib/analytics';
import { siteMetrics } from '@/lib/siteData';

export default function Hero() {
  const reduce = useReducedMotion();

  const hlsfNodes = [
    'S',
    'V',
    'L1',
    'CTRL',
    'TRACK',
    'SYNC',
    'R/T',
    'HLSF',
    'FLOW',
    'STATE',
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-bg flex items-center">
      {/* Three.js field */}
      <StructuredFieldBackground className="absolute inset-0 w-full h-full" intensity={0.65} />

      {/* Symbol-vector level-1 HLSF ring */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
        animate={reduce ? {} : { rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 75 }}
      >
        <svg
          viewBox="0 0 1000 1000"
          className="h-[150vmin] w-[150vmin] min-h-[680px] min-w-[680px] opacity-55"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="hlsfGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgb(59 130 246 / 0)" />
              <stop offset="70%" stopColor="rgb(59 130 246 / 0.12)" />
              <stop offset="100%" stopColor="rgb(96 165 250 / 0.34)" />
            </radialGradient>
          </defs>

          <circle cx="500" cy="500" r="356" fill="none" stroke="url(#hlsfGlow)" strokeWidth="1.5" />
          <circle cx="500" cy="500" r="342" fill="none" stroke="rgb(148 163 184 / 0.38)" strokeWidth="1.2" strokeDasharray="5 10" />
          <circle cx="500" cy="500" r="328" fill="none" stroke="rgb(59 130 246 / 0.45)" strokeWidth="0.9" strokeDasharray="2 14" />

          {hlsfNodes.map((node, index) => {
            const angle = (index / hlsfNodes.length) * Math.PI * 2;
            const x = 500 + Math.cos(angle) * 342;
            const y = 500 + Math.sin(angle) * 342;
            const connectorX = 500 + Math.cos(angle) * 328;
            const connectorY = 500 + Math.sin(angle) * 328;

            return (
              <g key={node}>
                <line
                  x1="500"
                  y1="500"
                  x2={connectorX}
                  y2={connectorY}
                  stroke="rgb(125 211 252 / 0.18)"
                  strokeWidth="0.7"
                />
                <circle cx={x} cy={y} r="3.8" fill="rgb(96 165 250 / 0.7)" />
                <text
                  x={x}
                  y={y - 11}
                  textAnchor="middle"
                  fill="rgb(226 232 240 / 0.74)"
                  fontSize="13"
                  letterSpacing="2"
                  style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
                >
                  {node}
                </text>
              </g>
            );
          })}

          <circle cx="500" cy="500" r="66" fill="rgb(2 6 23 / 0.24)" stroke="rgb(148 163 184 / 0.25)" strokeWidth="0.8" />
          <circle cx="500" cy="500" r="38" fill="none" stroke="rgb(125 211 252 / 0.3)" strokeWidth="0.8" strokeDasharray="3 9" />
        </svg>
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-bg/70 via-bg/55 to-bg/85 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-16">
        <motion.p
          initial={reduce ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xs font-bold tracking-[0.2em] uppercase text-muted mb-4"
        >
          Reality Anchors Limited
        </motion.p>

        <motion.h1
          initial={reduce ? {} : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight text-txt max-w-4xl"
        >
          Structurally Governed AI Optimization Systems
        </motion.h1>

        <motion.p
          initial={reduce ? {} : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32 }}
          className="mt-6 text-lg text-muted max-w-2xl leading-relaxed"
        >
          Deterministic bench workflows, measurable scrap reduction, and traceable execution records — deployed from day one.
        </motion.p>

        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.44 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link
            href="/commercial/#contact"
            className="px-7 py-4 rounded-lg bg-accent hover:bg-blue-500 text-white font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/25"
            onClick={() => trackEvent('hero_cta_primary')}
          >
            Request Enterprise Assessment
          </Link>
          <Link
            href="/pricing-methodology/"
            className="px-7 py-4 rounded-lg border border-white/25 hover:border-white/50 hover:bg-white/6 text-txt font-semibold transition-all hover:-translate-y-0.5"
            onClick={() => trackEvent('hero_cta_secondary')}
          >
            Explore Platform Architecture
          </Link>
        </motion.div>

        {/* KPIs */}
        <motion.div
          initial={reduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl"
        >
          {siteMetrics.hero.map(({ value, label }) => (
            <div
              key={label}
              className="border border-line/70 bg-card/50 backdrop-blur-sm rounded-xl px-4 py-3"
            >
              <div className="text-xl font-bold text-accent-2 font-mono">{value}</div>
              <div className="text-xs text-muted mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="text-[10px] text-muted/60 tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-muted/50 to-transparent"
          animate={reduce ? {} : { scaleY: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
