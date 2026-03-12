'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { BarShape, DrawSegment } from '@/data/barShapes';

/* ─── Design tokens ─────────────────────────────────────────────── */
const COLORS = {
  bar: '#F97316',
  barGlow: 'rgba(249, 115, 22, 0.3)',
  hookBlue: '#38BDF8',
  dimLine: '#94A3B8',
  dimText: '#E2E8F0',
  grid: '#1E2430',
  bg: '#141820',
};

const BAR_WIDTH = 4;
const DIM_OFFSET = 28;
const ARROW_SIZE = 6;

interface Props {
  shape: BarShape;
  params: Record<string, number>;
  barSize: number;
  bendRadius: number;
  /** 0→1: draw-on animation progress */
  drawProgress: number;
  /** 0→1: bend-from-straight animation progress */
  bendProgress: number;
  width: number;
  height: number;
  className?: string;
  /** If true, renders a small thumbnail (no dims, thinner bar) */
  thumbnail?: boolean;
}

interface Point {
  x: number;
  y: number;
}

interface RenderedSegment {
  type: DrawSegment['type'];
  pathLength: number;
  label?: string;
  startPoint: Point;
  endPoint: Point;
  startAngle: number;
  endAngle: number;
  /** For arcs: center, radius, sweep info */
  arcCenter?: Point;
  arcRadius?: number;
  arcStartAngle?: number;
  arcSweep?: number;
  arcDirection?: 1 | -1;
}

/** Resolve a segment value to a number given shape params */
function resolveValue(value: string | number, params: Record<string, number>, shape: BarShape): number {
  if (typeof value === 'number') return value;
  if (params[value] !== undefined) return params[value];
  // Special keys for stirrup quarters
  if (value === 'qA') return (params.l || 800) / 4;
  if (value === 'qB') return (params.l || 800) / 4;
  // Crank bar segments: A/3
  if (value === 'segA') return (params.A || 1000) / 3;
  // Helical — just use a representative line
  if (value === 'helix') return params.D ? params.D * 2 : 800;
  return 200;
}

/** Compute rendered segments with positions, factoring in bend progress */
function computeSegments(
  shape: BarShape,
  params: Record<string, number>,
  bendRadius: number,
  bendProgress: number,
): RenderedSegment[] {
  const segments: RenderedSegment[] = [];
  let x = 0;
  let y = 0;
  let angle = 0; // current direction in radians

  for (const seg of shape.drawSegments) {
    const startPoint = { x, y };
    const startAngle = angle;

    if (seg.type === 'line') {
      const len = resolveValue(seg.value, params, shape);
      // Scale down for canvas (1mm → ~0.3px baseline, adjusted later)
      const scaledLen = len;
      const ex = x + Math.cos(angle) * scaledLen;
      const ey = y + Math.sin(angle) * scaledLen;
      segments.push({
        type: 'line',
        pathLength: scaledLen,
        label: seg.label,
        startPoint: { x, y },
        endPoint: { x: ex, y: ey },
        startAngle: angle,
        endAngle: angle,
      });
      x = ex;
      y = ey;
    } else if (seg.type === 'arc' || seg.type === 'hook') {
      const sweepDeg = typeof seg.value === 'number' ? seg.value : 90;
      const dir = seg.direction || 1;
      const radius = seg.type === 'hook' ? bendRadius * 0.8 : bendRadius;
      // Apply bend progress: interpolate sweep from 0 to target
      const currentSweepDeg = sweepDeg * bendProgress;
      const sweepRad = (currentSweepDeg * Math.PI) / 180;

      // Arc center is perpendicular to current direction
      const perpAngle = angle + (dir * Math.PI) / 2;
      const cx = x + Math.cos(perpAngle) * radius;
      const cy = y + Math.sin(perpAngle) * radius;

      // Arc drawn from start angle around center
      const arcStartAngle = angle - (dir * Math.PI) / 2;
      const arcLen = radius * Math.abs(sweepRad);

      // End position
      const endArcAngle = arcStartAngle + dir * sweepRad;
      const ex = cx + Math.cos(endArcAngle) * radius;
      const ey = cy + Math.sin(endArcAngle) * radius;

      // New direction after arc
      const newAngle = angle + dir * sweepRad;

      segments.push({
        type: seg.type,
        pathLength: arcLen,
        label: seg.label,
        startPoint: { x, y },
        endPoint: { x: ex, y: ey },
        startAngle: angle,
        endAngle: newAngle,
        arcCenter: { x: cx, y: cy },
        arcRadius: radius,
        arcStartAngle,
        arcSweep: dir * sweepRad,
        arcDirection: dir,
      });

      x = ex;
      y = ey;
      angle = newAngle;
    }
  }

  return segments;
}

