"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reducedMotion) {
      const onMove = (event: PointerEvent) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 8;
        const y = (event.clientY / window.innerHeight - 0.5) * 8;
        video.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.05)`;
      };
      section.addEventListener("pointermove", onMove);
      return () => section.removeEventListener("pointermove", onMove);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="top" ref={sectionRef} className="relative flex min-h-screen items-center overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/fallback-hero.svg"
        aria-label="Abstract industrial geometry video background"
      >
        <source src="/hero-loop.webm" type="video/webm" />
        <source src="/hero-loop.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-graphite/85 via-graphite/70 to-graphite/90" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24">
        <p className="mb-3 text-xs tracking-[0.18em] text-cyan-200/85">REALITY ANCHORS LIMITED</p>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
          Precision Intelligence for Structural Systems
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/85 md:text-lg">
          Deterministic optimization, real-time validation, and field-ready workflows that convert planning decisions into measurable outcomes.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#contact"
            onClick={() => trackEvent("cta_click", { location: "hero", cta: "request_demo" })}
            className="rounded-md bg-indigoCalm px-5 py-3 font-medium transition hover:-translate-y-0.5 hover:bg-indigo-400"
          >
            Request Demo
          </a>
          <a
            href="#case-studies"
            onClick={() => trackEvent("cta_click", { location: "hero", cta: "view_case_studies" })}
            className="rounded-md border border-white/35 px-5 py-3 font-medium transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            View Case Studies
          </a>
        </div>
        <div className="mt-16 animate-bounce text-sm text-white/60">Scroll ↓</div>
      </div>
    </section>
  );
}
