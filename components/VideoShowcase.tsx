'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import { fadeUp } from '@/lib/motion';

const SCENE_DURATION = 3000;
const SCENE_COUNT = 3;
const LOOPS_BEFORE_SETTLE = 2; // cycle through all scenes twice, then settle

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
   SETTLED STATE — CONTINUOUS BENDING LOOP
   After the intro scenes play twice, the animation settles into
   this mesmerising bending loop: a rebar feeds in, a mandrel
   bends it to 90°, the finished piece slides out, and a new bar
   feeds in. Pure SVG <animate> — no React state needed.
   ═══════════════════════════════════════════════════════════════ */
function BendingLoop() {
  /* Total loop period = 6s
     0.0–1.2s  — bar feeds in from left
     1.2–3.2s  — bend happens (arm rotates, heat glow appears)
     3.2–4.2s  — HUD confirms 90.0° PASS
     4.2–5.4s  — finished piece slides out right
     5.4–6.0s  — brief pause, then repeat                       */
  const DUR = '6s';

  return (
    <g>
      {/* ── Machine body ──────────────────────────────────────── */}
      <rect x="260" y="220" width="280" height="130" rx="8" fill={C.card} stroke={C.line} strokeWidth="1" />
      {/* Working surface */}
      <rect x="240" y="220" width="320" height="8" rx="2" fill={C.steelDk} />
      {/* Upper housing */}
      <rect x="310" y="140" width="180" height="80" rx="6" fill={C.steelDk} stroke={C.lineLt} strokeWidth="0.8" />
      {/* Machine label */}
      <text x="400" y="170" textAnchor="middle" fill={C.muted} fontSize="10" fontFamily="monospace" opacity="0.5">
        CNC-BEND-01
      </text>
      {/* Status light */}
      <circle cx="480" cy="152" r="4" fill={C.green} opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* ── Central mandrel ───────────────────────────────────── */}
      <circle cx="400" cy="270" r="20" fill={C.steelDk} stroke={C.lineLt} strokeWidth="2.5" />
      <circle cx="400" cy="270" r="7" fill={C.line} />
      {/* Mandrel cross */}
      <line x1="393" y1="270" x2="407" y2="270" stroke={C.lineLt} strokeWidth="1" />
      <line x1="400" y1="263" x2="400" y2="277" stroke={C.lineLt} strokeWidth="1" />

      {/* ── Feed rollers ──────────────────────────────────────── */}
      {[280, 520].map(x => (
        <g key={x}>
          <circle cx={x} cy="260" r="12" fill="none" stroke={C.lineLt} strokeWidth="1.5" />
          <circle cx={x} cy="280" r="12" fill="none" stroke={C.lineLt} strokeWidth="1.5" />
          {/* Roller rotation tick */}
          <line x1={x - 5} y1="260" x2={x + 5} y2="260" stroke={C.muted} strokeWidth="1">
            <animateTransform attributeName="transform" type="rotate"
              from={`0 ${x} 260`} to={`360 ${x} 260`} dur="1.5s" repeatCount="indefinite" />
          </line>
          <line x1={x - 5} y1="280" x2={x + 5} y2="280" stroke={C.muted} strokeWidth="1">
            <animateTransform attributeName="transform" type="rotate"
              from={`360 ${x} 280`} to={`0 ${x} 280`} dur="1.5s" repeatCount="indefinite" />
          </line>
        </g>
      ))}

      {/* ── REBAR — incoming straight bar ─────────────────────── */}
      {/* This bar slides in from far left to the mandrel */}
      <rect y="262" width="340" height="14" rx="7" fill="url(#bendBarGrad)">
        {/* x: starts off-screen (-400), feeds to mandrel (60) */}
        <animate attributeName="x" values="-400;60;60;60;60;-400"
          keyTimes="0;0.2;0.53;0.7;0.9;1" dur={DUR} repeatCount="indefinite" />
        {/* Fade out once bend starts */}
        <animate attributeName="opacity" values="0;1;1;0;0;0"
          keyTimes="0;0.15;0.2;0.35;0.9;1" dur={DUR} repeatCount="indefinite" />
      </rect>

      {/* ── REBAR — the bent piece (animated from straight to 90°) ── */}
      {/* Horizontal portion that stays at the mandrel */}
      <rect x="60" y="262" width="332" height="14" rx="7" fill="url(#bendBarGrad)" opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;1;0"
          keyTimes="0;0.19;0.22;0.7;0.88;0.92" dur={DUR} repeatCount="indefinite" />
      </rect>
      {/* Bend arc — appears during the bend */}
      <path d="M392,270 Q400,270 400,250" fill="none" stroke={C.steel} strokeWidth="14"
        strokeLinecap="round" opacity="0">
        <animate attributeName="opacity" values="0;0;0;1;1;1;0"
          keyTimes="0;0.2;0.25;0.4;0.7;0.88;0.92" dur={DUR} repeatCount="indefinite" />
      </path>
      {/* Vertical portion after bend */}
      <rect x="393" y="100" width="14" height="150" rx="7" fill="url(#bendBarGrad)" opacity="0">
        <animate attributeName="opacity" values="0;0;0;1;1;1;0"
          keyTimes="0;0.2;0.35;0.53;0.7;0.88;0.92" dur={DUR} repeatCount="indefinite" />
      </rect>

      {/* ── Finished piece slides out (whole L-shape moves right) ── */}
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0"
          keyTimes="0;0.69;0.72;0.88;0.92" dur={DUR} repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate"
          values="0,0;0,0;0,0;350,0;350,0"
          keyTimes="0;0.69;0.72;0.9;1" dur={DUR} repeatCount="indefinite" />
        <rect x="60" y="262" width="332" height="14" rx="7" fill={C.accent} opacity="0.5" />
        <path d="M392,270 Q400,270 400,250" fill="none" stroke={C.accent} strokeWidth="14" strokeLinecap="round" opacity="0.5" />
        <rect x="393" y="100" width="14" height="150" rx="7" fill={C.accent} opacity="0.5" />
      </g>

      {/* ── Bending arm — rotates 0° to 90° during bend ─────── */}
      <g>
        <animateTransform attributeName="transform" type="rotate"
          values="0,400,270;0,400,270;0,400,270;-90,400,270;-90,400,270;-90,400,270;0,400,270"
          keyTimes="0;0.2;0.25;0.5;0.53;0.88;0.92" dur={DUR} repeatCount="indefinite" />
        <line x1="400" y1="270" x2="400" y2="220" stroke={C.lineLt} strokeWidth="5" strokeLinecap="round" />
        <circle cx="400" cy="220" r="8" fill={C.steelDk} stroke={C.lineLt} strokeWidth="1.5" />
      </g>

      {/* ── Heat glow at bend point ───────────────────────────── */}
      <circle cx="395" cy="260" r="0" fill="url(#bendHeatGlow)" opacity="0">
        <animate attributeName="r" values="0;0;0;35;30;0;0"
          keyTimes="0;0.2;0.25;0.45;0.55;0.65;1" dur={DUR} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0;0;0.7;0.5;0;0"
          keyTimes="0;0.2;0.25;0.4;0.55;0.65;1" dur={DUR} repeatCount="indefinite" />
      </circle>

      {/* ── Sparks during bend ─────────────────────────────────── */}
      {Array.from({ length: 14 }, (_, i) => {
        const angle = ((i * 25) - 60) * Math.PI / 180;
        const r1 = 12 + (i % 3) * 6;
        const r2 = r1 + 12 + (i % 4) * 8;
        const x1 = 395 + Math.cos(angle) * r1;
        const y1 = 260 + Math.sin(angle) * r1 * 0.6;
        const x2 = 395 + Math.cos(angle) * r2;
        const y2 = 260 + Math.sin(angle) * r2 * 0.6;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={i % 2 === 0 ? C.amberLt : C.amber}
            strokeWidth={1 + (i % 2) * 0.5} strokeLinecap="round" opacity="0">
            <animate attributeName="opacity" values="0;0;0;0.8;0;0"
              keyTimes={`0;0.28;${0.3 + i * 0.01};${0.35 + i * 0.01};${0.5 + i * 0.008};1`}
              dur={DUR} repeatCount="indefinite" />
          </line>
        );
      })}

      {/* ── Angular measurement HUD ───────────────────────────── */}
      {/* Reference lines */}
      <line x1="400" y1="270" x2="330" y2="270" stroke={C.accent2} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />
      <line x1="400" y1="270" x2="400" y2="200" stroke={C.accent2} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />
      {/* Angle arc (draws during bend) */}
      <path d="M350,270 A50,50 0 0,0 400,220" fill="none" stroke={C.accent2} strokeWidth="1.5" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0.6;0.6;0"
          keyTimes="0;0.2;0.3;0.5;0.7;0.92" dur={DUR} repeatCount="indefinite" />
        <animate attributeName="stroke-dasharray" values="0 200;0 200;0 200;200 0;200 0;200 0"
          keyTimes="0;0.2;0.3;0.53;0.7;1" dur={DUR} repeatCount="indefinite" />
      </path>
      {/* Crosshair */}
      <circle cx="395" cy="260" r="35" fill="none" stroke={C.accent2} strokeWidth="0.5" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0.3;0.3;0"
          keyTimes="0;0.2;0.3;0.5;0.7;0.92" dur={DUR} repeatCount="indefinite" />
      </circle>

      {/* ── Readout panel ─────────────────────────────────────── */}
      <rect x="570" y="130" width="200" height="100" rx="8" fill={C.bgDeep} stroke={C.accent} strokeWidth="1" opacity="0.95" />
      <text x="590" y="152" fill={C.muted} fontSize="9" fontFamily="monospace">BEND ANGLE</text>
      {/* Angle value — counts up during bend */}
      <text x="590" y="188" fill={C.txt} fontSize="30" fontFamily="monospace" fontWeight="bold" opacity="0.4">
        0.0&#176;
      </text>
      {/* Overlay that shows final value after bend completes */}
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;0;1;1;1;0"
          keyTimes="0;0.2;0.48;0.53;0.7;0.88;0.92" dur={DUR} repeatCount="indefinite" />
        <text x="590" y="188" fill={C.txt} fontSize="30" fontFamily="monospace" fontWeight="bold">90.0&#176;</text>
        {/* PASS badge */}
        <rect x="708" y="140" width="50" height="22" rx="11" fill={C.green} opacity="0.15" />
        <text x="733" y="155" textAnchor="middle" fill={C.green} fontSize="10" fontFamily="monospace" fontWeight="bold">PASS</text>
      </g>
      {/* Counting angle - animates text position to simulate counting */}
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;1;0;0"
          keyTimes="0;0.25;0.35;0.53;1" dur={DUR} repeatCount="indefinite" />
        <text x="590" y="188" fill={C.accent2} fontSize="30" fontFamily="monospace" fontWeight="bold">
          45.0&#176;
        </text>
      </g>
      {/* Progress bar */}
      <rect x="590" y="200" width="160" height="4" rx="2" fill={C.line} />
      <rect x="590" y="200" width="0" height="4" rx="2" fill={C.green} opacity="0.8">
        <animate attributeName="width" values="0;0;0;160;160;160;0"
          keyTimes="0;0.2;0.25;0.53;0.7;0.88;0.92" dur={DUR} repeatCount="indefinite" />
      </rect>
      {/* Tolerance label */}
      <text x="590" y="222" fill={C.muted} fontSize="8" fontFamily="monospace" opacity="0">
        TOL &#177;0.5&#176; &#8226; RADIUS 4d
        <animate attributeName="opacity" values="0;0;0;0.7;0.7;0"
          keyTimes="0;0.2;0.48;0.55;0.7;0.92" dur={DUR} repeatCount="indefinite" />
      </text>

      {/* ── Counter — pieces completed ─────────────────────────── */}
      <rect x="570" y="250" width="200" height="50" rx="6" fill={C.bgDeep} stroke={C.line} strokeWidth="0.8" opacity="0.8" />
      <text x="590" y="270" fill={C.muted} fontSize="8" fontFamily="monospace">PIECES TODAY</text>
      <text x="590" y="292" fill={C.accent2} fontSize="16" fontFamily="monospace" fontWeight="bold">247</text>
      <text x="640" y="292" fill={C.muted} fontSize="10" fontFamily="monospace">/ 320</text>
      {/* Mini progress */}
      <rect x="700" y="275" width="56" height="6" rx="3" fill={C.line} />
      <rect x="700" y="275" width="43" height="6" rx="3" fill={C.accent} opacity="0.7" />

      {/* ── Caption graphic — lower third ─────────────────────── */}
      <rect x="0" y="370" width="800" height="80" fill="url(#captionFadeBend)" />
      <text x="400" y="410" textAnchor="middle" fill={C.txt} fontSize="20"
        fontFamily="Inter, system-ui, sans-serif" fontWeight="600" letterSpacing="0.5">
        Precision bending. Every bar. Every time.
      </text>
      <line x1="240" y1="425" x2="560" y2="425" stroke={C.accent} strokeWidth="2" opacity="0.4" />

      {/* ── Defs ──────────────────────────────────────────────── */}
      <defs>
        <linearGradient id="bendBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.steel} />
          <stop offset="50%" stopColor={C.steelDk} />
          <stop offset="100%" stopColor="#1a3050" />
        </linearGradient>
        <radialGradient id="bendHeatGlow">
          <stop offset="0%" stopColor={C.amber} stopOpacity="0.7" />
          <stop offset="50%" stopColor={C.amber} stopOpacity="0.15" />
          <stop offset="100%" stopColor={C.amber} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="captionFadeBend" x1="0" y1="0" x2="0" y2="1">
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
  'Every bar of steel carries a specification.',
  'AI vision confirms the cut before the blade moves.',
  'Computation guides every angle to specification.',
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function VideoShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasFiredView = useRef(false);
  const loopCount = useRef(0);
  const [activeScene, setActiveScene] = useState(0);
  const [settled, setSettled] = useState(false);
  const isInView = useInView(containerRef, { once: true, amount: 0.05 });

  // Advance to next scene, count loops, settle after LOOPS_BEFORE_SETTLE
  const advance = useCallback(() => {
    setActiveScene(prev => {
      const next = (prev + 1) % SCENE_COUNT;
      if (next === 0) {
        loopCount.current += 1;
        if (loopCount.current >= LOOPS_BEFORE_SETTLE) {
          setSettled(true);
        }
      }
      return next;
    });
  }, []);

  // Cycle scenes unconditionally until settled
  useEffect(() => {
    if (settled) return;
    const id = setInterval(advance, SCENE_DURATION);
    return () => clearInterval(id);
  }, [settled, advance]);

  // Analytics
  useEffect(() => {
    if (isInView && !hasFiredView.current) {
      hasFiredView.current = true;
      trackEvent('showcase_animation_view');
    }
  }, [isInView]);

  const ActiveScene = settled ? BendingLoop : SCENE_COMPONENTS[activeScene];

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
                  key={settled ? 'bending-loop' : activeScene}
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

          {/* Scene indicator dots — fade out once settled */}
          <div className={`flex items-center justify-center gap-2 mt-4 transition-opacity duration-700 ${
            settled ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
            {CAPTIONS.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!settled) setActiveScene(i);
                }}
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
