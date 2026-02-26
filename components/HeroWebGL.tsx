"use client";

import { motion, useReducedMotion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import StructuredFieldBackground from "@/components/StructuredFieldBackground";

export default function HeroWebGL() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="top" className="relative h-screen w-full overflow-hidden bg-[#070b12]">
      <StructuredFieldBackground className="absolute inset-0" intensity={shouldReduceMotion ? 0 : 0.65} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-36 text-white">
        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl"
        >
          Deterministic Intelligence for Industrial Execution
        </motion.h1>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-lg text-white/85"
        >
          Structured validation, optimization, and traceable workflows—built for field and shop.
        </motion.p>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href="#contact"
            onClick={() => trackEvent("cta_click", { location: "hero_webgl", cta: "request_demo" })}
            className="rounded bg-indigo-600 px-7 py-4 font-medium transition hover:bg-indigo-700"
          >
            Request Demo
          </a>
          <a
            href="#case-studies"
            onClick={() => trackEvent("cta_click", { location: "hero_webgl", cta: "view_case_studies" })}
            className="rounded border border-white/40 px-7 py-4 font-medium transition hover:bg-white/10"
          >
            View Case Studies
          </a>
        </motion.div>
      </div>
    </section>
  );
}
