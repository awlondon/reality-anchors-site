'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import { fadeUp } from '@/lib/motion';

/* ── scene data ─────────────────────────────────────────────── */

const SCENES = [
  { caption: 'Every bar carries a specification' },
  { caption: 'AI vision confirms the cut' },
  { caption: 'Computation guides every angle' },
  { caption: 'From single cuts to production lines' },
  { caption: 'Execution, verified' },
] as const;

const SCENE_DURATION = 3000; // ms per scene

/* ── colours (from tailwind tokens) ─────────────────────────── */

const C = {
  bg:      '#0d1520',
  line:    '#1e3048',
  muted:   '#8aa8c8',
  txt:     '#e4edf8',
  accent:  '#2e7deb',
  accent2: '#6fb0ff',
  green:   '#38E18E',
} as const;

/* ── individual scene SVGs ──────────────────────────────────── */

/** Scene 1 — Parallel rebar bars with holographic measurement overlays */
function SceneSpecification() {
  return (
    <g>
      {/* 5 parallel rebar bars */}
      {[140, 200, 260, 320, 380].map((y, i) => (
        <g key={y}>
          {/* Bar body */}
          <rect x="180" y={y - 4} width="440" height="8" rx="4" fill={C.accent} opacity={0.5 + i * 0.1} />
          {/* Surface texture dots */}
          {Array.from({ length: 12 }, (_, j) => (
            <circle key={j} cx={200 + j * 35} cy={y} r="1.5" fill={C.accent2} opacity={0.4}>
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${1.5 + j * 0.1}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      ))}

      {/* Holographic measurement lines */}
      <line x1="180" y1="120" x2="180" y2="400" stroke={C.accent2} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.5">
        <animate attributeName="strokeDashoffset" from="0" to="-16" dur="2s" repeatCount="indefinite" />
      </line>
      <line x1="620" y1="120" x2="620" y2="400" stroke={C.accent2} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.5">
        <animate attributeName="strokeDashoffset" from="0" to="-16" dur="2s" repeatCount="indefinite" />
      </line>
      {/* Horizontal measurement */}
      <line x1="180" y1="110" x2="620" y2="110" stroke={C.accent2} strokeWidth="1" opacity="0.6" />
      <polygon points="180,106 180,114 188,110" fill={C.accent2} opacity="0.6" />
      <polygon points="620,106 620,114 612,110" fill={C.accent2} opacity="0.6" />
      {/* Dimension label */}
      <rect x="355" y="96" width="90" height="22" rx="4" fill={C.bg} stroke={C.accent2} strokeWidth="0.5" opacity="0.9" />
      <text x="400" y="112" textAnchor="middle" fill={C.accent2} fontSize="11" fontFamily="monospace">6,000 mm</text>

      {/* Scanning line */}
      <line x1="180" y1="130" x2="620" y2="130" stroke={C.green} strokeWidth="1.5" opacity="0.7">
        <animate attributeName="y1" values="130;390;130" dur="3s" repeatCount="indefinite" />
        <animate attributeName="y2" values="130;390;130" dur="3s" repeatCount="indefinite" />
      </line>
    </g>
  );
}

/** Scene 2 — CNC cutting with sparks and digital readout */
function SceneCut() {
  return (
    <g>
      {/* Rebar bar being cut */}
      <rect x="120" y="256" width="560" height="10" rx="5" fill={C.accent} opacity="0.6" />

      {/* Cutting blade */}
      <rect x="395" y="160" width="10" height="106" rx="2" fill={C.accent2} opacity="0.9">
        <animate attributeName="height" values="60;106;60" dur="1.5s" repeatCount="indefinite" />
      </rect>
      <rect x="392" y="158" width="16" height="6" rx="2" fill={C.txt} opacity="0.7" />

      {/* Cut line glow */}
      <line x1="400" y1="256" x2="400" y2="270" stroke={C.accent2} strokeWidth="2" opacity="0.8">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="0.5s" repeatCount="indefinite" />
      </line>

      {/* Spark particles */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i * 22.5) * Math.PI / 180;
        const dist = 20 + (i % 3) * 15;
        const cx = 400 + Math.cos(angle) * dist;
        const cy = 260 + Math.sin(angle) * dist * 0.6;
        return (
          <circle key={i} cx={cx} cy={cy} r={1 + (i % 2)} fill="#f59e0b" opacity="0">
            <animate attributeName="opacity" values="0;0.9;0" dur={`${0.4 + i * 0.08}s`} begin={`${i * 0.05}s`} repeatCount="indefinite" />
            <animate attributeName="r" values="0;2;0" dur={`${0.4 + i * 0.08}s`} begin={`${i * 0.05}s`} repeatCount="indefinite" />
          </circle>
        );
      })}

      {/* Digital readout panel */}
      <rect x="460" y="170" width="160" height="56" rx="8" fill={C.bg} stroke={C.line} strokeWidth="1" opacity="0.95" />
      <text x="480" y="193" fill={C.muted} fontSize="9" fontFamily="monospace">CUT LENGTH</text>
      <text x="480" y="215" fill={C.txt} fontSize="18" fontFamily="monospace" fontWeight="bold">3,250mm</text>
      {/* Green checkmark */}
      <circle cx="596" cy="198" r="12" fill="none" stroke={C.green} strokeWidth="1.5" opacity="0.8" />
      <polyline points="589,198 594,204 604,192" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="stroke-dasharray" values="0 30;30 0" dur="0.8s" fill="freeze" />
      </polyline>

      {/* Left and right bar sections after cut */}
      <rect x="120" y="290" width="275" height="8" rx="4" fill={C.accent} opacity="0.35" />
      <rect x="405" y="290" width="275" height="8" rx="4" fill={C.accent} opacity="0.35" />
      <text x="258" y="316" textAnchor="middle" fill={C.muted} fontSize="9" fontFamily="monospace">3,250</text>
      <text x="542" y="316" textAnchor="middle" fill={C.muted} fontSize="9" fontFamily="monospace">2,750</text>
    </g>
  );
}

