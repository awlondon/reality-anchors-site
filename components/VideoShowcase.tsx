'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import { fadeUp } from '@/lib/motion';

const SCENE_DURATION = 3000;
const SCENE_COUNT = 5;

/* ── palette ────────────────────────────────────────────────── */
const C = {
  bg:       '#0d1520',
  bgDeep:   '#070b12',
  card:     '#111d2c',
  line:     '#1e3048',
  lineLt:   '#263d5a',
  muted:    '#8aa8c8',
  txt:      '#e4edf8',
  accent:   '#2e7deb',
  accent2:  '#6fb0ff',
  green:    '#38E18E',
  amber:    '#f59e0b',
  amberLt:  '#fbbf24',
  steel:    '#4a6a8a',
  steelDk:  '#2a4060',
} as const;

/* ═══════════════════════════════════════════════════════════════
   SCENE 1 — THE RAW MATERIAL
   Rebar yard at dawn: bundled bars stacked on supports with
   holographic AI measurement overlay scanning across them.
   ═══════════════════════════════════════════════════════════════ */
function Scene1() {
  return (
    <g>
      {/* ── Ground / yard surface ─────────────────────────────── */}
      <rect x="0" y="340" width="800" height="110" fill={C.bgDeep} />
      <line x1="0" y1="340" x2="800" y2="340" stroke={C.line} strokeWidth="0.5" />
      {/* Concrete texture lines */}
      {[360, 380, 400, 420].map(y => (
        <line key={y} x1="0" y1={y} x2="800" y2={y} stroke={C.line} strokeWidth="0.2" opacity="0.2" />
      ))}

      {/* ── Support cradles (A-frames) ────────────────────────── */}
      {[160, 440, 660].map(x => (
        <g key={x}>
          <path d={`M${x - 20},340 L${x},240 L${x + 20},340`} fill="none" stroke={C.steelDk} strokeWidth="3" />
          <rect x={x - 22} y={240} width="44" height="4" rx="2" fill={C.steelDk} />
        </g>
      ))}

      {/* ── Rebar bundle: 7 bars stacked ─────────────────────── */}
      {/* Bottom row — 4 bars */}
      {[0, 1, 2, 3].map(i => {
        const cx = 160 + (660 - 160) / 2;
        const y = 232 - i * 0;
        const xOff = -24 + i * 16;
        return (
          <g key={`b${i}`}>
            {/* Bar shadow */}
            <ellipse cx={cx} cy={238} rx="270" ry="3" fill={C.bgDeep} opacity="0.3" />
            {/* Bar body — long cylinder */}
            <rect x="110" y={y + xOff + 200} width="580" height="12" rx="6"
              fill={`url(#barGrad)`} opacity={0.85} />
            {/* Ribs along bar */}
            {Array.from({ length: 24 }, (_, j) => (
              <rect key={j} x={130 + j * 24} y={y + xOff + 200} width="2" height="12" rx="1"
                fill={C.accent2} opacity="0.12" />
            ))}
          </g>
        );
      })}
      {/* Top row — 3 bars */}
      {[0, 1, 2].map(i => {
        const xOff = -16 + i * 16;
        return (
          <rect key={`t${i}`} x="130" y={188 + xOff} width="540" height="12" rx="6"
            fill={`url(#barGrad)`} opacity={0.75} />
        );
      })}

      {/* ── AI scanning beam ──────────────────────────────────── */}
      <rect x="100" y="160" width="4" height="90" fill={C.green} opacity="0.6" rx="2">
        <animate attributeName="x" values="100;680;100" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="100" y="160" width="4" height="90" fill={C.green} opacity="0.15" rx="2"
        filter="url(#scanGlow)">
        <animate attributeName="x" values="100;680;100" dur="3s" repeatCount="indefinite" />
      </rect>

      {/* ── HUD dimension overlays ────────────────────────────── */}
      {/* Length callout */}
      <line x1="110" y1="155" x2="690" y2="155" stroke={C.accent2} strokeWidth="0.8" opacity="0.5" />
      <polygon points="110,152 110,158 117,155" fill={C.accent2} opacity="0.5" />
      <polygon points="690,152 690,158 683,155" fill={C.accent2} opacity="0.5" />
      <rect x="355" y="143" width="90" height="18" rx="3" fill={C.bgDeep} stroke={C.accent2} strokeWidth="0.5" opacity="0.9" />
      <text x="400" y="156" textAnchor="middle" fill={C.accent2} fontSize="10" fontFamily="monospace">6,000 mm</text>

      {/* Diameter callout */}
      <line x1="700" y1="200" x2="700" y2="232" stroke={C.accent2} strokeWidth="0.8" opacity="0.4" />
      <rect x="708" y="208" width="66" height="16" rx="3" fill={C.bgDeep} stroke={C.accent2} strokeWidth="0.5" opacity="0.8" />
      <text x="741" y="220" textAnchor="middle" fill={C.accent2} fontSize="9" fontFamily="monospace">&#x2300; 16mm</text>

      {/* Grade tag */}
      <rect x="110" y="270" width="80" height="20" rx="4" fill={C.card} stroke={C.line} strokeWidth="0.5" />
      <text x="150" y="284" textAnchor="middle" fill={C.muted} fontSize="9" fontFamily="monospace">N16 500L</text>

      {/* ── Caption graphic — lower third ─────────────────────── */}
      <rect x="0" y="370" width="800" height="80" fill="url(#captionFade1)" />
      <text x="400" y="410" textAnchor="middle" fill={C.txt} fontSize="20" fontFamily="Inter, system-ui, sans-serif" fontWeight="600" letterSpacing="0.5">
        Every bar of steel carries a specification.
      </text>
      <line x1="250" y1="425" x2="550" y2="425" stroke={C.accent} strokeWidth="2" opacity="0.4" />

      {/* ── Defs ──────────────────────────────────────────────── */}
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.steel} />
          <stop offset="50%" stopColor={C.steelDk} />
          <stop offset="100%" stopColor="#1a3050" />
        </linearGradient>
        <linearGradient id="captionFade1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.bg} stopOpacity="0" />
          <stop offset="40%" stopColor={C.bgDeep} stopOpacity="0.9" />
          <stop offset="100%" stopColor={C.bgDeep} />
        </linearGradient>
        <filter id="scanGlow">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCENE 2 — THE CUT
   CNC rebar shear machine cutting a bar. Sparks fly. Digital
   readout confirms "3,250 mm" with a green checkmark.
   ═══════════════════════════════════════════════════════════════ */
function Scene2() {
  return (
    <g>
      {/* ── Machine body ──────────────────────────────────────── */}
      {/* Base */}
      <rect x="260" y="260" width="280" height="80" rx="6" fill={C.card} stroke={C.line} strokeWidth="1" />
      {/* Upper housing */}
      <rect x="280" y="140" width="240" height="120" rx="8" fill={C.steelDk} stroke={C.lineLt} strokeWidth="1" />
      {/* Control panel */}
      <rect x="290" y="150" width="60" height="40" rx="4" fill={C.bgDeep} stroke={C.line} strokeWidth="0.5" />
      <circle cx="310" cy="162" r="3" fill={C.green} opacity="0.8">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="325" cy="162" r="3" fill={C.accent} opacity="0.6" />
      <rect x="296" y="174" width="48" height="8" rx="2" fill={C.accent} opacity="0.2" />
      {/* Machine label */}
      <text x="400" y="170" textAnchor="middle" fill={C.muted} fontSize="11" fontFamily="monospace" opacity="0.6">CNC-SHEAR-04</text>

      {/* ── Rebar passing through ─────────────────────────────── */}
      {/* Left side (feed) */}
      <rect x="40" y="284" width="330" height="12" rx="6" fill="url(#barGrad2)" />
      {/* Right side (cut) */}
      <rect x="420" y="284" width="340" height="12" rx="6" fill="url(#barGrad2)" opacity="0.6" />

      {/* ── Shear blade ───────────────────────────────────────── */}
      <rect x="370" y="260" width="60" height="0" fill={C.accent2} opacity="0.9" rx="2">
        <animate attributeName="height" values="0;30;0" dur="1.2s" repeatCount="indefinite" />
      </rect>
      {/* Blade edge */}
      <line x1="370" y1="284" x2="430" y2="284" stroke={C.txt} strokeWidth="1.5" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.2s" repeatCount="indefinite" />
      </line>

      {/* ── Sparks ────────────────────────────────────────────── */}
      {Array.from({ length: 20 }, (_, i) => {
        const angle = ((i * 18) - 90) * Math.PI / 180;
        const r1 = 8 + (i % 4) * 8;
        const r2 = r1 + 15 + (i % 3) * 10;
        const x1 = 400 + Math.cos(angle) * r1;
        const y1 = 284 + Math.sin(angle) * r1 * 0.5;
        const x2 = 400 + Math.cos(angle) * r2;
        const y2 = 284 + Math.sin(angle) * r2 * 0.5;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={i % 3 === 0 ? C.amberLt : C.amber}
            strokeWidth={1 + (i % 2) * 0.5} strokeLinecap="round" opacity="0">
            <animate attributeName="opacity" values="0;0.9;0"
              dur={`${0.3 + (i % 5) * 0.12}s`} begin={`${(i % 7) * 0.1}s`} repeatCount="indefinite" />
          </line>
        );
      })}
      {/* Central cut flash */}
      <circle cx="400" cy="284" r="6" fill={C.amber} opacity="0">
        <animate attributeName="opacity" values="0;0.7;0" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="r" values="4;10;4" dur="0.6s" repeatCount="indefinite" />
      </circle>

      {/* ── Rollers / feed wheels ──────────────────────────────── */}
      {[310, 490].map(x => (
        <g key={x}>
          <circle cx={x} cy="278" r="10" fill="none" stroke={C.lineLt} strokeWidth="2" />
          <circle cx={x} cy="296" r="10" fill="none" stroke={C.lineLt} strokeWidth="2" />
          <line x1={x - 4} y1={x === 310 ? 278 : 278} x2={x + 4} y2={x === 310 ? 278 : 278}
            stroke={C.muted} strokeWidth="1">
            <animateTransform attributeName="transform" type="rotate"
              from={`0 ${x} 278`} to={`360 ${x} 278`} dur="2s" repeatCount="indefinite" />
          </line>
        </g>
      ))}

      {/* ── Digital readout panel ──────────────────────────────── */}
      <rect x="540" y="150" width="200" height="80" rx="8" fill={C.bgDeep} stroke={C.accent} strokeWidth="1" opacity="0.95" />
      <text x="560" y="172" fill={C.muted} fontSize="9" fontFamily="monospace">CUT LENGTH</text>
      <text x="560" y="200" fill={C.txt} fontSize="26" fontFamily="monospace" fontWeight="bold">3,250</text>
      <text x="672" y="200" fill={C.muted} fontSize="14" fontFamily="monospace">mm</text>
      {/* Status bar */}
      <rect x="560" y="210" width="160" height="4" rx="2" fill={C.line} />
      <rect x="560" y="210" width="160" height="4" rx="2" fill={C.green} opacity="0.8">
        <animate attributeName="width" values="0;160" dur="1.2s" fill="freeze" />
      </rect>
      {/* Checkmark */}
      <circle cx="718" cy="176" r="14" fill={C.green} opacity="0.15" />
      <polyline points="710,176 716,183 728,169" fill="none" stroke={C.green} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* ── Caption graphic ───────────────────────────────────── */}
      <rect x="0" y="370" width="800" height="80" fill="url(#captionFade2)" />
      <text x="400" y="410" textAnchor="middle" fill={C.txt} fontSize="20" fontFamily="Inter, system-ui, sans-serif" fontWeight="600" letterSpacing="0.5">
        AI vision confirms the cut before the blade moves.
      </text>
      <line x1="220" y1="425" x2="580" y2="425" stroke={C.accent} strokeWidth="2" opacity="0.4" />

      <defs>
        <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.steel} />
          <stop offset="100%" stopColor={C.steelDk} />
        </linearGradient>
        <linearGradient id="captionFade2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.bg} stopOpacity="0" />
          <stop offset="40%" stopColor={C.bgDeep} stopOpacity="0.9" />
          <stop offset="100%" stopColor={C.bgDeep} />
        </linearGradient>
      </defs>
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCENE 3 — THE BEND
   Bending machine forming a 90-degree bend. Heat glow at the
   bend point. Angular measurement HUD shows "90.0° — PASS".
   ═══════════════════════════════════════════════════════════════ */
