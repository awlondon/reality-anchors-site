export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: 'How long does deployment take?',
    answer: 'Personal plans are self-service and designed to be operational within hours. Commercial deployments are planned around a 2-week onboarding phase followed by a 60-day validation window. Industrial engagements include a scoping assessment before deployment timelines are set.',
  },
  {
    question: 'What hardware or infrastructure is required?',
    answer: 'Reality Anchors runs on standard tablets and laptops — no specialised hardware required. The platform works offline-first and syncs when connected. For industrial environments, we support integration with existing ERP and QA systems through structured data exports.',
  },
  {
    question: 'How does it integrate with our existing ERP or detailing software?',
    answer: 'Reality Anchors works alongside your planning and detailing systems. It imports cut lists from existing schedules and exports verified execution records. Nothing to rip out — we plug into what you already run.',
  },
  {
    question: 'What happens to our data?',
    answer: 'All data stays within your control. Every action is logged in tamper-proof event records you can export for audits at any time. Nothing is shared with third parties. See our privacy policy for full details.',
  },
  {
    question: 'Is there a contract lock-in?',
    answer: 'Personal plans are month-to-month. Commercial and Industrial agreements include a 60-day validation window to confirm fit before any long-term commitment. If the platform does not deliver value, you can walk away.',
  },
  {
    question: 'How are savings measured?',
    answer: 'We use industry-typical scrap rates as baselines — not self-reported numbers — and apply conservative reduction targets. Savings metrics (scrap, rework, throughput) are tracked through the platform\'s own logged data during the validation window.',
  },
];

/** Structured data for FAQPage schema — embed in page head via JSON-LD */
export function faqStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
