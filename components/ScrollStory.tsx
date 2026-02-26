"use client";

import { motion, useReducedMotion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import LeadForm from "@/components/LeadForm";
import StorySection from "@/components/StorySection";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/motion";

const cards = [
  {
    title: "Consistent Workflow Execution",
    desc: "Reduce guesswork with guided steps, built-in checks, and operator-ready instructions.",
  },
  {
    title: "Cross-Project Optimization",
    desc: "Shared cut strategies reduce scrap and normalize quality across crews.",
  },
  {
    title: "Real-Time Validation + Logs",
    desc: "Each job is documented for review, compliance readiness, and field accountability.",
  },
];

export default function ScrollStory() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <StorySection
        id="top"
        eyebrow="REALITY ANCHORS LIMITED"
        title="Fabrication still runs on fragile assumptions"
        body="Paper notes, spreadsheet drift, and hidden rework costs compound across every production cycle."
        media={
          <div className="relative h-full w-full">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/fallback-hero.svg"
              aria-label="Abstract structural background"
            >
              <source src="/hero-loop.webm" type="video/webm" />
              <source src="/hero-loop.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-graphite/85 via-graphite/70 to-graphite/90" />
          </div>
        }
      />

      <StorySection
        title="Every miscalculation creates downstream cost"
        body="Material waste, schedule risk, and inconsistent fabrication outputs are symptoms of unmanaged decision systems."
        media={<div className="h-full w-full bg-gradient-to-b from-slate-900 to-graphite" />}
      />

      <StorySection
        id="solutions"
        title="Execution guidance where planning ends"
        body="Reality Anchors operates at the workstation: turning job instructions into action-ready steps with real-time confirmation."
        media={<div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,#1A2A40,transparent_45%),linear-gradient(#0B0F17,#0B0F17)]" />}
      />

      <section className="bg-white py-24 text-slate-900">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-3"
        >
          {cards.map((card) => (
            <motion.article key={card.title} variants={fadeUp} className="rounded-xl border border-slate-200 p-7 shadow-sm">
              <h3 className="text-xl font-semibold">{card.title}</h3>
              <p className="mt-3 text-slate-700">{card.desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <motion.section
        id="case-studies"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="bg-slate-900/80 py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-semibold">Proof in live environments</h2>
          <p className="mt-4 max-w-3xl text-white/75">
            Teams report measurable gains within weeks: improved cut precision, lower scrap, and faster planning handoffs.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {["17% scrap reduction", "11% schedule lift", "9% precision gain"].map((metric) => (
              <article key={metric} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-2xl font-semibold text-cyan-200">{metric}</p>
                <p className="mt-2 text-sm text-white/70">Validated through phased rollouts and continuous operational monitoring.</p>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="bg-graphite py-24">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center"
        >
          <h2 className="text-3xl font-semibold">Ready to modernize fabrication?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/75">
            If your systems end at planning, this closes the execution gap with measurable operational outcomes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#contact"
              onClick={() => trackEvent("cta_click", { location: "scroll_story", cta: "schedule_demo" })}
              className="rounded-md bg-indigoCalm px-5 py-3 font-medium transition hover:bg-indigo-400"
            >
              Schedule Demo
            </a>
            <a
              href="#contact"
              onClick={() => trackEvent("cta_click", { location: "scroll_story", cta: "view_technical_overview" })}
              className="rounded-md border border-white/35 px-5 py-3 font-medium transition hover:bg-white/10"
            >
              View Technical Overview
            </a>
          </div>
        </motion.div>
      </section>

      <LeadForm />
    </>
  );
}