function Scene3() {
  return (
    <g>
      {/* ── Bending machine body ──────────────────────────────── */}
      <rect x="220" y="220" width="360" height="130" rx="8" fill={C.card} stroke={C.line} strokeWidth="1" />
      {/* Working table surface */}
      <rect x="200" y="220" width="400" height="8" rx="2" fill={C.steelDk} />

      {/* ── Central mandrel (bending pin) ─────────────────────── */}
      <circle cx="400" cy="260" r="18" fill={C.steelDk} stroke={C.lineLt} strokeWidth="2" />
      <circle cx="400" cy="260" r="6" fill={C.line} />

      {/* ── Rebar being bent ──────────────────────────────────── */}
      {/* Horizontal feed section */}
      <rect x="60" y="252" width="322" height="14" rx="7" fill="url(#barGrad3)" />
      {/* Bend arc */}
      <path d="M382,259 Q400,259 400,241" fill="none" stroke={C.steel} strokeWidth="14" strokeLinecap="round" />
      {/* Vertical section after bend */}
      <rect x="393" y="100" width="14" height="141" rx="7" fill="url(#barGrad3)" />

      {/* ── Heat glow at bend point ───────────────────────────── */}
      <circle cx="392" cy="250" r="25" fill="url(#heatGlow3)">
        <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* ── Bending arm (rotating element) ────────────────────── */}
      <line x1="400" y1="260" x2="400" y2="120" stroke={C.lineLt} strokeWidth="4" strokeLinecap="round" />
      <circle cx="400" cy="120" r="8" fill={C.steelDk} stroke={C.lineLt} strokeWidth="1.5" />

      {/* ── Angular measurement HUD ───────────────────────────── */}
      {/* Reference lines */}
      <line x1="400" y1="260" x2="310" y2="260" stroke={C.accent2} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <line x1="400" y1="260" x2="400" y2="170" stroke={C.accent2} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      {/* Angle arc */}
      <path d="M340,260 A60,60 0 0,0 400,200" fill="none" stroke={C.accent2} strokeWidth="1.5" opacity="0.6">
        <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="1.5s" fill="freeze" />
      </path>
      {/* Small angle marker */}
      <rect x="378" y="238" width="16" height="16" fill="none" stroke={C.accent2} strokeWidth="0.8" opacity="0.4" />

      {/* ── Readout panel ─────────────────────────────────────── */}
      <rect x="510" y="140" width="210" height="90" rx="8" fill={C.bgDeep} stroke={C.accent} strokeWidth="1" opacity="0.95" />
      <text x="530" y="164" fill={C.muted} fontSize="9" fontFamily="monospace">BEND ANGLE</text>
      <text x="530" y="198" fill={C.txt} fontSize="32" fontFamily="monospace" fontWeight="bold">90.0&#176;</text>
      {/* PASS badge */}
      <rect x="638" y="152" width="62" height="24" rx="12" fill={C.green} opacity="0.15" />
      <text x="669" y="168" textAnchor="middle" fill={C.green} fontSize="11" fontFamily="monospace" fontWeight="bold">PASS</text>
      {/* Tolerance */}
      <text x="530" y="220" fill={C.muted} fontSize="9" fontFamily="monospace">TOL &#177;0.5&#176; &bull; RADIUS 4d</text>

      {/* ── Crosshair at bend center ──────────────────────────── */}
      <circle cx="392" cy="250" r="30" fill="none" stroke={C.accent2} strokeWidth="0.5" opacity="0.3" />
      <line x1="380" y1="250" x2="404" y2="250" stroke={C.accent2} strokeWidth="0.5" opacity="0.5" />
      <line x1="392" y1="238" x2="392" y2="262" stroke={C.accent2} strokeWidth="0.5" opacity="0.5" />

      {/* ── Caption graphic ───────────────────────────────────── */}
      <rect x="0" y="370" width="800" height="80" fill="url(#captionFade3)" />
      <text x="400" y="410" textAnchor="middle" fill={C.txt} fontSize="20" fontFamily="Inter, system-ui, sans-serif" fontWeight="600" letterSpacing="0.5">
        Computation guides every angle to specification.
      </text>
      <line x1="230" y1="425" x2="570" y2="425" stroke={C.accent} strokeWidth="2" opacity="0.4" />

      <defs>
        <linearGradient id="barGrad3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.steel} />
          <stop offset="100%" stopColor={C.steelDk} />
        </linearGradient>
        <radialGradient id="heatGlow3">
          <stop offset="0%" stopColor={C.amber} stopOpacity="0.6" />
          <stop offset="60%" stopColor={C.amber} stopOpacity="0.1" />
          <stop offset="100%" stopColor={C.amber} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="captionFade3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.bg} stopOpacity="0" />
          <stop offset="40%" stopColor={C.bgDeep} stopOpacity="0.9" />
          <stop offset="100%" stopColor={C.bgDeep} />
        </linearGradient>
      </defs>
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCENE 4 — THE SYSTEM
   Wide workshop view: multiple bending/cutting stations all
   connected to a central control dashboard. Status grid.
   ═══════════════════════════════════════════════════════════════ */
function Scene4() {
  const stations = [
    { x: 100, y: 190, label: 'SHEAR-01', ok: true },
    { x: 260, y: 190, label: 'BEND-01', ok: true },
    { x: 420, y: 190, label: 'BEND-02', ok: true },
    { x: 580, y: 190, label: 'SHEAR-02', ok: true },
    { x: 100, y: 300, label: 'WELD-01', ok: true },
    { x: 260, y: 300, label: 'BEND-03', ok: false },
    { x: 420, y: 300, label: 'QC-01', ok: true },
    { x: 580, y: 300, label: 'PACK-01', ok: true },
  ];

  return (
    <g>
      {/* ── Factory ceiling / overhead structure ──────────────── */}
      <rect x="0" y="0" width="800" height="80" fill={C.bgDeep} />
      {/* Overhead beams */}
      {[100, 250, 400, 550, 700].map(x => (
        <rect key={x} x={x - 4} y="0" width="8" height="130" fill={C.steelDk} opacity="0.3" />
      ))}
      {/* Overhead lights (blue LED strips) */}
      {[200, 400, 600].map(x => (
        <g key={x}>
          <rect x={x - 30} y="75" width="60" height="3" rx="1" fill={C.accent} opacity="0.4" />
          <ellipse cx={x} cy="130" rx="80" ry="50" fill={C.accent} opacity="0.02" />
        </g>
      ))}

      {/* ── Connection lines (data flow) ──────────────────────── */}
      {stations.map((s, i) =>
        stations.slice(i + 1).filter(t =>
          Math.abs(t.x - s.x) <= 200 && Math.abs(t.y - s.y) <= 150
        ).map(t => (
          <line key={`${s.label}-${t.label}`} x1={s.x} y1={s.y} x2={t.x} y2={t.y}
            stroke={C.line} strokeWidth="0.8" strokeDasharray="6 8" opacity="0.3">
            <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="3s" repeatCount="indefinite" />
          </line>
        ))
      )}

      {/* ── Station nodes ─────────────────────────────────────── */}
      {stations.map((s, i) => (
        <g key={s.label}>
          {/* Machine silhouette */}
          <rect x={s.x - 50} y={s.y - 30} width="100" height="60" rx="6"
            fill={C.card} stroke={C.line} strokeWidth="0.8" />
          {/* Status light */}
          <circle cx={s.x + 38} cy={s.y - 18} r="4"
            fill={s.ok ? C.green : C.amber} opacity={s.ok ? 0.8 : 0.9}>
            {!s.ok && <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />}
          </circle>
          {/* Station icon (simplified machine graphic) */}
          <rect x={s.x - 20} y={s.y - 12} width="40" height="24" rx="3"
            fill="none" stroke={s.ok ? C.accent : C.amber} strokeWidth="0.8" opacity="0.5" />
          <circle cx={s.x} cy={s.y} r="3" fill={s.ok ? C.accent : C.amber} opacity="0.5" />
          {/* Label */}
          <text x={s.x} y={s.y + 44} textAnchor="middle" fill={C.muted} fontSize="8" fontFamily="monospace">
            {s.label}
          </text>
          {/* Data pulse */}
          <circle cx={s.x} cy={s.y - 30} r="2" fill={C.accent2} opacity="0">
            <animate attributeName="opacity" values="0;0.8;0" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="cy" values={`${s.y - 30};${s.y - 50};${s.y - 30}`}
              dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* ── Central dashboard ─────────────────────────────────── */}
      <rect x="680" y="100" width="110" height="130" rx="6" fill={C.bgDeep} stroke={C.accent} strokeWidth="1" opacity="0.95" />
      <text x="735" y="118" textAnchor="middle" fill={C.accent2} fontSize="8" fontFamily="monospace">LIVE STATUS</text>
      {/* Mini status grid */}
      {stations.map((s, i) => {
        const gx = 694 + (i % 4) * 22;
        const gy = 130 + Math.floor(i / 4) * 22;
        return (
          <g key={`grid-${i}`}>
            <rect x={gx} y={gy} width="16" height="16" rx="2" fill={s.ok ? C.green : C.amber} opacity={s.ok ? 0.2 : 0.3} />
            <rect x={gx + 2} y={gy + 2} width="12" height="12" rx="1" fill={s.ok ? C.green : C.amber} opacity={s.ok ? 0.5 : 0.7}>
              {!s.ok && <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite" />}
            </rect>
          </g>
        );
      })}
      {/* Summary */}
      <text x="735" y="190" textAnchor="middle" fill={C.green} fontSize="14" fontFamily="monospace" fontWeight="bold">7/8</text>
      <text x="735" y="205" textAnchor="middle" fill={C.muted} fontSize="7" fontFamily="monospace">STATIONS OK</text>
      {/* Throughput */}
      <text x="735" y="222" textAnchor="middle" fill={C.txt} fontSize="10" fontFamily="monospace">142 t/hr</text>

      {/* ── Caption graphic ───────────────────────────────────── */}
      <rect x="0" y="370" width="800" height="80" fill="url(#captionFade4)" />
      <text x="400" y="410" textAnchor="middle" fill={C.txt} fontSize="20" fontFamily="Inter, system-ui, sans-serif" fontWeight="600" letterSpacing="0.5">
        From single cuts to entire production lines.
      </text>
      <line x1="230" y1="425" x2="570" y2="425" stroke={C.accent} strokeWidth="2" opacity="0.4" />

      <defs>
        <linearGradient id="captionFade4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.bg} stopOpacity="0" />
          <stop offset="40%" stopColor={C.bgDeep} stopOpacity="0.9" />
          <stop offset="100%" stopColor={C.bgDeep} />
        </linearGradient>
      </defs>
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCENE 5 — THE ANCHOR
   Finished fabricated rebar shapes neatly arranged on transport
   racks. Completion pulse. "Reality Anchors" wordmark.
   ═══════════════════════════════════════════════════════════════ */
function Scene5() {
  // Finished rebar shapes
  const shapes = [
    // Row 1 — L-shapes (stirrups)
    { d: 'M120,200 L120,150 L200,150', label: 'L-01' },
    { d: 'M240,200 L240,150 L320,150', label: 'L-02' },
    { d: 'M360,200 L360,150 L440,150', label: 'L-03' },
    { d: 'M480,200 L480,150 L560,150', label: 'L-04' },
    // Row 2 — U-shapes (ties)
    { d: 'M120,290 L120,260 L220,260 L220,290', label: 'U-01' },
    { d: 'M260,290 L260,260 L360,260 L360,290', label: 'U-02' },
    { d: 'M400,290 L400,260 L500,260 L500,290', label: 'U-03' },
    { d: 'M540,290 L540,260 L640,260 L640,290', label: 'U-04' },
  ];

  return (
    <g>
      {/* ── Transport rack ────────────────────────────────────── */}
      {/* Horizontal rails */}
      <rect x="80" y="210" width="600" height="4" rx="2" fill={C.steelDk} />
      <rect x="80" y="300" width="600" height="4" rx="2" fill={C.steelDk} />
      {/* Vertical supports */}
      {[80, 340, 600, 680].map(x => (
        <rect key={x} x={x} y="130" width="4" height="210" rx="2" fill={C.steelDk} opacity="0.5" />
      ))}

      {/* ── Finished shapes ───────────────────────────────────── */}
      {shapes.map((s, i) => (
        <g key={s.label}>
          <path d={s.d} fill="none" stroke={C.accent} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"
            opacity={0.5 + i * 0.04}>
            <animate attributeName="opacity" values={`${0.4 + i * 0.03};${0.7 + i * 0.03};${0.4 + i * 0.03}`}
              dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
          </path>
          {/* Individual check */}
          <circle cx={i < 4 ? 200 + (i * 120) + 10 : 220 + ((i - 4) * 140) + 10}
            cy={i < 4 ? 140 : 250} r="6" fill={C.green} opacity="0.2" />
          <text x={i < 4 ? 200 + (i * 120) + 10 : 220 + ((i - 4) * 140) + 10}
            y={i < 4 ? 144 : 254} textAnchor="middle" fill={C.green} fontSize="8" fontFamily="monospace">&#10003;</text>
        </g>
      ))}

      {/* ── Batch counter ─────────────────────────────────────── */}
      <rect x="700" y="140" width="80" height="70" rx="6" fill={C.bgDeep} stroke={C.green} strokeWidth="1" opacity="0.9" />
      <text x="740" y="160" textAnchor="middle" fill={C.muted} fontSize="8" fontFamily="monospace">BATCH</text>
      <text x="740" y="185" textAnchor="middle" fill={C.green} fontSize="22" fontFamily="monospace" fontWeight="bold">8/8</text>
      <text x="740" y="200" textAnchor="middle" fill={C.green} fontSize="8" fontFamily="monospace">COMPLETE</text>

      {/* ── Completion pulse ───────────────────────────────────── */}
      <circle cx="400" cy="230" r="80" fill="none" stroke={C.accent} strokeWidth="1" opacity="0">
        <animate attributeName="r" values="60;140" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="400" cy="230" r="60" fill="none" stroke={C.accent2} strokeWidth="0.5" opacity="0">
        <animate attributeName="r" values="40;120" dur="3s" begin="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0" dur="3s" begin="1s" repeatCount="indefinite" />
      </circle>

      {/* ── Caption + wordmark graphic ────────────────────────── */}
      <rect x="0" y="340" width="800" height="110" fill="url(#captionFade5)" />
      {/* Wordmark */}
      <text x="400" y="386" textAnchor="middle" fill={C.txt} fontSize="16" fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700" letterSpacing="4" opacity="0.85">
        REALITY ANCHORS
      </text>
      <line x1="280" y1="396" x2="520" y2="396" stroke={C.accent} strokeWidth="2" opacity="0.5" />
      {/* Tagline */}
      <text x="400" y="420" textAnchor="middle" fill={C.txt} fontSize="20" fontFamily="Inter, system-ui, sans-serif"
        fontWeight="600" letterSpacing="0.5">
        Execution, verified.
      </text>

      <defs>
        <linearGradient id="captionFade5" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.bg} stopOpacity="0" />
          <stop offset="30%" stopColor={C.bgDeep} stopOpacity="0.85" />
          <stop offset="100%" stopColor={C.bgDeep} />
        </linearGradient>
      </defs>
    </g>
  );
}

/* ── scene registry ─────────────────────────────────────────── */
const SCENE_COMPONENTS = [Scene1, Scene2, Scene3, Scene4, Scene5];

const CAPTIONS = [
  'Every bar of steel carries a specification.',
  'AI vision confirms the cut before the blade moves.',
  'Computation guides every angle to specification.',
  'From single cuts to entire production lines.',
  'Execution, verified.',
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function VideoShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasFiredView = useRef(false);
  const [activeScene, setActiveScene] = useState(0);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(containerRef, { amount: 0.3 });

  // Cycle scenes
  useEffect(() => {
    if (reduceMotion || !isInView) return;
    const id = setInterval(() => {
      setActiveScene(prev => (prev + 1) % SCENE_COUNT);
    }, SCENE_DURATION);
    return () => clearInterval(id);
  }, [reduceMotion, isInView]);

  // Analytics
  useEffect(() => {
    if (isInView && !hasFiredView.current) {
      hasFiredView.current = true;
      trackEvent('showcase_animation_view');
    }
  }, [isInView]);

  const ActiveScene = SCENE_COMPONENTS[activeScene];

  // Reduced motion — static
  if (reduceMotion) {
    return (
      <section className="bg-bg">
        <div className="max-w-7xl mx-auto px-0 sm:px-6 pb-8">
          <div className="relative w-full aspect-video overflow-hidden sm:rounded-2xl border border-line/50 bg-bg-2">
            <svg viewBox="0 0 800 450" className="w-full h-full" role="img"
              aria-label="AI-guided rebar fabrication process overview">
              <rect width="800" height="450" fill={C.bg} />
              <Scene1 />
            </svg>
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-6">
            {CAPTIONS.map((c, i) => (
              <li key={i} className="text-sm text-muted">{c}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

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
              aria-label="AI-guided rebar fabrication process overview">
              {/* Background */}
              <rect width="800" height="450" fill={C.bg} />
              {/* Grid */}
              <defs>
                <pattern id="mainGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.line} strokeWidth="0.2" opacity="0.25" />
                </pattern>
              </defs>
              <rect width="800" height="450" fill="url(#mainGrid)" />

              {/* Active scene */}
              <AnimatePresence mode="wait">
                <motion.g
                  key={activeScene}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
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
