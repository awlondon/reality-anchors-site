'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import { fadeUp } from '@/lib/motion';

const SCENE_DURATION = 3000;
const SCENE_COUNT = 3;

/* ── palette (matches site theme) ────────────────────────── */
const C = {
  bg:      '#0d1520',
  bgDeep:  '#070b12',
  card:    '#111d2c',
  line:    '#1e3048',
  lineLt:  '#263d5a',
  muted:   '#8aa8c8',
  txt:     '#e4edf8',
  accent:  '#2e7deb',
  accent2: '#6fb0ff',
  green:   '#38E18E',
  amber:   '#f59e0b',
  red:     '#ef4444',
} as const;

/* ═══════════════════════════════════════════════════════════════
   SCENE 1 — GUIDE
   Split-screen: left shows a specification document flowing into
   the system, right shows the operator tablet with generated
   step-by-step instructions. The concept: specs in → instructions
   out. No specific fabrication domain visible.
   ═══════════════════════════════════════════════════════════════ */
function Scene1() {
  const steps = [
    { label: 'Load material',     done: true },
    { label: 'Position to datum', done: true },
    { label: 'Execute operation',  active: true },
    { label: 'Verify tolerance',  done: false },
    { label: 'Sign off & advance', done: false },
  ];

  return (
    <g>
      {/* ── Floor ─────────────────────────────────────────────── */}
      <rect x="0" y="340" width="800" height="110" fill={C.bgDeep} />
      <line x1="0" y1="340" x2="800" y2="340" stroke={C.line} strokeWidth="0.5" />

      {/* ── Left panel: spec document ─────────────────────────── */}
      <rect x="40" y="70" width="300" height="250" rx="10" fill={C.card} stroke={C.lineLt} strokeWidth="1" />
      <rect x="52" y="82" width="276" height="226" rx="5" fill={C.bgDeep} />

      {/* Document header */}
      <rect x="62" y="92" width="256" height="24" rx="4" fill={C.accent} opacity="0.1" />
      <text x="72" y="109" fill={C.accent2} fontSize="10" fontFamily="monospace" fontWeight="bold">WORK ORDER  WO-7291</text>

      {/* Spec lines — abstract representation of a technical document */}
      {[130, 148, 166, 184, 202].map((y, i) => {
        const widths = [220, 180, 240, 160, 200];
        return (
          <g key={y}>
            <rect x="72" y={y} width="8" height="8" rx="1.5" fill={C.lineLt} opacity="0.5" />
            <rect x="88" y={y + 1} width={widths[i]} height="6" rx="2" fill={C.lineLt} opacity={0.3 - i * 0.03} />
          </g>
        );
      })}

      {/* Spec detail block — dimensional tolerances */}
      <rect x="72" y="228" width="120" height="60" rx="4" fill={C.line} opacity="0.25" />
      <text x="82" y="244" fill={C.muted} fontSize="7" fontFamily="monospace">DIMENSIONS</text>
      <text x="82" y="260" fill={C.accent2} fontSize="9" fontFamily="monospace">±0.5° angular</text>
      <text x="82" y="274" fill={C.accent2} fontSize="9" fontFamily="monospace">±2 mm linear</text>

      {/* Material spec block */}
      <rect x="202" y="228" width="116" height="60" rx="4" fill={C.line} opacity="0.25" />
      <text x="212" y="244" fill={C.muted} fontSize="7" fontFamily="monospace">MATERIAL</text>
      <text x="212" y="260" fill={C.accent2} fontSize="9" fontFamily="monospace">Grade verified</text>
      <text x="212" y="274" fill={C.accent2} fontSize="9" fontFamily="monospace">Cert. on file</text>

      {/* ── Flow arrow from spec → tablet ─────────────────────── */}
      <line x1="360" y1="195" x2="430" y2="195" stroke={C.accent2} strokeWidth="1.5" opacity="0.4"
        strokeDasharray="6 4">
        <animate attributeName="strokeDashoffset" values="0;-10" dur="1s" repeatCount="indefinite" />
      </line>
      <polygon points="428,190 440,195 428,200" fill={C.accent2} opacity="0.5">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.2s" repeatCount="indefinite" />
      </polygon>

      {/* ── Right panel: operator tablet ──────────────────────── */}
      <rect x="450" y="70" width="310" height="250" rx="10" fill={C.card} stroke={C.lineLt} strokeWidth="1.5" />
      <rect x="462" y="82" width="286" height="226" rx="5" fill={C.bgDeep} />

      {/* Tablet header */}
      <rect x="472" y="92" width="266" height="24" rx="4" fill={C.green} opacity="0.08" />
      <text x="482" y="109" fill={C.green} fontSize="10" fontFamily="monospace" fontWeight="bold">INSTRUCTIONS — Step 3 of 5</text>

      {/* Step list */}
      {steps.map((s, i) => {
        const y = 128 + i * 32;
        return (
          <g key={i}>
            {/* Active row highlight */}
            {s.active && (
              <rect x="472" y={y - 5} width="266" height="26" rx="4" fill={C.accent} opacity="0.06" />
            )}
            {/* Checkbox */}
            <rect x="480" y={y} width="14" height="14" rx="3"
              fill={s.done ? C.green : s.active ? C.accent : C.line}
              opacity={s.done ? 0.2 : s.active ? 0.15 : 0.3} />
            {s.done && (
              <polyline points={`${483},${y + 7} ${485.5},${y + 10.5} ${491},${y + 4.5}`}
                fill="none" stroke={C.green} strokeWidth="1.8" strokeLinecap="round" />
            )}
            {s.active && (
              <circle cx="487" cy={y + 7} r="3.5" fill={C.accent} opacity="0.8">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" />
              </circle>
            )}
            {/* Label */}
            <text x="504" y={y + 11}
              fill={s.done ? C.muted : s.active ? C.txt : C.muted}
              fontSize="11" fontFamily="monospace"
              opacity={s.done ? 0.5 : 1}
              textDecoration={s.done ? 'line-through' : undefined}>
              {s.label}
            </text>
            {/* Hold-point icon for verify step */}
            {s.label.includes('Verify') && (
              <g>
                <rect x="680" y={y - 1} width="48" height="16" rx="8" fill={C.amber} opacity="0.12" />
                <text x="704" y={y + 10} textAnchor="middle" fill={C.amber} fontSize="7" fontFamily="monospace" fontWeight="bold">HOLD</text>
              </g>
            )}
          </g>
        );
      })}

      {/* ── Caption ────────────────────────────────────────────── */}
      <rect x="0" y="370" width="800" height="80" fill="url(#captionFadeP1)" />
      <text x="400" y="410" textAnchor="middle" fill={C.txt} fontSize="20"
        fontFamily="Inter, system-ui, sans-serif" fontWeight="600" letterSpacing="0.5">
        Specs in. Step-by-step instructions out.
      </text>
      <line x1="230" y1="425" x2="570" y2="425" stroke={C.accent} strokeWidth="2" opacity="0.4" />

      <defs>
        <linearGradient id="captionFadeP1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.bg} stopOpacity="0" />
          <stop offset="40%" stopColor={C.bgDeep} stopOpacity="0.9" />
          <stop offset="100%" stopColor={C.bgDeep} />
        </linearGradient>
      </defs>
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCENE 2 — VALIDATE
   Tolerance convergence diagram: a measured value approaches a
   target within a tolerance band. Shows the abstract concept of
   "measurement meets spec" — no specific geometry, no L-shapes.
   A real-time gauge settling on target, tolerance envelope
   narrowing, and a PASS verdict emerging.
   ═══════════════════════════════════════════════════════════════ */
function Scene2() {
  /* Tolerance band: target is 0, acceptable range is ±tolerance.
     We show a sensor reading converging toward center. */
  const bandTop = 100;
  const bandBot = 280;
  const bandMid = (bandTop + bandBot) / 2;   // 190
  const chartL = 100;
  const chartR = 520;

  return (
    <g>
      {/* ── Floor ─────────────────────────────────────────────── */}
      <rect x="0" y="340" width="800" height="110" fill={C.bgDeep} />
      <line x1="0" y1="340" x2="800" y2="340" stroke={C.line} strokeWidth="0.5" />

      {/* ── Tolerance envelope background ─────────────────────── */}
      {/* Outer (reject) zone */}
      <rect x={chartL} y={bandTop - 30} width={chartR - chartL} height={bandBot - bandTop + 60} rx="6"
        fill={C.bgDeep} stroke={C.line} strokeWidth="0.5" />
      {/* Tolerance band fill */}
      <rect x={chartL} y={bandTop} width={chartR - chartL} height={bandBot - bandTop} rx="0"
        fill={C.green} opacity="0.03" />
      {/* Upper tolerance line */}
      <line x1={chartL} y1={bandTop} x2={chartR} y2={bandTop}
        stroke={C.green} strokeWidth="1" strokeDasharray="6 4" opacity="0.35" />
      {/* Lower tolerance line */}
      <line x1={chartL} y1={bandBot} x2={chartR} y2={bandBot}
        stroke={C.green} strokeWidth="1" strokeDasharray="6 4" opacity="0.35" />
      {/* Target center line */}
      <line x1={chartL} y1={bandMid} x2={chartR} y2={bandMid}
        stroke={C.accent2} strokeWidth="1.5" opacity="0.5" />

      {/* Labels */}
      <text x={chartL - 6} y={bandTop + 4} textAnchor="end" fill={C.green} fontSize="8" fontFamily="monospace" opacity="0.6">+TOL</text>
      <text x={chartL - 6} y={bandBot + 4} textAnchor="end" fill={C.green} fontSize="8" fontFamily="monospace" opacity="0.6">−TOL</text>
      <text x={chartL - 6} y={bandMid + 4} textAnchor="end" fill={C.accent2} fontSize="8" fontFamily="monospace" opacity="0.7">TARGET</text>

      {/* ── Convergence trace — reading settling toward target ── */}
      {/* The path starts wide (outside tolerance) and converges to center */}
      <path
        d={`M${chartL},${bandTop - 15} L${chartL + 40},${bandBot + 10} L${chartL + 90},${bandTop + 10} L${chartL + 150},${bandBot - 20} L${chartL + 210},${bandTop + 40} L${chartL + 270},${bandBot - 50} L${chartL + 320},${bandMid + 18} L${chartL + 370},${bandMid - 12} L${chartL + 400},${bandMid + 4} L${chartR - 10},${bandMid - 1}`}
        fill="none" stroke={C.accent2} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
        <animate attributeName="stroke-dasharray" values="0 2000;2000 0" dur="2.4s" fill="freeze" />
      </path>

      {/* Current reading dot — pulses at the settled position */}
      <circle cx={chartR - 10} cy={bandMid - 1} r="5" fill={C.accent2} opacity="0">
        <animate attributeName="opacity" values="0;0;0.9" dur="2.4s" fill="freeze" />
        <animate attributeName="r" values="3;6;4" dur="0.8s" begin="2.2s" fill="freeze" />
      </circle>
      {/* Glow ring */}
      <circle cx={chartR - 10} cy={bandMid - 1} r="12" fill="none" stroke={C.accent2} strokeWidth="1" opacity="0">
        <animate attributeName="opacity" values="0;0;0.3;0" dur="3s" begin="2.2s" repeatCount="indefinite" />
        <animate attributeName="r" values="8;18;8" dur="3s" begin="2.2s" repeatCount="indefinite" />
      </circle>

      {/* ── Reject-zone warning markers ───────────────────────── */}
      {/* Early samples that were outside tolerance — red x marks */}
      {[
        { x: chartL + 20, y: bandTop - 8 },
        { x: chartL + 55, y: bandBot + 5 },
      ].map((pt, i) => (
        <g key={i} opacity="0">
          <animate attributeName="opacity" values="0;0;0.5" dur="1.2s" begin={`${i * 0.4}s`} fill="freeze" />
          <line x1={pt.x - 4} y1={pt.y - 4} x2={pt.x + 4} y2={pt.y + 4} stroke={C.red} strokeWidth="1.5" strokeLinecap="round" />
          <line x1={pt.x + 4} y1={pt.y - 4} x2={pt.x - 4} y2={pt.y + 4} stroke={C.red} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}

      {/* ── Right side: verdict panel ─────────────────────────── */}
      <rect x="560" y="88" width="200" height="240" rx="10" fill={C.card} stroke={C.lineLt} strokeWidth="1" />

      {/* Measurement readout */}
      <text x="580" y="116" fill={C.muted} fontSize="8" fontFamily="monospace">MEASURED</text>
      <text x="580" y="144" fill={C.txt} fontSize="30" fontFamily="monospace" fontWeight="bold" opacity="0">
        ON TARGET
        <animate attributeName="opacity" values="0;0;1" dur="2.6s" fill="freeze" />
      </text>

      {/* Deviation */}
      <text x="580" y="168" fill={C.muted} fontSize="9" fontFamily="monospace" opacity="0">
        Deviation: 0.1 unit
        <animate attributeName="opacity" values="0;0;0.7" dur="2.6s" fill="freeze" />
      </text>

      {/* Divider */}
      <line x1="580" y1="182" x2="740" y2="182" stroke={C.line} strokeWidth="0.5" opacity="0.5" />

      {/* Multi-parameter check list */}
      {[
        { y: 198, param: 'Dimension A', status: 'PASS' },
        { y: 218, param: 'Dimension B', status: 'PASS' },
        { y: 238, param: 'Angle', status: 'PASS' },
        { y: 258, param: 'Surface', status: 'PASS' },
      ].map((p, i) => (
        <g key={i} opacity="0">
          <animate attributeName="opacity" values="0;0;1" dur="1.5s" begin={`${1.8 + i * 0.2}s`} fill="freeze" />
          <text x="588" y={p.y + 10} fill={C.muted} fontSize="9" fontFamily="monospace">{p.param}</text>
          <rect x="700" y={p.y} width="42" height="16" rx="8" fill={C.green} opacity="0.12" />
          <text x="721" y={p.y + 11} textAnchor="middle" fill={C.green} fontSize="8" fontFamily="monospace" fontWeight="bold">{p.status}</text>
        </g>
      ))}

      {/* VERDICT badge — appears last */}
      <rect x="580" y="284" width="160" height="30" rx="8" fill={C.green} opacity="0">
        <animate attributeName="opacity" values="0;0;0.15" dur="2.8s" fill="freeze" />
      </rect>
      <text x="660" y="304" textAnchor="middle" fill={C.green} fontSize="14" fontFamily="monospace" fontWeight="bold" opacity="0">
        ✓ WITHIN SPEC
        <animate attributeName="opacity" values="0;0;1" dur="2.8s" fill="freeze" />
      </text>

      {/* ── Scanning sweep across chart ───────────────────────── */}
      <rect x={chartL} y={bandTop - 30} width="4" height={bandBot - bandTop + 60} rx="2" fill={C.green} opacity="0.3">
        <animate attributeName="x" values={`${chartL};${chartR};${chartL}`} dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.35;0.15" dur="3s" repeatCount="indefinite" />
      </rect>

      {/* ── Caption ────────────────────────────────────────────── */}
      <rect x="0" y="370" width="800" height="80" fill="url(#captionFadeP2)" />
      <text x="400" y="410" textAnchor="middle" fill={C.txt} fontSize="20"
        fontFamily="Inter, system-ui, sans-serif" fontWeight="600" letterSpacing="0.5">
        Every measurement verified before the next step begins.
      </text>
      <line x1="190" y1="425" x2="610" y2="425" stroke={C.accent} strokeWidth="2" opacity="0.4" />

      <defs>
        <linearGradient id="captionFadeP2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.bg} stopOpacity="0" />
          <stop offset="40%" stopColor={C.bgDeep} stopOpacity="0.9" />
          <stop offset="100%" stopColor={C.bgDeep} />
        </linearGradient>
      </defs>
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCENE 3 — RECORD
   Execution records flowing from a workcell into structured
   upstream systems. Left: a stylised "workcell" box producing
   execution events. Center: timeline. Right: three destination
   systems (ERP, QA, Audit) receiving records in real time.
   No rebar terminology — just execution events.
   ═══════════════════════════════════════════════════════════════ */
function Scene3() {
  const events = [
    { y: 118, time: '14:32:01', event: 'Operation started',   detail: 'Operator authenticated',  status: 'logged' },
    { y: 152, time: '14:32:18', event: 'Dimension checked',   detail: 'Within tolerance',        status: 'pass' },
    { y: 186, time: '14:33:04', event: 'Hold-point cleared',  detail: 'AI + manual confirm',     status: 'pass' },
    { y: 220, time: '14:33:22', event: 'QC photo captured',   detail: 'Auto-tagged to step',     status: 'pass' },
    { y: 254, time: '14:33:45', event: 'Step signed off',     detail: 'Operator: M. Torres',     status: 'logged' },
    { y: 288, time: '14:33:46', event: 'Record exported',     detail: 'ERP + QA sync queued',    status: 'sync' },
  ];

  return (
    <g>
      {/* ── Floor ─────────────────────────────────────────────── */}
      <rect x="0" y="340" width="800" height="110" fill={C.bgDeep} />
      <line x1="0" y1="340" x2="800" y2="340" stroke={C.line} strokeWidth="0.5" />

      {/* ── Dashboard panel ───────────────────────────────────── */}
      <rect x="60" y="56" width="520" height="278" rx="12" fill={C.card} stroke={C.lineLt} strokeWidth="1" />

      {/* Header bar */}
      <rect x="60" y="56" width="520" height="36" rx="12" fill={C.bgDeep} />
      <rect x="60" y="80" width="520" height="12" fill={C.bgDeep} />
      <text x="80" y="80" fill={C.muted} fontSize="10" fontFamily="monospace">EXECUTION RECORD — WO-7291</text>
      <circle cx="548" cy="74" r="5" fill={C.green} opacity="0.6">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="538" y="78" fill={C.green} fontSize="8" fontFamily="monospace" textAnchor="end">LIVE</text>

      {/* Timeline spine */}
      <line x1="112" y1="105" x2="112" y2="330" stroke={C.line} strokeWidth="1" />

      {/* Log entries — staggered appearance */}
      {events.map((entry, i) => (
        <g key={i} opacity="0">
          <animate attributeName="opacity" values="0;0;1"
            dur="1.5s" begin={`${i * 0.3}s`} fill="freeze" />

          {/* Timeline dot */}
          <circle cx="112" cy={entry.y + 6} r="4"
            fill={entry.status === 'pass' ? C.green : entry.status === 'sync' ? C.accent : C.muted}
            opacity="0.7" />

          {/* Timestamp */}
          <text x="126" y={entry.y + 10} fill={C.muted} fontSize="9" fontFamily="monospace">
            {entry.time}
          </text>

          {/* Event name */}
          <text x="210" y={entry.y + 10} fill={C.txt} fontSize="11" fontFamily="monospace">
            {entry.event}
          </text>

          {/* Detail */}
          <text x="380" y={entry.y + 10} fill={C.muted} fontSize="10" fontFamily="monospace">
            {entry.detail}
          </text>
        </g>
      ))}

      {/* ── Right side: upstream system cards ─────────────────── */}
      {/* Data flow arrows from timeline → destination cards */}
      {[
        { y: 100, label: 'ERP',   sub: 'Job costing',   color: C.accent2 },
        { y: 188, label: 'QA',    sub: 'Compliance log', color: C.green },
        { y: 276, label: 'AUDIT', sub: 'Immutable trail', color: C.muted },
      ].map((dest, i) => (
        <g key={dest.label}>
          {/* Connecting arrow */}
          <line x1="580" y1={dest.y + 25} x2="620" y2={dest.y + 25}
            stroke={dest.color} strokeWidth="1.5" opacity="0.4" strokeDasharray="5 3">
            <animate attributeName="strokeDashoffset" values="0;-8" dur="1s" repeatCount="indefinite" />
          </line>
          <polygon points={`618,${dest.y + 21} 628,${dest.y + 25} 618,${dest.y + 29}`}
            fill={dest.color} opacity="0.5" />

          {/* Destination card */}
          <rect x="632" y={dest.y} width="140" height="50" rx="8"
            fill={C.bgDeep} stroke={dest.color} strokeWidth="0.8" opacity="0.9" />

          {/* Icon placeholder: three horizontal lines */}
          <rect x="648" y={dest.y + 14} width="18" height="2" rx="1" fill={dest.color} opacity="0.4" />
          <rect x="648" y={dest.y + 20} width="14" height="2" rx="1" fill={dest.color} opacity="0.3" />
          <rect x="648" y={dest.y + 26} width="18" height="2" rx="1" fill={dest.color} opacity="0.4" />

          {/* Label */}
          <text x="678" y={dest.y + 18} fill={dest.color} fontSize="11" fontFamily="monospace" fontWeight="bold">
            {dest.label}
          </text>
          <text x="678" y={dest.y + 32} fill={C.muted} fontSize="8" fontFamily="monospace">
            {dest.sub}
          </text>

          {/* Incoming data pulse */}
          <circle cx="632" cy={dest.y + 25} r="3" fill={dest.color} opacity="0">
            <animate attributeName="opacity" values="0;0.6;0" dur="1.5s" begin={`${0.8 + i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="r" values="2;6;2" dur="1.5s" begin={`${0.8 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* ── Caption ────────────────────────────────────────────── */}
      <rect x="0" y="370" width="800" height="80" fill="url(#captionFadeP3)" />
      <text x="400" y="410" textAnchor="middle" fill={C.txt} fontSize="20"
        fontFamily="Inter, system-ui, sans-serif" fontWeight="600" letterSpacing="0.5">
        Every action recorded. Every system in sync.
      </text>
      <line x1="230" y1="425" x2="570" y2="425" stroke={C.accent} strokeWidth="2" opacity="0.4" />

      <defs>
        <linearGradient id="captionFadeP3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.bg} stopOpacity="0" />
          <stop offset="40%" stopColor={C.bgDeep} stopOpacity="0.9" />
          <stop offset="100%" stopColor={C.bgDeep} />
        </linearGradient>
      </defs>
    </g>
  );
}

/* ── scene registry ─────────────────────────────────────────── */
const SCENE_COMPONENTS = [Scene1, Scene2, Scene3];

const CAPTIONS = [
  'Specs in. Step-by-step instructions out.',
  'Every measurement verified before the next step begins.',
  'Every action recorded. Every system in sync.',
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   Platform-level showcase: Guide → Validate → Record
   ═══════════════════════════════════════════════════════════════ */
export default function VideoShowcasePlatform() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasFiredView = useRef(false);
  const [activeScene, setActiveScene] = useState(0);
  const isInView = useInView(containerRef, { once: true, amount: 0.05 });

  useEffect(() => {
    const id = setTimeout(() => {
      setActiveScene(prev => (prev + 1) % SCENE_COUNT);
    }, SCENE_DURATION);
    return () => clearTimeout(id);
  }, [activeScene]);

  useEffect(() => {
    if (isInView && !hasFiredView.current) {
      hasFiredView.current = true;
      trackEvent('showcase_platform_view');
    }
  }, [isInView]);

  const ActiveScene = SCENE_COMPONENTS[activeScene];

  return (
    <section className="bg-bg">
      <div ref={containerRef} className="max-w-7xl mx-auto px-0 sm:px-6 pb-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          {/* SVG animation — 16:9 */}
          <div className="relative w-full aspect-video overflow-hidden sm:rounded-2xl border border-line/50 bg-bg-2">
            <svg viewBox="0 0 800 450" className="w-full h-full" role="img"
              aria-label="Guide, Validate, Record — execution validation workflow">
              {/* Background */}
              <rect width="800" height="450" fill={C.bg} />
              {/* Grid */}
              <defs>
                <pattern id="platformGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.line} strokeWidth="0.2" opacity="0.25" />
                </pattern>
              </defs>
              <rect width="800" height="450" fill="url(#platformGrid)" />

              {/* Active scene */}
              <AnimatePresence mode="wait">
                <motion.g
                  key={activeScene}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ActiveScene />
                </motion.g>
              </AnimatePresence>
            </svg>
          </div>

          {/* Scene indicator dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {CAPTIONS.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveScene(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeScene
                    ? 'bg-accent w-8'
                    : 'bg-line hover:bg-muted/50 w-1.5'
                }`}
                aria-label={`Scene ${i + 1}: ${c}`}
                aria-current={i === activeScene ? 'step' : undefined}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
