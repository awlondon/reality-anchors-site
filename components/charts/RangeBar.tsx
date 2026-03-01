'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { C, FONT, MONO } from './constants';

type RangeDatum = {
  label: string;
  low: number;
  high: number;
  baseline: number;
};

type Props = {
  data: RangeDatum[];
  maxValue?: number;
  ariaLabel: string;
  className?: string;
  suffix?: string;
};

const VB_W = 560;
const ROW_H = 52;
const TOP = 20;
const LEFT = 140;
const RIGHT = 40;
const CHART_W = VB_W - LEFT - RIGHT;

export default function RangeBar({ data, maxValue, ariaLabel, className, suffix = '%' }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const VB_H = TOP + data.length * ROW_H + 8;
  const max = maxValue ?? Math.ceil(Math.max(...data.map(d => d.high)) * 1.3);
  const scale = (v: number) => (v / max) * CHART_W;
  const barH = 16;

  return (
    <div ref={ref} className={className}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto" role="img" aria-label={ariaLabel}>
        <title>{ariaLabel}</title>

        {data.map((d, i) => {
          const cy = TOP + i * ROW_H + ROW_H / 2;
          const x1 = LEFT + scale(d.low);
          const x2 = LEFT + scale(d.high);
          const rangeW = x2 - x1;
          const baseX = LEFT + scale(d.baseline);

          return (
            <g key={i}>
              {/* Row separator */}
              {i > 0 && (
                <line x1={LEFT} y1={cy - ROW_H / 2} x2={VB_W - 8} y2={cy - ROW_H / 2}
                  stroke={C.line} strokeWidth="0.5" opacity="0.3" />
              )}

              {/* Label */}
              <text x={LEFT - 10} y={cy + 4} textAnchor="end"
                fill={C.muted} fontSize="10" fontFamily={FONT}>
                {d.label}
              </text>

              {/* Range bar */}
              {reduce ? (
                <rect x={x1} y={cy - barH / 2} width={rangeW} height={barH} rx={4}
                  fill={C.accent} opacity="0.3" />
              ) : (
                <motion.rect
                  x={x1} y={cy - barH / 2} height={barH} rx={4}
                  fill={C.accent} opacity="0.3"
                  initial={{ width: 0 }}
                  animate={{ width: inView ? rangeW : 0 }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
                />
              )}

              {/* Low label */}
              <text x={x1} y={cy - barH / 2 - 5} textAnchor="middle"
                fill={C.muted} fontSize="8" fontFamily={MONO}>
                {d.low}{suffix}
              </text>

              {/* High label */}
              <text x={x2} y={cy - barH / 2 - 5} textAnchor="middle"
                fill={C.muted} fontSize="8" fontFamily={MONO}>
                {d.high}{suffix}
              </text>

              {/* Baseline marker */}
              {reduce ? (
                <circle cx={baseX} cy={cy} r={5} fill={C.accent2} />
              ) : (
                <motion.circle
                  cx={baseX} cy={cy} r={5}
                  fill={C.accent2}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: i * 0.12 + 0.4 }}
                />
              )}

              {/* Baseline value */}
              <text x={baseX} y={cy + barH / 2 + 12} textAnchor="middle"
                fill={C.accent2} fontSize="9" fontFamily={MONO} fontWeight="600">
                {d.baseline}{suffix}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <rect x={LEFT} y={VB_H - 14} width={16} height={6} rx={2} fill={C.accent} opacity="0.3" />
        <text x={LEFT + 20} y={VB_H - 9} fill={C.muted} fontSize="7.5" fontFamily={FONT}>Industry range</text>
        <circle cx={LEFT + 90} cy={VB_H - 11} r={3.5} fill={C.accent2} />
        <text x={LEFT + 98} y={VB_H - 9} fill={C.muted} fontSize="7.5" fontFamily={FONT}>Model baseline</text>
      </svg>
    </div>
  );
}
