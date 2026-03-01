'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/motion';
import { trackEvent } from '@/lib/analytics';
import { faqs, type FAQItem } from '@/data/faq';

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-line rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-card/50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-txt">{item.question}</span>
        <svg
          className={`w-4 h-4 text-muted shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-muted leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-bg">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-10"
        >
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-txt leading-tight">
            Common questions
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="flex flex-col gap-3"
        >
          {faqs.map((faq, i) => (
            <motion.div key={faq.question} variants={fadeUp}>
              <AccordionItem
                item={faq}
                isOpen={openIndex === i}
                onToggle={() => {
                  const willOpen = openIndex !== i;
                  setOpenIndex(willOpen ? i : null);
                  if (willOpen) trackEvent('faq_open', { question: faq.question });
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