/** Scene 3 — Bending operation with arc measurement HUD */
function SceneBend() {
  return (
    <g>
      {/* Straight rebar section (horizontal) */}
      <rect x="140" y="296" width="240" height="8" rx="4" fill={C.accent} opacity="0.6" />

      {/* Bend arc — 90 degree corner */}
      <path
        d="M380,300 Q400,300 400,280"
        fill="none" stroke={C.accent} strokeWidth="8" strokeLinecap="round" opacity="0.6"
      />

      {/* Bent section (vertical going up) */}
      <rect x="396" y="140" width="8" height="140" rx="4" fill={C.accent} opacity="0.6" />

      {/* Heat glow at bend point */}
      <circle cx="400" cy="290" r="20" fill="url(#bendGlow)">
        <animate attributeName="r" values="16;22;16" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Angular measurement arc */}
      <path
        d="M340,300 A60,60 0 0,0 400,240"
        fill="none" stroke={C.accent2} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7"
      >
        <animate attributeName="strokeDashoffset" from="0" to="-14" dur="2s" repeatCount="indefinite" />
      </path>

      {/* Angle indicator lines */}
      <line x1="400" y1="300" x2="340" y2="300" stroke={C.accent2} strokeWidth="0.8" opacity="0.5" />
      <line x1="400" y1="300" x2="400" y2="240" stroke={C.accent2} strokeWidth="0.8" opacity="0.5" />

      {/* Angle readout */}
      <rect x="440" y="240" width="130" height="48" rx="8" fill={C.bg} stroke={C.accent2} strokeWidth="1" opacity="0.95" />
      <text x="505" y="259" textAnchor="middle" fill={C.muted} fontSize="9" fontFamily="monospace">BEND ANGLE</text>
      <text x="505" y="279" textAnchor="middle" fill={C.txt} fontSize="18" fontFamily="monospace" fontWeight="bold">90.0&deg;</text>

      {/* PASS badge */}
      <rect x="490" y="296" width="52" height="20" rx="10" fill={C.green} opacity="0.2" />
      <text x="516" y="310" textAnchor="middle" fill={C.green} fontSize="10" fontFamily="monospace" fontWeight="bold">PASS</text>

      {/* Crosshair at bend point */}
      <line x1="390" y1="290" x2="410" y2="290" stroke={C.accent2} strokeWidth="0.5" opacity="0.6" />
      <line x1="400" y1="280" x2="400" y2="300" stroke={C.accent2} strokeWidth="0.5" opacity="0.6" />
      <circle cx="400" cy="290" r="6" fill="none" stroke={C.accent2} strokeWidth="0.5" opacity="0.6" />

      {/* Defs for glow */}
      <defs>
        <radialGradient id="bendGlow">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  );
}

