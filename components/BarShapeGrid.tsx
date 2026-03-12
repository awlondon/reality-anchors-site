'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/motion';
import { trackEvent } from '@/lib/analytics';
import { BAR_SHAPES, SHAPE_CATEGORIES } from '@/data/barShapes';
import type { ShapeCategory, BarShape } from '@/data/barShapes';
import BarShapeCanvas from './BarShapeCanvas';
import BarShapeViewer from './BarShapeViewer';

function ShapeCard({ shape, onClick }: { shape: BarShape; onClick: () => void }) {
  const [drawProgress, setDrawProgress] = useState(0);
  const [bendProgress, setBendProgress] = useState(0);
  const animRef = useRef<number | null>(null);
  const hasAnimated = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-animate on first visibility
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const duration = 1200;

          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            setDrawProgress(Math.min(t / 0.7, 1));
            setBendProgress(Math.max(0, Math.min((t - 0.3) / 0.7, 1)));
            if (t < 1) animRef.current = requestAnimationFrame(tick);
          };

          // Small random delay for stagger effect
          setTimeout(() => {
            animRef.current = requestAnimationFrame(tick);
          }, Math.random() * 300);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const defaultParams: Record<string, number> = {};
  for (const p of shape.params) defaultParams[p.key] = p.default;

  return (
    <motion.div
      ref={cardRef}
      variants={fadeUp}
      className="group cursor-pointer rounded-xl border border-line hover:border-orange-500/40 transition-all duration-200 overflow-hidden"
      style={{ backgroundColor: '#141820' }}
      onClick={onClick}
    >
      <div className="p-3" style={{ backgroundColor: '#0C0F14' }}>
        <BarShapeCanvas
          shape={shape}
          params={defaultParams}
          barSize={12}
          bendRadius={24}
          drawProgress={drawProgress}
          bendProgress={bendProgress}
          width={280}
          height={160}
          thumbnail
        />
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-orange-400">{shape.id}</span>
          <span className="text-xs px-1.5 py-0.5 rounded border border-line text-muted">{shape.category}</span>
        </div>
        <h3 className="text-sm font-semibold text-txt group-hover:text-orange-300 transition-colors">
          {shape.name}
        </h3>
        <p className="text-xs text-muted mt-0.5 line-clamp-2">{shape.description}</p>
        <div className="text-xs font-mono text-muted mt-2">{shape.formulaDesc}</div>
      </div>
    </motion.div>
  );
}

export default function BarShapeGrid() {
  const [activeCategory, setActiveCategory] = useState<ShapeCategory | 'All'>('All');
  const [selectedShape, setSelectedShape] = useState<BarShape | null>(null);

  const filtered = activeCategory === 'All'
    ? BAR_SHAPES
    : BAR_SHAPES.filter(s => s.category === activeCategory);

  const handleSelect = useCallback((shape: BarShape) => {
    setSelectedShape(shape);
    trackEvent('bar_shape_open', { shapeId: shape.id, shapeName: shape.name });
  }, []);

  // Lock body scroll when viewer is open
  useEffect(() => {
    if (selectedShape) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedShape]);

  return (
    <>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(['All', ...SHAPE_CATEGORIES] as const).map((cat) => {
          const isActive = cat === activeCategory;
          const count = cat === 'All'
            ? BAR_SHAPES.length
            : BAR_SHAPES.filter(s => s.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                trackEvent('bar_shape_filter', { category: cat });
              }}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? 'text-white border border-orange-500/60'
                  : 'text-muted border border-line hover:border-orange-500/30 hover:text-txt'
                }
              `}
              style={isActive ? { backgroundColor: 'rgba(249, 115, 22, 0.15)' } : {}}
            >
              {cat} <span className="text-xs opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Shape grid */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px -50px 0px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filtered.map((shape) => (
          <ShapeCard
            key={shape.id}
            shape={shape}
            onClick={() => handleSelect(shape)}
          />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center text-muted py-12">No shapes in this category.</p>
      )}

      {/* Interactive viewer modal */}
      {selectedShape && (
        <BarShapeViewer
          shape={selectedShape}
          onClose={() => setSelectedShape(null)}
        />
      )}
    </>
  );
}
