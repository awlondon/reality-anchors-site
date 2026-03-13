'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BarShapeCanvas from './BarShapeCanvas';
import { BAR_SIZES, STEEL_GRADES, TABLE_II, roundToNext25mm } from '@/data/barShapes';
import type { BarShape } from '@/data/barShapes';
import { trackEvent } from '@/lib/analytics';

interface Props {
  shape: BarShape;
  onClose: () => void;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function BarShapeViewer({ shape, onClose }: Props) {
  const [params, setParams] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const p of shape.params) initial[p.key] = p.default;
    return initial;
  });

  const [barSize, setBarSize] = useState(12);
  const [steelGrade, setSteelGrade] = useState('Fe415');

  // Animation state
  const [drawProgress, setDrawProgress] = useState(1);
  const [bendProgress, setBendProgress] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const animRef = useRef<number | null>(null);

  // Container size
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 600, h: 350 });

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({
          w: Math.max(300, Math.floor(rect.width)),
          h: Math.max(200, Math.min(400, Math.floor(rect.width * 0.55))),
        });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Compute cut length
  const tableKey = `${barSize}:${steelGrade}`;
  const tableEntry = TABLE_II[tableKey];
  const R = tableEntry
    ? tableEntry.minBendRadiusMultiplier * barSize
    : barSize * 2;
  const cutLength = roundToNext25mm(shape.cutLength(params, barSize, R));

  const playBending = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDrawProgress(0);
    setBendProgress(0);

    trackEvent('bar_shape_animate', { shapeId: shape.id });

    const duration = 2000; // ms
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeInOutCubic(t);

      // Draw-on happens in first 60%, bending in last 60% (overlapping)
      const drawT = Math.min(t / 0.6, 1);
      const bendT = Math.max(0, Math.min((t - 0.4) / 0.6, 1));

      setDrawProgress(easeInOutCubic(drawT));
      setBendProgress(easeInOutCubic(bendT));

      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setDrawProgress(1);
        setBendProgress(1);
        setIsAnimating(false);
      }
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isAnimating, shape.id]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const updateParam = (key: string, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-line"
          style={{ backgroundColor: '#141820' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-line">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted">{shape.id}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-line text-muted">{shape.table}</span>
              </div>
              <h2 className="text-lg font-semibold text-txt mt-1">{shape.name}</h2>
              <p className="text-sm text-muted">{shape.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-line transition-colors text-muted hover:text-txt"
              aria-label="Close viewer"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Canvas */}
          <div ref={containerRef} className="relative p-4" style={{ backgroundColor: '#0C0F14' }}>
            <BarShapeCanvas
              shape={shape}
              params={params}
              barSize={barSize}
              bendRadius={R}
              drawProgress={drawProgress}
              bendProgress={bendProgress}
              width={canvasSize.w}
              height={canvasSize.h}
            />
          </div>

          {/* Controls */}
          <div className="p-4 space-y-4">
            {/* Play button + cut length */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <button
                onClick={playBending}
                disabled={isAnimating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                style={{
                  backgroundColor: isAnimating ? '#2A3040' : '#F97316',
                  color: isAnimating ? '#94A3B8' : '#fff',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 2.5l9 5.5-9 5.5V2.5z" />
                </svg>
                {isAnimating ? 'Bending...' : 'Play Bending'}
              </button>

              <div className="text-right">
                <div className="text-xs text-muted font-mono">Cut Length</div>
                <div className="text-xl font-semibold font-mono" style={{ color: '#F97316' }}>
                  {cutLength.toLocaleString()} mm
                </div>
                <div className="text-xs text-muted font-mono mt-0.5">{shape.formulaDesc}</div>
              </div>
            </div>

            {/* Bar size + steel grade */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted block mb-1.5 font-mono">Bar Size (mm)</label>
                <select
                  value={barSize}
                  onChange={(e) => setBarSize(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg text-sm text-txt border border-line focus:border-accent focus:outline-none"
                  style={{ backgroundColor: '#0C0F14' }}
                >
                  {BAR_SIZES.map(s => (
                    <option key={s} value={s}>{s} mm</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted block mb-1.5 font-mono">Steel Grade</label>
                <select
                  value={steelGrade}
                  onChange={(e) => setSteelGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm text-txt border border-line focus:border-accent focus:outline-none"
                  style={{ backgroundColor: '#0C0F14' }}
                >
                  {STEEL_GRADES.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Parameter sliders */}
            {shape.params.map((p) => (
              <div key={p.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-muted font-mono">
                    {p.label} — {p.description}
                  </label>
                  <span className="text-sm font-mono font-semibold" style={{ color: '#F97316' }}>
                    {params[p.key]} mm
                  </span>
                </div>
                <input
                  type="range"
                  min={p.min}
                  max={p.max}
                  step={p.step}
                  value={params[p.key]}
                  onChange={(e) => updateParam(p.key, Number(e.target.value))}
                  className="w-full accent-orange-500"
                  aria-label={`${p.label}: ${p.description}`}
                />
                <div className="flex justify-between text-xs text-muted font-mono mt-0.5">
                  <span>{p.min}</span>
                  <span>{p.max}</span>
                </div>
              </div>
            ))}

            {/* Table II info */}
            {tableEntry && (
              <div className="rounded-lg p-3 border border-line text-xs font-mono text-muted" style={{ backgroundColor: '#0C0F14' }}>
                <div className="text-txt font-semibold mb-1">Table II Values ({barSize}mm / {steelGrade})</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <span>Min Bend Radius: {R}mm ({tableEntry.minBendRadiusMultiplier}d)</span>
                  <span>Hook (180°): {tableEntry.hookAllowance1A}mm</span>
                  <span>Hook (90°): {tableEntry.hookAllowance1B}mm</span>
                  <span>Bend Deduction: {tableEntry.bendDeduction90}mm</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