/** Scene 4 — System overview: grid of stations with status indicators */
function SceneSystem() {
  const stations = [
    { x: 160, y: 160, label: 'STN-01', status: 'ok' },
    { x: 310, y: 160, label: 'STN-02', status: 'ok' },
    { x: 460, y: 160, label: 'STN-03', status: 'ok' },
    { x: 610, y: 160, label: 'STN-04', status: 'ok' },
    { x: 160, y: 280, label: 'STN-05', status: 'ok' },
    { x: 310, y: 280, label: 'STN-06', status: 'active' },
    { x: 460, y: 280, label: 'STN-07', status: 'ok' },
    { x: 610, y: 280, label: 'STN-08', status: 'ok' },
  ];

  return (
    <g>
      {/* Connection lines between stations */}
      {stations.map((s, i) =>
        stations.slice(i + 1).filter(t =>
          Math.abs(t.x - s.x) <= 150 && Math.abs(t.y - s.y) <= 120
        ).map((t) => (
          <line key={`${s.label}-${t.label}`} x1={s.x} y1={s.y} x2={t.x} y2={t.y}
            stroke={C.line} strokeWidth="1" opacity="0.4"
            strokeDasharray="4 6">
            <animate attributeName="strokeDashoffset" from="0" to="-20" dur="3s" repeatCount="indefinite" />
          </line>
        ))
      )}

      {/* Station nodes */}
      {stations.map((s, i) => (
        <g key={s.label}>
          {/* Outer ring */}
          <circle cx={s.x} cy={s.y} r="28" fill={C.bg} stroke={C.line} strokeWidth="1" />
          {/* Status indicator */}
          <circle cx={s.x} cy={s.y} r="8"
            fill={s.status === 'active' ? C.accent : C.green}
            opacity={s.status === 'active' ? 0.9 : 0.6}
          >
            {s.status === 'active' && (
              <animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite" />
            )}
          </circle>
          {/* Label */}
          <text x={s.x} y={s.y + 44} textAnchor="middle" fill={C.muted} fontSize="9" fontFamily="monospace">{s.label}</text>
          {/* Small status dot */}
          <circle cx={s.x + 20} cy={s.y - 20} r="3" fill={C.green} opacity="0.8">
            <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Progress bar at bottom */}
      <rect x="160" y="370" width="480" height="6" rx="3" fill={C.line} opacity="0.5" />
      <rect x="160" y="370" width="0" height="6" rx="3" fill={C.accent}>
        <animate attributeName="width" values="0;480;480" dur="3s" repeatCount="indefinite" />
      </rect>
      <text x="400" y="395" textAnchor="middle" fill={C.muted} fontSize="9" fontFamily="monospace">PRODUCTION PROGRESS</text>
    </g>
  );
}

/** Scene 5 — Finished product: arranged rebar shapes with completion glow */
function SceneAnchor() {
  const shapes = [
    // L-shapes
    'M180,320 L180,220 L260,220',
    'M320,320 L320,220 L400,220',
    'M460,320 L460,220 L540,220',
    // U-shapes
    'M180,380 L180,350 L260,350 L260,380',
    'M320,380 L320,350 L400,350 L400,380',
    'M460,380 L460,350 L540,350 L540,380',
  ];

  return (
    <g>
      {/* Finished rebar shapes */}
      {shapes.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={C.accent} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
          opacity={0.4 + i * 0.08}
        >
          <animate attributeName="opacity" values={`${0.3 + i * 0.05};${0.6 + i * 0.05};${0.3 + i * 0.05}`}
            dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" />
        </path>
      ))}

      {/* Quantity badge per row */}
      <rect x="580" y="210" width="60" height="22" rx="6" fill={C.bg} stroke={C.green} strokeWidth="1" opacity="0.8" />
      <text x="610" y="225" textAnchor="middle" fill={C.green} fontSize="10" fontFamily="monospace">3 / 3</text>
      <rect x="580" y="345" width="60" height="22" rx="6" fill={C.bg} stroke={C.green} strokeWidth="1" opacity="0.8" />
      <text x="610" y="360" textAnchor="middle" fill={C.green} fontSize="10" fontFamily="monospace">3 / 3</text>

      {/* Central completion glow */}
      <circle cx="400" cy="270" r="60" fill="url(#completionGlow)" opacity="0.4">
        <animate attributeName="r" values="50;70;50" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* RA wordmark */}
      <text x="400" y="176" textAnchor="middle" fill={C.txt} fontSize="14" fontFamily="monospace" fontWeight="bold" letterSpacing="6" opacity="0.7">
        REALITY ANCHORS
      </text>
      <line x1="310" y1="186" x2="490" y2="186" stroke={C.accent} strokeWidth="1" opacity="0.4" />

      {/* Completion badge */}
      <rect x="345" y="140" width="110" height="24" rx="12" fill={C.green} opacity="0.15" />
      <text x="400" y="156" textAnchor="middle" fill={C.green} fontSize="10" fontFamily="monospace" fontWeight="bold">
        COMPLETE
      </text>

      <defs>
        <radialGradient id="completionGlow">
          <stop offset="0%" stopColor={C.accent} stopOpacity="0.4" />
          <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  );
}

