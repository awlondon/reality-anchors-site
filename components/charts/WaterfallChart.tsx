'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { C, FONT, MONO } from './constants';

type WaterfallStep = {
  label: string;
  value: number;
  isTotal?: boolean;
};

type Props = {
  data: WaterfallStep[];
  ariaLabel: string;
  className?: string;
  prefix?: string;
};

const VB_W = 560;
const VB_H = 300;
const LEFT = 62;
const RIGHT = 16;
const TOP = 24;
const BOTTOM = 250;
const CHART_W = VB_W - LEFT - RIGHT;
const CHART_H = BOTTOM - TOP;

export default function WaterfallChart({ data, ariaLabel, className, prefix = '$' }: Props) {
  const reduce = useReducedMotion();

  // Compute running totals
  const steps: { label: string; start: number; end: number; delta: number; isTotal: boolean }[] = [];
  let running = 0;
  for (const d of data) {
    if (d.isTotal) {
      steps.push({ label: d.label, start: 0, end: running, delta: running, isTotal: true });
    } else {
      const start = running;
      running += d.value;
      steps.push({ label: d.label, start, end: running, delta: d.value, isTotal: false });
    }
  }

  const maxVal = Math.max(...steps.map(s => Math.max(s.start, s.end))) * 1.12;
  const scale = (v: number) => (v / maxVal) * CHART_H;

  const barSlot = CHART_W / steps.length;
  const barW = barSlot * 0.52;
  const gap = (barSlot - barW) / 2;

  // Y-axis ticks
  const tickCount = 4;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => (maxVal / tickCount) * i);

  const fmtVal = (v: number) => {
    if (v >= 1_000_000) return `${prefix}${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1000) return `${prefix}${(v / 1000).toFixed(0)}k`;
    return `${prefix}${v.toFixed(0)}`;
  };

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto" role="img" aria-label={ariaLabel}>
        <title>{ariaLabel}</title>

        {/* Y-axis grid + labels */}
        {ticks.map((t, i) => {
          const y = BOTTOM - scale(t);
          return (
            <g key={i}>
              <line x1={LEFT} y1={y} x2={VB_W - RIGHT} y2={y}
                stroke={C.line} strokeWidth="0.5" opacity={i === 0 ? 0.6 : 0.3} />
              <text x={LEFT - 6} y={y + 3.5} textAnchor="end"
                fill={C.muted} fontSize="9" fontFamily={MONO}>
                {fmtVal(t)}
              </text>
            </g>
          );
        })}

        {/* Bars + connectors */}
        {steps.map((s, i) => {
          const x = LEFT + i * barSlot + gap;
          const topY = BOTTOM - scale(Math.max(s.start, s.end));
          const botY = BOTTOM - scale(Math.min(s.start, s.end));
          const h = botY - topY;
          const fill = s.isTotal ? C.txt : (s.delta >= 0 ? C.green : C.amber);
          const opacity = s.isTotal ? 0.9 : 0.75;

          // Connector line to next step
          const nextX = i < steps.length - 1 ? LEFT + (i + 1) * barSlot + gap : null;

          return (
            <g key={i}>
              {/* Connector dashed line */}
              {nextX !== null && !s.isTotal && (
                <line x1={x + barW} y1={BOTTOM - scale(s.end)} x2={nextX} y2={BOTTOM - scale(s.end)}
                  stroke={C.lineLt} strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
              )}

              {/* Bar */}
              {reduce ? (
                <rect x={x} y={topY} width={barW} height={h} rx={3}
                  fill={fill} opacity={opacity} />
              ) : (
                <motion.rect
                  x={x} width={barW} rx={3}
                  fill={fill} opacity={opacity}
                  initial={{ height: 0, y: BOTTOM }}
                  whileInView={{ height: h, y: topY }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
                />
              )}

              {/* Value label above bar */}
              {reduce ? (
                <text x={x + barW / 2} y={topY - 6} textAnchor="middle"
                  fill={s.isTotal ? C.txt : C.accent2} fontSize="10" fontFamily={MONO} fontWeight="600">
                  {s.isTotal ? fmtVal(s.end) : `+${fmtVal(s.delta)}`}
                </text>
              ) : (
                <motion.text
                  x={x + barW / 2} y={topY - 6} textAnchor="middle"
                  fill={s.isTotal ? C.txt : C.accent2} fontSize="10" fontFamily={MONO} fontWeight="600"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.12 + 0.4 }}
                >
                  {s.isTotal ? fmtVal(s.end) : `+${fmtVal(s.delta)}`}
                </motion.text>
              )}

              {/* X-axis label */}
              <text x={x + barW / 2} y={BOTTOM + 14} textAnchor="middle"
                fill={C.muted} fontSize="9" fontFamily={FONT}>
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
