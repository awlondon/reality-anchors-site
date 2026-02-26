'use client';

import { useEffect, useRef } from 'react';
import { useLiveIntentStream } from '@/lib/useLiveIntentStream';

export default function IntentHeatmapOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { sessions } = useLiveIntentStream();

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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sessions.forEach((s) => {
      if (!s.maxScrollDepth || !s.probability) return;

      const y = (s.maxScrollDepth / 100) * document.documentElement.scrollHeight;
      const intensity = Math.min(s.probability, 1);
      const radius = 120 * intensity;

      const gradient = ctx.createRadialGradient(canvas.width / 2, y, 0, canvas.width / 2, y, radius);
      gradient.addColorStop(0, `rgba(255,0,0,${0.25 * intensity})`);
      gradient.addColorStop(1, 'rgba(255,0,0,0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    return () => window.removeEventListener('resize', resize);
  }, [sessions]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed left-0 top-0 z-40 opacity-50" />;
}
