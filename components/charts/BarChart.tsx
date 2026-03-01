'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { C, FONT, MONO } from './constants';

type BarDatum = {
  label: string;
  value: number;
  annotation?: string;
  sublabel?: string;
};

type Props = {
  data: BarDatum[];
  maxValue?: number;
  yAxisLabel?: string;
  ariaLabel: string;
  className?: string;
};

const VB_W = 560;
const VB_H = 280;
const LEFT = 54;
const BOTTOM = 240;
const TOP = 18;
const CHART_W = VB_W - LEFT - 16;
const CHART_H = BOTTOM - TOP;

export default function BarChart({ data, maxValue, yAxisLabel, ariaLabel, className }: Props) {
  const reduce = useReducedMotion();
  const max = maxValue ?? Math.ceil(Math.max(...data.map(d => d.value)) * 1.15);
  const barSlot = CHART_W / data.length;
  const barW = barSlot * 0.52;
  const gap = (barSlot - barW) / 2;

  const scale = (v: number) => (v / max) * CHART_H;

  // Y-axis ticks
  const tickCount = 4;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => (max / tickCount) * i);

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto" role="img" aria-label={ariaLabel}>
        <title>{ariaLabel}</title>

        {/* Y-axis grid lines + labels */}
        {ticks.map((t, i) => {
          const y = BOTTOM - scale(t);
          return (
            <g key={i}>
              <line x1={LEFT} y1={y} x2={VB_W - 16} y2={y}
                stroke={C.line} strokeWidth="0.5" opacity={i === 0 ? 0.6 : 0.3} />
              <text x={LEFT - 6} y={y + 3.5} textAnchor="end"
                fill={C.muted} fontSize="9" fontFamily={MONO}>
                {t >= 1000 ? `${(t / 1000).toFixed(0)}k` : t.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Y-axis label */}
        {yAxisLabel && (
          <text x={12} y={BOTTOM / 2} textAnchor="middle"
            fill={C.muted} fontSize="8" fontFamily={FONT}
            transform={`rotate(-90 12 ${BOTTOM / 2})`}>
            {yAxisLabel}
          </text>
        )}

        {/* Bars */}
        {data.map((d, i) => {
          const x = LEFT + i * barSlot + gap;
          const h = scale(d.value);
          const y = BOTTOM - h;
          const isLast = i === data.length - 1;

          return (
            <g key={i}>
              {/* Bar */}
              {reduce ? (
                <rect x={x} y={y} width={barW} height={h} rx={3}
                  fill={isLast ? C.txt : C.accent} opacity={isLast ? 0.9 : 0.8} />
              ) : (
                <motion.rect
                  x={x} y={y} width={barW} rx={3}
                  fill={isLast ? C.txt : C.accent} opacity={isLast ? 0.9 : 0.8}
                  initial={{ height: 0, y: BOTTOM }}
                  whileInView={{ height: h, y }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                />
              )}

              {/* Annotation above bar */}
              {d.annotation && (
                reduce ? (
                  <text x={x + barW / 2} y={y - 6} textAnchor="middle"
                    fill={C.txt} fontSize="10" fontFamily={MONO} fontWeight="600">
                    {d.annotation}
                  </text>
                ) : (
                  <motion.text
                    x={x + barW / 2} y={y - 6} textAnchor="middle"
                    fill={C.txt} fontSize="10" fontFamily={MONO} fontWeight="600"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.08 + 0.4 }}
                  >
                    {d.annotation}
                  </motion.text>
                )
              )}

              {/* X-axis label */}
              <text x={x + barW / 2} y={BOTTOM + 14} textAnchor="middle"
                fill={C.muted} fontSize="10" fontFamily={MONO}>
                {d.label}
              </text>

              {/* Sublabel */}
              {d.sublabel && (
                <text x={x + barW / 2} y={BOTTOM + 26} textAnchor="middle"
                  fill={C.muted} fontSize="7.5" fontFamily={FONT} opacity="0.7">
                  {d.sublabel}
                </text>
              )}
            </g>
          );
        })}

        {/* Growth curve connecting bar tops */}
        {data.length > 2 && (
          <polyline
            points={data.map((d, i) => {
              const x = LEFT + i * barSlot + gap + barW / 2;
              const y = BOTTOM - scale(d.value);
              return `${x},${y}`;
            }).join(' ')}
            fill="none" stroke={C.accent2} strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" opacity="0.4"
            strokeDasharray="4 3"
          />
        )}
      </svg>
    </div>
  );
}
