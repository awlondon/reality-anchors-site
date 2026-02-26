'use client';

import { useEffect, useRef } from 'react';
import { computeSessionPaths } from '@/lib/computeSessionPaths';
import { useLiveIntentStream } from '@/lib/useLiveIntentStream';

export default function IntentTraceOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { events, sessions } = useLiveIntentStream();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const probabilityBySession = new Map(sessions.map((s) => [s.sessionId, s.probability]));
    const paths = computeSessionPaths(events);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    paths.forEach((path) => {
      if (path.points.length < 2) return;
      const p = probabilityBySession.get(path.sessionId) ?? 0;

      ctx.beginPath();
      path.points.forEach((point, idx) => {
        const y = (point.y / 100) * document.documentElement.scrollHeight;
        const x = (idx / (path.points.length - 1)) * canvas.width;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = p > 0.7 ? 'rgba(255,0,0,0.45)' : 'rgba(0,200,255,0.25)';
      ctx.lineWidth = p > 0.7 ? 2.5 : 1.5;
      ctx.stroke();
    });

    return () => window.removeEventListener('resize', resize);
  }, [events, sessions]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed left-0 top-0 z-40 opacity-70" />;
}
