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
    answer: 'Bring your own compatible cameras — Reality Anchors provides the software orchestration, metadata tagging, and cloud workflow. The platform supports mixed fleets of reference, context, and depth devices. LiDAR-equipped cameras are optional and only needed when you require precision depth. The system works offline-first and syncs when connected.',
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
    answer: 'We use industry-typical scrap rates as baselines — not self-reported numbers — and apply conservative reduction targets. Savings metrics (scrap, rework, throughput) are tracked through the platform\'s own logged data during the validation window.',
  },
  {
    question: 'Do I need LiDAR?',
    answer: 'No. LiDAR is entirely optional. Most setups work with standard cameras that capture reference and context data. LiDAR-equipped devices add precision depth measurement when your workflow demands sub-millimetre accuracy — for example, verifying rebar spacing or confirming bend angles to tight tolerances. If you do not need that level of precision, a standard camera fleet is all you need.',
  },
  {
    question: 'How many cameras are included?',
    answer: 'Each plan includes a base number of cameras and a storage allocation. Personal plans include one camera with base storage. Commercial plans support multiple cameras across a mixed fleet with higher storage tiers available. Industrial agreements include custom camera and storage allocations. If you add more cameras or exceed your storage tier, overage is billed transparently — you always know what you are paying for and why.',
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
