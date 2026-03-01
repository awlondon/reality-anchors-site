export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: 'How long does deployment take?',
    answer: 'Personal plans are self-service and operational within hours. Commercial deployments typically begin with a 2-week onboarding phase followed by a 60-day validation window. Industrial engagements include a scoping assessment before deployment timelines are set.',
  },
  {
    question: 'What hardware or infrastructure is required?',
    answer: 'Reality Anchors runs on standard tablets and laptops — no specialised hardware required. The platform works offline-first and syncs when connected. For industrial environments, we support integration with existing ERP and QA systems through structured data exports.',
  },
  {
    question: 'How does it integrate with our existing ERP or detailing software?',
    answer: 'Reality Anchors sits downstream of planning and detailing systems. It imports cut lists from existing schedules and exports verified execution records. Integration is non-invasive — we complement your existing stack rather than replacing any part of it.',
  },
  {
    question: 'What happens to our data?',
    answer: 'All execution data stays within your control. We use immutable event logs for traceability and export-ready formats for audits. No data is shared with third parties. See our privacy policy for full details.',
  },
  {
    question: 'Is there a contract lock-in?',
    answer: 'Personal plans are month-to-month. Commercial and Industrial agreements include a 60-day validation window to confirm fit and ROI before any long-term commitment. If the modeled value does not materialise, you can walk away.',
  },
  {
    question: 'How are savings measured?',
    answer: 'We use published industry baseline scrap rates (not self-reported numbers) and apply conservative improvement deltas. All savings metrics — scrap, rework, throughput — are measured through the platform\'s own logged data, not estimates.',
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
