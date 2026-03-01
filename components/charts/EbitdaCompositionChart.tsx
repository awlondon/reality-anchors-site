'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { C, FONT, MONO } from './constants';

type Segment = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  segments: Segment[];
  total: number;
  ariaLabel: string;
  className?: string;
  prefix?: string;
};

const VB_W = 560;
const VB_H = 100;
const LEFT = 12;
const RIGHT = 12;
const BAR_Y = 10;
const BAR_H = 32;
const CHART_W = VB_W - LEFT - RIGHT;

export default function EbitdaCompositionChart({ segments, total, ariaLabel, className, prefix = '$' }: Props) {
  const reduce = useReducedMotion();

  const fmtVal = (v: number) => {
    if (v >= 1_000_000) return `${prefix}${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1000) return `${prefix}${(v / 1000).toFixed(0)}k`;
    return `${prefix}${v.toFixed(0)}`;
  };

  // Build segment positions
  let cursor = LEFT;
  const bars = segments
    .filter(s => s.value > 0)
    .map(s => {
      const w = total > 0 ? (s.value / total) * CHART_W : 0;
      const bar = { ...s, x: cursor, w };
      cursor += w;
      return bar;
    });

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto" role="img" aria-label={ariaLabel}>
        <title>{ariaLabel}</title>

        {/* Background track */}
        <rect x={LEFT} y={BAR_Y} width={CHART_W} height={BAR_H} rx={6}
          fill={C.line} opacity="0.3" />

        {/* Segments */}
        {bars.map((b, i) => {
          const isFirst = i === 0;
          const isLast = i === bars.length - 1;
          const rx = isFirst || isLast ? 6 : 0;

          return reduce ? (
            <g key={i}>
              <rect
                x={b.x + (isFirst ? 0 : 0.5)} y={BAR_Y}
                width={Math.max(0, b.w - (isFirst || isLast ? 0 : 1))} height={BAR_H}
                rx={rx} fill={b.color} opacity="0.8"
              />
              {/* Label below */}
              <text x={b.x + b.w / 2} y={BAR_Y + BAR_H + 16} textAnchor="middle"
                fill={C.muted} fontSize="8" fontFamily={FONT}>
                {b.label}
              </text>
              {/* Value inside bar */}
              {b.w > 50 && (
                <text x={b.x + b.w / 2} y={BAR_Y + BAR_H / 2 + 4} textAnchor="middle"
                  fill={C.txt} fontSize="9" fontFamily={MONO} fontWeight="600">
                  {fmtVal(b.value)}
                </text>
              )}
            </g>
          ) : (
            <g key={i}>
              <motion.rect
                x={b.x + (isFirst ? 0 : 0.5)} y={BAR_Y}
                height={BAR_H} rx={rx}
                fill={b.color} opacity="0.8"
                initial={{ width: 0 }}
                animate={{ width: Math.max(0, b.w - (isFirst || isLast ? 0 : 1)) }}
                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.08 }}
              />
              {/* Label below */}
              <text x={b.x + b.w / 2} y={BAR_Y + BAR_H + 16} textAnchor="middle"
                fill={C.muted} fontSize="8" fontFamily={FONT}>
                {b.label}
              </text>
              {/* Value inside bar */}
              {b.w > 50 && (
                <motion.text
                  x={b.x + b.w / 2} y={BAR_Y + BAR_H / 2 + 4} textAnchor="middle"
                  fill={C.txt} fontSize="9" fontFamily={MONO} fontWeight="600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.08 + 0.3 }}
                >
                  {fmtVal(b.value)}
                </motion.text>
              )}
            </g>
          );
        })}

        {/* Total label */}
        <text x={VB_W - RIGHT} y={BAR_Y + BAR_H + 16} textAnchor="end"
          fill={C.txt} fontSize="10" fontFamily={MONO} fontWeight="600">
          Total: {fmtVal(total)}
        </text>
      </svg>
    </div>
  );
}
