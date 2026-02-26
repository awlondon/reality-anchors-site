"use client";

import { useEffect, useRef, useState } from "react";

type Metric = { label: string; value: number; suffix?: string; prefix?: string };

const metrics: Metric[] = [
  { value: 30, suffix: "%", label: "Scrap reduction potential" },
  { value: 5, suffix: "s", prefix: "< ", label: "Plan generation latency" },
  { value: 1, suffix: "%", prefix: "< ", label: "Fabrication error target" },
  { value: 100, suffix: "%", label: "Offline-ready field workflows" },
];

export default function Metrics() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);
  const [display, setDisplay] = useState<number[]>(metrics.map(() => 0));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;

    const duration = 900;
    const steps = 30;
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      setDisplay(metrics.map((metric) => Math.round((metric.value * step) / steps)));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [active]);

  return (
    <section ref={sectionRef} className="bg-slate-900/70 py-16">
      <div className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-4">
        {metrics.map((metric, idx) => (
          <article key={metric.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-3xl font-semibold text-cyan-200">
              {metric.prefix ?? ""}
              {display[idx]}
              {metric.suffix ?? ""}
            </p>
            <p className="mt-2 text-sm text-white/75">{metric.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
