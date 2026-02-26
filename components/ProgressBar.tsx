"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

export default function ProgressBar() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX: shouldReduceMotion ? scrollYProgress : scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-indigoCalm"
      aria-hidden="true"
    />
  );
}