/** Get bounding box of all segments */
function getBounds(segments: RenderedSegment[]): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  const update = (px: number, py: number) => {
    minX = Math.min(minX, px);
    minY = Math.min(minY, py);
    maxX = Math.max(maxX, px);
    maxY = Math.max(maxY, py);
  };

  for (const seg of segments) {
    update(seg.startPoint.x, seg.startPoint.y);
    update(seg.endPoint.x, seg.endPoint.y);
    if (seg.arcCenter && seg.arcRadius) {
      // Sample arc for better bounds
      const steps = 8;
      const startA = seg.arcStartAngle!;
      const sweep = seg.arcSweep!;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const a = startA + sweep * t;
        update(
          seg.arcCenter.x + Math.cos(a) * seg.arcRadius,
          seg.arcCenter.y + Math.sin(a) * seg.arcRadius,
        );
      }
    }
  }

  return { minX, minY, maxX, maxY };
}

export default function BarShapeCanvas({
  shape,
  params,
  barSize,
  bendRadius,
  drawProgress,
  bendProgress,
  width,
  height,
  className,
  thumbnail = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Compute segments
    const segments = computeSegments(shape, params, bendRadius, bendProgress);
    if (segments.length === 0) return;

    // Fit to canvas
    const bounds = getBounds(segments);
    const shapeW = bounds.maxX - bounds.minX || 1;
    const shapeH = bounds.maxY - bounds.minY || 1;
    const padding = thumbnail ? 16 : 50;
    const scaleX = (width - padding * 2) / shapeW;
    const scaleY = (height - padding * 2) / shapeH;
    const scale = Math.min(scaleX, scaleY, thumbnail ? 0.5 : 0.4);
    const offsetX = padding + ((width - padding * 2) - shapeW * scale) / 2 - bounds.minX * scale;
    const offsetY = padding + ((height - padding * 2) - shapeH * scale) / 2 - bounds.minY * scale;

    const tx = (px: number) => px * scale + offsetX;
    const ty = (py: number) => py * scale + offsetY;

    // Compute total path length for draw-on animation
    const totalLength = segments.reduce((sum, s) => sum + s.pathLength * scale, 0);
    let drawnLength = totalLength * drawProgress;

    // Draw segments
    const barW = thumbnail ? 2 : BAR_WIDTH;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const seg of segments) {
      const segLen = seg.pathLength * scale;
      if (drawnLength <= 0) break;
      const segDraw = Math.min(drawnLength, segLen);
      const segProgress = segLen > 0 ? segDraw / segLen : 1;
      drawnLength -= segDraw;

      ctx.beginPath();
      ctx.strokeStyle = seg.type === 'hook' ? COLORS.hookBlue : COLORS.bar;
      ctx.lineWidth = barW;

      if (!thumbnail) {
        ctx.shadowColor = seg.type === 'hook' ? 'rgba(56, 189, 248, 0.3)' : COLORS.barGlow;
        ctx.shadowBlur = 8;
      }

      if (seg.type === 'line') {
        const sx = tx(seg.startPoint.x);
        const sy = ty(seg.startPoint.y);
        const ex = tx(seg.endPoint.x);
        const ey = ty(seg.endPoint.y);
        ctx.moveTo(sx, sy);
        ctx.lineTo(
          sx + (ex - sx) * segProgress,
          sy + (ey - sy) * segProgress,
        );
      } else if (seg.arcCenter && seg.arcRadius !== undefined && seg.arcStartAngle !== undefined && seg.arcSweep !== undefined) {
        const cx = tx(seg.arcCenter.x);
        const cy = ty(seg.arcCenter.y);
        const r = seg.arcRadius * scale;
        const startA = seg.arcStartAngle;
        const sweepA = seg.arcSweep * segProgress;
        const ccw = seg.arcDirection === 1;
        ctx.arc(cx, cy, r, startA, startA + sweepA, !ccw && sweepA < 0);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw dimension lines (only when mostly drawn, not thumbnail)
    if (!thumbnail && drawProgress > 0.7) {
      const dimAlpha = Math.min(1, (drawProgress - 0.7) / 0.3);
      ctx.globalAlpha = dimAlpha;

      for (const seg of segments) {
        if (seg.type !== 'line' || !seg.label) continue;

        const sx = tx(seg.startPoint.x);
        const sy = ty(seg.startPoint.y);
        const ex = tx(seg.endPoint.x);
        const ey = ty(seg.endPoint.y);
        const dx = ex - sx;
        const dy = ey - sy;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 30) continue;

        // Perpendicular direction for offset
        const px = -dy / len;
        const py = dx / len;
        const off = DIM_OFFSET;

        const dsx = sx + px * off;
        const dsy = sy + py * off;
        const dex = ex + px * off;
        const dey = ey + py * off;

        // Dimension line
        ctx.beginPath();
        ctx.strokeStyle = COLORS.dimLine;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.moveTo(dsx, dsy);
        ctx.lineTo(dex, dey);
        ctx.stroke();
        ctx.setLineDash([]);

        // Extension lines
        ctx.beginPath();
        ctx.moveTo(sx + px * 6, sy + py * 6);
        ctx.lineTo(dsx + px * 4, dsy + py * 4);
        ctx.moveTo(ex + px * 6, ey + py * 6);
        ctx.lineTo(dex + px * 4, dey + py * 4);
        ctx.stroke();

        // Arrows
        const adx = (dex - dsx) / len;
        const ady = (dey - dsy) / len;
        ctx.fillStyle = COLORS.dimLine;
        // Start arrow
        ctx.beginPath();
        ctx.moveTo(dsx, dsy);
        ctx.lineTo(dsx + adx * ARROW_SIZE + px * ARROW_SIZE * 0.4, dsy + ady * ARROW_SIZE + py * ARROW_SIZE * 0.4);
        ctx.lineTo(dsx + adx * ARROW_SIZE - px * ARROW_SIZE * 0.4, dsy + ady * ARROW_SIZE - py * ARROW_SIZE * 0.4);
        ctx.fill();
        // End arrow
        ctx.beginPath();
        ctx.moveTo(dex, dey);
        ctx.lineTo(dex - adx * ARROW_SIZE + px * ARROW_SIZE * 0.4, dey - ady * ARROW_SIZE + py * ARROW_SIZE * 0.4);
        ctx.lineTo(dex - adx * ARROW_SIZE - px * ARROW_SIZE * 0.4, dey - ady * ARROW_SIZE - py * ARROW_SIZE * 0.4);
        ctx.fill();

        // Label
        const paramValue = params[seg.label];
        const labelText = paramValue !== undefined
          ? `${seg.label} = ${paramValue}`
          : seg.label;
        const midX = (dsx + dex) / 2;
        const midY = (dsy + dey) / 2;
        ctx.font = `11px "IBM Plex Mono", monospace`;
        ctx.fillStyle = COLORS.dimText;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(labelText, midX, midY - 4);
      }

      ctx.globalAlpha = 1;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- barSize used indirectly via bendRadius
  }, [shape, params, bendRadius, drawProgress, bendProgress, width, height, thumbnail]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ width, height }}
      aria-label={`${shape.name} bar shape diagram`}
    />
  );
}
