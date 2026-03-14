export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: 'How long does deployment take?',
    answer: 'Pilot plans are self-service and operational within hours. Production deployments typically begin with a 2-week onboarding phase followed by a 60-day validation window. Enterprise engagements include a scoping assessment before deployment timelines are set.',
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
    answer: 'Pilot plans are month-to-month. Production and Enterprise agreements include a 60-day validation window to confirm fit and ROI before any long-term commitment. If the modeled value does not materialise, you can walk away.',
  },
  {
    question: 'How are savings measured?',
    answer: 'We use published industry scrap rates as baselines — not self-reported numbers — and apply conservative reduction targets. All savings metrics (scrap, rework, throughput) are measured through the platform\'s own logged data, not estimates.',
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
