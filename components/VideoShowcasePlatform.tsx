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
} as const;

/* ═══════════════════════════════════════════════════════════════
   SCENE 1 — GUIDE
   Operator tablet receiving step-by-step work instructions
   with specification overlay and hold-point markers.
   ═══════════════════════════════════════════════════════════════ */
function Scene1() {
  return (
    <g>
      {/* ── Workstation surface ─────────────────────────────── */}
      <rect x="0" y="320" width="800" height="130" fill={C.bgDeep} />
      <line x1="0" y1="320" x2="800" y2="320" stroke={C.line} strokeWidth="0.5" />

      {/* ── Tablet device ──────────────────────────────────── */}
      <rect x="200" y="80" width="400" height="260" rx="12" fill={C.card} stroke={C.lineLt} strokeWidth="1.5" />
      <rect x="212" y="92" width="376" height="230" rx="6" fill={C.bgDeep} />

      {/* Screen content — work instruction steps */}
      <rect x="224" y="104" width="352" height="28" rx="4" fill={C.accent} opacity="0.12" />
      <text x="240" y="123" fill={C.accent2} fontSize="12" fontFamily="monospace" fontWeight="bold">JOB-2847 — Step 3 of 8</text>

      {/* Step list */}
      {[
        { y: 145, label: 'Cut to 3,250 mm', done: true },
        { y: 172, label: 'Verify length ±2 mm', done: true },
        { y: 199, label: 'Bend at mark C — 90°', active: true },
        { y: 226, label: 'Confirm angle tolerance', done: false },
        { y: 253, label: 'Log and advance', done: false },
      ].map((s, i) => (
        <g key={i}>
          {/* Checkbox */}
          <rect x="230" y={s.y} width="16" height="16" rx="3"
            fill={s.done ? C.green : s.active ? C.accent : C.line}
            opacity={s.done ? 0.2 : s.active ? 0.15 : 0.3} />
          {s.done && (
            <polyline points={`${233},${s.y + 8} ${236},${s.y + 12} ${242},${s.y + 5}`}
              fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" />
          )}
          {s.active && (
            <circle cx="238" cy={s.y + 8} r="4" fill={C.accent} opacity="0.8">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" />
            </circle>
          )}
          {/* Label */}
          <text x="256" y={s.y + 12}
            fill={s.done ? C.muted : s.active ? C.txt : C.muted}
            fontSize="11" fontFamily="monospace"
            opacity={s.done ? 0.5 : 1}
            textDecoration={s.done ? 'line-through' : undefined}>
            {s.label}
          </text>
          {/* Active highlight bar */}
          {s.active && (
            <rect x="224" y={s.y - 4} width="352" height="24" rx="4"
              fill={C.accent} opacity="0.06" />
          )}
        </g>
      ))}

      {/* Specification sidebar */}
      <rect x="590" y="104" width="2" height="170" fill={C.line} opacity="0.5" />
      <text x="604" y="120" fill={C.muted} fontSize="8" fontFamily="monospace">SPEC</text>
      <text x="604" y="140" fill={C.accent2} fontSize="10" fontFamily="monospace">90° ±0.5°</text>
      <text x="604" y="158" fill={C.accent2} fontSize="10" fontFamily="monospace">R = 4d</text>
      <text x="604" y="176" fill={C.accent2} fontSize="10" fontFamily="monospace">N16 500L</text>

      {/* ── Caption ────────────────────────────────────────── */}
      <rect x="0" y="370" width="800" height="80" fill="url(#captionFadeP1)" />
      <text x="400" y="410" textAnchor="middle" fill={C.txt} fontSize="20"
        fontFamily="Inter, system-ui, sans-serif" fontWeight="600" letterSpacing="0.5">
        Every operation starts with a clear, step-by-step plan.
      </text>
      <line x1="220" y1="425" x2="580" y2="425" stroke={C.accent} strokeWidth="2" opacity="0.4" />

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
   Measurement verification with checkmark overlay —
   tolerance envelope visualization.
   ═══════════════════════════════════════════════════════════════ */
function Scene2() {
  return (
    <g>
      {/* ── Abstract workpiece ────────────────────────────── */}
      <rect x="0" y="320" width="800" height="130" fill={C.bgDeep} />
      <line x1="0" y1="320" x2="800" y2="320" stroke={C.line} strokeWidth="0.5" />

      {/* Horizontal member */}
      <rect x="80" y="230" width="400" height="20" rx="4" fill={C.lineLt} />
      {/* Vertical member after bend */}
      <rect x="470" y="100" width="20" height="130" rx="4" fill={C.lineLt} />
      {/* Bend joint arc */}
      <path d="M480,230 Q480,230 480,230" fill="none" stroke={C.lineLt} strokeWidth="20" />

      {/* ── Tolerance envelope ────────────────────────────── */}
      {/* Target lines */}
      <line x1="475" y1="230" x2="475" y2="100" stroke={C.accent2} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.4" />
      <line x1="80" y1="240" x2="480" y2="240" stroke={C.accent2} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.4" />

      {/* Angle arc */}
      <path d="M400,240 A80,80 0 0,0 475,165" fill="none" stroke={C.accent2} strokeWidth="1.5" opacity="0.6">
        <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="1.5s" fill="freeze" />
      </path>

      {/* ── AI scanning sweep ─────────────────────────────── */}
      <rect x="80" y="225" width="6" height="30" rx="3" fill={C.green} opacity="0.5">
        <animate attributeName="x" values="80;480;80" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" />
      </rect>

      {/* ── Measurement callouts ──────────────────────────── */}
      {/* Angle readout */}
      <rect x="530" y="120" width="200" height="80" rx="8" fill={C.bgDeep} stroke={C.accent} strokeWidth="1" opacity="0.95" />
      <text x="550" y="142" fill={C.muted} fontSize="9" fontFamily="monospace">MEASURED ANGLE</text>
      <text x="550" y="172" fill={C.txt} fontSize="28" fontFamily="monospace" fontWeight="bold">90.0&#176;</text>
      {/* PASS badge */}
      <rect x="650" y="132" width="62" height="24" rx="12" fill={C.green} opacity="0.15" />
      <text x="681" y="148" textAnchor="middle" fill={C.green} fontSize="11" fontFamily="monospace" fontWeight="bold">PASS</text>
      {/* Tolerance display */}
      <text x="550" y="192" fill={C.muted} fontSize="9" fontFamily="monospace">TOL &#177;0.5&#176; &#8226; WITHIN SPEC</text>

      {/* Length readout */}
      <rect x="530" y="220" width="200" height="50" rx="8" fill={C.bgDeep} stroke={C.accent} strokeWidth="1" opacity="0.95" />
      <text x="550" y="240" fill={C.muted} fontSize="9" fontFamily="monospace">MEASURED LENGTH</text>
      <text x="550" y="262" fill={C.txt} fontSize="18" fontFamily="monospace" fontWeight="bold">3,249 mm</text>
      <rect x="670" y="248" width="42" height="18" rx="9" fill={C.green} opacity="0.15" />
      <text x="691" y="261" textAnchor="middle" fill={C.green} fontSize="9" fontFamily="monospace" fontWeight="bold">OK</text>

      {/* ── Validation checkmark overlay ───────────────────── */}
      <circle cx="300" cy="200" r="50" fill={C.green} opacity="0">
        <animate attributeName="opacity" values="0;0.08;0.08" dur="2s" fill="freeze" />
      </circle>
      <polyline points="278,200 294,218 324,184" fill="none" stroke={C.green} strokeWidth="4"
        strokeLinecap="round" strokeLinejoin="round" opacity="0">
        <animate attributeName="opacity" values="0;0;0.7" dur="2s" fill="freeze" />
      </polyline>

      {/* ── Caption ────────────────────────────────────────── */}
      <rect x="0" y="370" width="800" height="80" fill="url(#captionFadeP2)" />
      <text x="400" y="410" textAnchor="middle" fill={C.txt} fontSize="20"
        fontFamily="Inter, system-ui, sans-serif" fontWeight="600" letterSpacing="0.5">
        AI validates the step before it becomes irreversible.
      </text>
      <line x1="210" y1="425" x2="590" y2="425" stroke={C.accent} strokeWidth="2" opacity="0.4" />

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
   Data flowing into an audit trail / dashboard — structured
   log entries, timeline, and upstream data export.
   ═══════════════════════════════════════════════════════════════ */
function Scene3() {
  return (
    <g>
      {/* ── Background ────────────────────────────────────── */}
      <rect x="0" y="320" width="800" height="130" fill={C.bgDeep} />
      <line x1="0" y1="320" x2="800" y2="320" stroke={C.line} strokeWidth="0.5" />

      {/* ── Dashboard panel ───────────────────────────────── */}
      <rect x="100" y="60" width="600" height="280" rx="12" fill={C.card} stroke={C.lineLt} strokeWidth="1" />

      {/* Header bar */}
      <rect x="100" y="60" width="600" height="36" rx="12" fill={C.bgDeep} />
      <rect x="100" y="84" width="600" height="12" fill={C.bgDeep} />
      <text x="120" y="84" fill={C.muted} fontSize="10" fontFamily="monospace">EXECUTION RECORD — JOB-2847</text>
      <circle cx="670" cy="78" r="5" fill={C.green} opacity="0.6">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="660" y="82" fill={C.green} fontSize="8" fontFamily="monospace" textAnchor="end">LIVE</text>

      {/* Timeline column */}
      <line x1="160" y1="110" x2="160" y2="320" stroke={C.line} strokeWidth="1" />

      {/* Log entries — appear sequentially */}
      {[
        { y: 120, time: '14:32:01', event: 'Cut confirmed', detail: '3,250 mm ± 1 mm', status: 'pass' },
        { y: 155, time: '14:32:18', event: 'Length verified', detail: 'OCR + manual confirm', status: 'pass' },
        { y: 190, time: '14:33:04', event: 'Bend executed', detail: '90.0° — within tol', status: 'pass' },
        { y: 225, time: '14:33:22', event: 'Angle validated', detail: '±0.3° deviation', status: 'pass' },
        { y: 260, time: '14:33:45', event: 'Step complete', detail: 'Operator: M. Torres', status: 'logged' },
        { y: 295, time: '14:33:46', event: 'Exported to ERP', detail: 'Batch sync queued', status: 'sync' },
      ].map((entry, i) => (
        <g key={i} opacity="0">
          <animate attributeName="opacity" values="0;0;1"
            dur="1.5s" begin={`${i * 0.3}s`} fill="freeze" />

          {/* Timeline dot */}
          <circle cx="160" cy={entry.y + 6} r="4"
            fill={entry.status === 'pass' ? C.green : entry.status === 'sync' ? C.accent : C.muted}
            opacity="0.7" />

          {/* Timestamp */}
          <text x="175" y={entry.y + 10} fill={C.muted} fontSize="9" fontFamily="monospace">
            {entry.time}
          </text>

          {/* Event */}
          <text x="260" y={entry.y + 10} fill={C.txt} fontSize="11" fontFamily="monospace">
            {entry.event}
          </text>

          {/* Detail */}
          <text x="430" y={entry.y + 10} fill={C.muted} fontSize="10" fontFamily="monospace">
            {entry.detail}
          </text>

          {/* Status chip */}
          <rect x="620" y={entry.y - 1} width="50" height="18" rx="9"
            fill={entry.status === 'pass' ? C.green : entry.status === 'sync' ? C.accent : C.muted}
            opacity="0.12" />
          <text x="645" y={entry.y + 12} textAnchor="middle"
            fill={entry.status === 'pass' ? C.green : entry.status === 'sync' ? C.accent : C.muted}
            fontSize="8" fontFamily="monospace" fontWeight="bold">
            {entry.status.toUpperCase()}
          </text>
        </g>
      ))}

      {/* ── Upstream export arrows ─────────────────────────── */}
      <line x1="700" y1="180" x2="760" y2="150" stroke={C.accent2} strokeWidth="1" opacity="0.4"
        strokeDasharray="4 3" />
      <text x="766" y="150" fill={C.accent2} fontSize="8" fontFamily="monospace" opacity="0.6">ERP</text>
      <line x1="700" y1="220" x2="760" y2="220" stroke={C.accent2} strokeWidth="1" opacity="0.4"
        strokeDasharray="4 3" />
      <text x="766" y="224" fill={C.accent2} fontSize="8" fontFamily="monospace" opacity="0.6">QA</text>
      <line x1="700" y1="260" x2="760" y2="290" stroke={C.accent2} strokeWidth="1" opacity="0.4"
        strokeDasharray="4 3" />
      <text x="766" y="294" fill={C.accent2} fontSize="8" fontFamily="monospace" opacity="0.6">AUDIT</text>

      {/* ── Caption ────────────────────────────────────────── */}
      <rect x="0" y="370" width="800" height="80" fill="url(#captionFadeP3)" />
      <text x="400" y="410" textAnchor="middle" fill={C.txt} fontSize="20"
        fontFamily="Inter, system-ui, sans-serif" fontWeight="600" letterSpacing="0.5">
        Every action recorded. Every outcome traceable.
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
  'Every operation starts with a clear, step-by-step plan.',
  'AI validates the step before it becomes irreversible.',
  'Every action recorded. Every outcome traceable.',
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
