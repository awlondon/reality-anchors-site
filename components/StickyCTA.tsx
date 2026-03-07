'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import { CTA } from '@/lib/constants';

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const fromBottom = docHeight - (y + vh);

      // Show after scrolling past hero, hide near the bottom LeadForm
      setVisible(y > vh && fromBottom > vh * 2.5);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-0 inset-x-0 z-30 pointer-events-none"
        >
          <div className="max-w-6xl mx-auto px-4 pb-4 mb-[env(safe-area-inset-bottom,0px)]">
            <div className="pointer-events-auto bg-card/95 backdrop-blur-md border border-line rounded-xl px-5 py-3 flex items-center justify-between gap-4 shadow-2xl shadow-black/50">
              <p className="text-sm text-muted hidden sm:block">
                See how much scrap your shop could save.
              </p>
              <div className="flex items-center gap-3 ml-auto">
                <Link
                  href={CTA.primary.href}
                  className="text-sm text-accent-2 hover:text-white font-semibold transition-colors underline underline-offset-4"
                  onClick={() => trackEvent('sticky_cta_calculator')}
                >
                  {CTA.primary.label}
                </Link>
                <Link
                  href={CTA.secondary.href}
                  className="px-4 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px whitespace-nowrap min-h-[44px]"
                  onClick={() => trackEvent('sticky_cta_contact')}
                >
                  {CTA.secondary.label}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
