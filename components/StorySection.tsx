"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type StorySectionProps = {
  id?: string;
  title: string;
  body: string;
  media?: React.ReactNode;
  eyebrow?: string;
};

export default function StorySection({ id, title, body, media, eyebrow }: StorySectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.15, 0.45, 0.85], [0.2, 1, 0.7]);
  const y = useTransform(scrollYProgress, [0.15, 0.45], [32, 0]);

  return (
    <section
      id={id}
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24 text-white"
    >
      {media ? (
        <motion.div
          style={shouldReduceMotion ? undefined : { opacity }}
          className="absolute inset-0 -z-10"
          aria-hidden="true"
        >
          {media}
        </motion.div>
      ) : null}

      <motion.div
        style={shouldReduceMotion ? undefined : { opacity, y }}
        className="mx-auto max-w-4xl text-center"
      >
        {eyebrow ? <p className="mb-4 text-xs tracking-[0.18em] text-cyan-200/85">{eyebrow}</p> : null}
        <h2 className="text-balance text-4xl font-semibold leading-tight md:text-6xl">{title}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">{body}</p>
      </motion.div>
    </section>
  );
}