/* ── scene components map ───────────────────────────────────── */

const SCENE_COMPONENTS = [SceneSpecification, SceneCut, SceneBend, SceneSystem, SceneAnchor];

/* ── main component ─────────────────────────────────────────── */

export default function VideoShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasFiredView = useRef(false);

  const [activeScene, setActiveScene] = useState(0);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(containerRef, { amount: 0.3 });

  // Cycle scenes
  useEffect(() => {
    if (reduceMotion || !isInView) return;

    const interval = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % SCENES.length);
    }, SCENE_DURATION);

    return () => clearInterval(interval);
  }, [reduceMotion, isInView]);

  // Analytics — fire once
  useEffect(() => {
    if (isInView && !hasFiredView.current) {
      hasFiredView.current = true;
      trackEvent('showcase_animation_view');
    }
  }, [isInView]);

  const ActiveSceneComponent = SCENE_COMPONENTS[activeScene];

  // Reduced motion — static view
  if (reduceMotion) {
    return (
      <section className="bg-bg">
        <div className="max-w-7xl mx-auto px-0 sm:px-6 pb-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent text-center mb-4 px-6 pt-8">
            See It in Action
          </p>
          <div className="relative w-full aspect-video overflow-hidden sm:rounded-2xl border border-line/50 bg-bg-2">
            <svg viewBox="0 0 800 450" className="w-full h-full" role="img" aria-label="AI-guided rebar fabrication process">
              <SceneSpecification />
            </svg>
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-6">
            {SCENES.map((s, i) => (
              <li key={i} className="text-sm text-muted">
                {s.caption}
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-bg">
      <div ref={containerRef} className="max-w-7xl mx-auto px-0 sm:px-6 pb-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent text-center mb-4 px-6 pt-8">
            See It in Action
          </p>

          {/* SVG animation container — 16:9 */}
          <div className="relative w-full aspect-video overflow-hidden sm:rounded-2xl border border-line/50 bg-bg-2">
            <svg viewBox="0 0 800 450" className="w-full h-full" role="img" aria-label="AI-guided rebar fabrication process">
              {/* Subtle grid background */}
              <defs>
                <pattern id="bgGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.line} strokeWidth="0.3" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="800" height="450" fill="url(#bgGrid)" />

              {/* Scene content with crossfade */}
              <AnimatePresence mode="wait">
                <motion.g
                  key={activeScene}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ActiveSceneComponent />
                </motion.g>
              </AnimatePresence>
            </svg>

            {/* Vignette overlays */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-bg/50 via-transparent to-bg/30" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-bg/15 via-transparent to-bg/15" />
          </div>

          {/* Caption */}
          <div className="h-14 flex items-center justify-center px-6 mt-3">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeScene}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="text-base sm:text-lg text-txt font-medium text-center"
              >
                {SCENES[activeScene].caption}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Scene indicator dots */}
          <div className="flex items-center justify-center gap-2 mt-1">
            {SCENES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveScene(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeScene
                    ? 'bg-accent w-6'
                    : 'bg-line hover:bg-muted/50'
                }`}
                aria-label={`Scene ${i + 1}: ${SCENES[i].caption}`}
                aria-current={i === activeScene ? 'step' : undefined}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
