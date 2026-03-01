'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { C, FONT, MONO } from './constants';

type PairedDatum = {
  label: string;
  before: number;
  after: number;
  delta?: string;
};

type Props = {
  data: PairedDatum[];
  maxValue?: number;
  ariaLabel: string;
  className?: string;
  suffix?: string;
};

const VB_W = 560;
const ROW_H = 56;
const TOP = 28;
const LEFT = 120;
const RIGHT = 60;
const CHART_W = VB_W - LEFT - RIGHT;

export default function PairedBarChart({ data, maxValue, ariaLabel, className, suffix = '%' }: Props) {
  const reduce = useReducedMotion();
  const VB_H = TOP + data.length * ROW_H + 8;
  const max = maxValue ?? Math.ceil(Math.max(...data.flatMap(d => [d.before, d.after])) * 1.2);
  const scale = (v: number) => (v / max) * CHART_W;
  const barH = 14;

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto" role="img" aria-label={ariaLabel}>
        <title>{ariaLabel}</title>

        {/* Legend */}
        <circle cx={LEFT} cy={10} r={4} fill={C.muted} opacity="0.5" />
        <text x={LEFT + 10} y={13} fill={C.muted} fontSize="8" fontFamily={FONT}>Baseline</text>
        <circle cx={LEFT + 70} cy={10} r={4} fill={C.green} opacity="0.8" />
        <text x={LEFT + 80} y={13} fill={C.muted} fontSize="8" fontFamily={FONT}>Post-deployment</text>

        {data.map((d, i) => {
          const cy = TOP + i * ROW_H + ROW_H / 2;
          const beforeW = scale(d.before);
          const afterW = scale(d.after);

          return (
            <g key={i}>
              {/* Row separator */}
              {i > 0 && (
                <line x1={LEFT} y1={cy - ROW_H / 2} x2={VB_W - 8} y2={cy - ROW_H / 2}
                  stroke={C.line} strokeWidth="0.5" opacity="0.3" />
              )}

              {/* Label */}
              <text x={LEFT - 8} y={cy + 1} textAnchor="end"
                fill={C.muted} fontSize="10" fontFamily={FONT}>
                {d.label}
              </text>

              {/* Before bar (top) */}
              {reduce ? (
                <rect x={LEFT} y={cy - barH - 1} width={beforeW} height={barH} rx={3}
                  fill={C.muted} opacity="0.35" />
              ) : (
                <motion.rect
                  x={LEFT} y={cy - barH - 1} height={barH} rx={3}
                  fill={C.muted} opacity="0.35"
                  initial={{ width: 0 }}
                  whileInView={{ width: beforeW }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
                />
              )}
              <text x={LEFT + beforeW + 6} y={cy - barH / 2 + 2.5} fill={C.muted} fontSize="9" fontFamily={MONO}>
                {d.before}{suffix}
              </text>

              {/* After bar (bottom) */}
              {reduce ? (
                <rect x={LEFT} y={cy + 1} width={afterW} height={barH} rx={3}
                  fill={C.green} opacity="0.7" />
              ) : (
                <motion.rect
                  x={LEFT} y={cy + 1} height={barH} rx={3}
                  fill={C.green} opacity="0.7"
                  initial={{ width: 0 }}
                  whileInView={{ width: afterW }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 + 0.15, ease: 'easeOut' }}
                />
              )}
              <text x={LEFT + afterW + 6} y={cy + barH / 2 + 4} fill={C.green} fontSize="9" fontFamily={MONO} fontWeight="600">
                {d.after}{suffix}
              </text>

              {/* Delta annotation */}
              {d.delta && (
                <text x={VB_W - 12} y={cy + 4} textAnchor="end"
                  fill={C.accent2} fontSize="9" fontFamily={MONO}>
                  {d.delta}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
