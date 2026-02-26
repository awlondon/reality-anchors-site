'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

export default function ValueBridge() {
  return (
    <section className="bg-bg py-12">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          className="flex flex-col items-center gap-5"
        >
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent">
            Core Value Offer
          </p>

          {/* ── SVG pipeline diagram ── */}
          <svg
            viewBox="0 0 1060 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-5xl"
            aria-label="Reality Anchors core value: Govern, Optimise, Trace"
            role="img"
          >
            <defs>
              {/* Arrow marker */}
              <marker
                id="vb-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M0 0 L10 5 L0 10 z" fill="#1e3048" />
              </marker>

              {/* Subtle grid */}
              <pattern id="vb-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M24 0 L0 0 0 24" fill="none" stroke="#1e3048" strokeWidth="0.4" />
              </pattern>

              {/* Soft accent glow */}
              <filter id="vb-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer panel */}
            <rect width="1060" height="200" rx="14" fill="#0d1520" />
            <rect width="1060" height="200" rx="14" fill="url(#vb-grid)" opacity="0.5" />

            {/* ════ CARD 1 — GOVERN ════ */}
            <rect x="18" y="18" width="280" height="164" rx="10" fill="#111d2c" stroke="#1e3048" strokeWidth="1" />
            {/* accent top strip */}
            <rect x="18" y="18" width="280" height="3" rx="1.5" fill="#2e7deb" />
            {/* icon circle */}
            <circle cx="60" cy="60" r="18" fill="#0d1520" stroke="#1e3048" strokeWidth="1" />
            {/* check-mark */}
            <path d="M52 60 L57.5 65.5 L69 53" stroke="#2e7deb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#vb-glow)" />
            {/* label */}
            <text x="88" y="53" fontFamily="Inter,system-ui,sans-serif" fontSize="9" fontWeight="700" letterSpacing="2.2" fill="#2e7deb">GOVERN</text>
            {/* title */}
            <text x="88" y="68" fontFamily="Inter,system-ui,sans-serif" fontSize="14" fontWeight="600" fill="#e4edf8">Deterministic</text>
            <text x="88" y="84" fontFamily="Inter,system-ui,sans-serif" fontSize="14" fontWeight="600" fill="#e4edf8">Enforcement</text>
            {/* body */}
            <text fontFamily="Inter,system-ui,sans-serif" fontSize="11" fill="#8aa8c8">
              <tspan x="30" dy="0" y="110">GO / NO-GO gating at every threshold.</tspan>
              <tspan x="30" dy="15">Operators follow versioned rulesets —</tspan>
              <tspan x="30" dy="15">never guesswork.</tspan>
            </text>
            {/* metric */}
            <text x="30" y="171" fontFamily="'IBM Plex Mono',Consolas,monospace" fontSize="21" fontWeight="700" fill="#6fb0ff">{'< 1%'}</text>
            <text x="84" y="171" fontFamily="Inter,system-ui,sans-serif" fontSize="10" fill="#8aa8c8"> fabrication errors</text>

            {/* ── CONNECTOR 1 ── */}
            <line x1="300" y1="100" x2="387" y2="100" stroke="#1e3048" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#vb-arrow)" />
            <circle cx="322" cy="100" r="2.5" fill="#2e7deb" opacity="0.85" />
            <circle cx="344" cy="100" r="2.5" fill="#2e7deb" opacity="0.55" />
            <circle cx="366" cy="100" r="2.5" fill="#2e7deb" opacity="0.28" />

            {/* ════ CARD 2 — OPTIMISE ════ */}
            <rect x="390" y="18" width="280" height="164" rx="10" fill="#111d2c" stroke="#1e3048" strokeWidth="1" />
            <rect x="390" y="18" width="280" height="3" rx="1.5" fill="#2e7deb" />
            <circle cx="432" cy="60" r="18" fill="#0d1520" stroke="#1e3048" strokeWidth="1" />
            {/* bar-chart icon */}
            <rect x="423" y="64" width="5" height="8" rx="1" fill="#2e7deb" />
            <rect x="430" y="58" width="5" height="14" rx="1" fill="#2e7deb" />
            <rect x="437" y="51" width="5" height="21" rx="1" fill="#2e7deb" filter="url(#vb-glow)" />
            {/* label */}
            <text x="460" y="53" fontFamily="Inter,system-ui,sans-serif" fontSize="9" fontWeight="700" letterSpacing="2.2" fill="#2e7deb">OPTIMISE</text>
            {/* title */}
            <text x="460" y="68" fontFamily="Inter,system-ui,sans-serif" fontSize="14" fontWeight="600" fill="#e4edf8">Cross-Project</text>
            <text x="460" y="84" fontFamily="Inter,system-ui,sans-serif" fontSize="14" fontWeight="600" fill="#e4edf8">Engine</text>
            {/* body */}
            <text fontFamily="Inter,system-ui,sans-serif" fontSize="11" fill="#8aa8c8">
              <tspan x="402" dy="0" y="110">Unified planning across benches and</tspan>
              <tspan x="402" dy="15">facilities. Material &amp; labour savings</tspan>
              <tspan x="402" dy="15">modelled before contract signature.</tspan>
            </text>
            {/* metric */}
            <text x="402" y="171" fontFamily="'IBM Plex Mono',Consolas,monospace" fontSize="21" fontWeight="700" fill="#6fb0ff">30%</text>
            <text x="442" y="171" fontFamily="Inter,system-ui,sans-serif" fontSize="10" fill="#8aa8c8"> max scrap reduction</text>

            {/* ── CONNECTOR 2 ── */}
            <line x1="672" y1="100" x2="759" y2="100" stroke="#1e3048" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#vb-arrow)" />
            <circle cx="694" cy="100" r="2.5" fill="#2e7deb" opacity="0.85" />
            <circle cx="716" cy="100" r="2.5" fill="#2e7deb" opacity="0.55" />
            <circle cx="738" cy="100" r="2.5" fill="#2e7deb" opacity="0.28" />

            {/* ════ CARD 3 — TRACE ════ */}
            <rect x="762" y="18" width="280" height="164" rx="10" fill="#111d2c" stroke="#1e3048" strokeWidth="1" />
            <rect x="762" y="18" width="280" height="3" rx="1.5" fill="#2e7deb" />
            <circle cx="804" cy="60" r="18" fill="#0d1520" stroke="#1e3048" strokeWidth="1" />
            {/* document icon */}
            <rect x="795" y="48" width="18" height="23" rx="2" stroke="#2e7deb" strokeWidth="1.5" />
            <line x1="799" y1="54" x2="809" y2="54" stroke="#2e7deb" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="799" y1="58" x2="809" y2="58" stroke="#2e7deb" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="799" y1="62" x2="809" y2="62" stroke="#2e7deb" strokeWidth="1.2" strokeLinecap="round" filter="url(#vb-glow)" />
            {/* label */}
            <text x="832" y="53" fontFamily="Inter,system-ui,sans-serif" fontSize="9" fontWeight="700" letterSpacing="2.2" fill="#2e7deb">TRACE</text>
            {/* title */}
            <text x="832" y="68" fontFamily="Inter,system-ui,sans-serif" fontSize="14" fontWeight="600" fill="#e4edf8">Immutable</text>
            <text x="832" y="84" fontFamily="Inter,system-ui,sans-serif" fontSize="14" fontWeight="600" fill="#e4edf8">Record of Truth</text>
            {/* body */}
            <text fontFamily="Inter,system-ui,sans-serif" fontSize="11" fill="#8aa8c8">
              <tspan x="774" dy="0" y="110">Every decision logged &amp; reproducible.</tspan>
              <tspan x="774" dy="15">Per-run scrap accounting, operator</tspan>
              <tspan x="774" dy="15">traceability, versioned calibration.</tspan>
            </text>
            {/* metric */}
            <text x="774" y="171" fontFamily="'IBM Plex Mono',Consolas,monospace" fontSize="21" fontWeight="700" fill="#6fb0ff">99%</text>
            <text x="818" y="171" fontFamily="Inter,system-ui,sans-serif" fontSize="10" fill="#8aa8c8"> execution accuracy</text>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
