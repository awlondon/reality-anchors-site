import { pricingTiers } from '@/data/pricing';

export interface FAQItem {
  question: string;
  answer: string;
}

const pilot = pricingTiers.find((tier) => tier.id === 'pilot')!;
const production = pricingTiers.find((tier) => tier.id === 'production')!;
const enterprise = pricingTiers.find((tier) => tier.id === 'enterprise')!;

export const faqs: FAQItem[] = [
  {
    question: 'How long does deployment take?',
    answer:
      'Pilot plans can start in days because they begin with a single-bench workflow and customer-supplied hardware. Production deployments typically start with a short onboarding sprint and a 60-day validation window. Enterprise timelines depend on facility count, integration scope, and governance requirements.',
  },
  {
    question: 'What hardware or infrastructure is required?',
    answer:
      'Bring your own compatible cameras. Reality Anchors provides the software orchestration, metadata tagging, workflow logic, and cloud sync. The platform supports mixed fleets of reference, context, and depth devices, works offline-first, and syncs when connected.',
  },
  {
    question: 'How does it integrate with our existing ERP or detailing software?',
    answer:
      'Reality Anchors works alongside your planning and detailing systems. It imports cut lists and job context from the tools you already use, then exports verified execution records, QA evidence, and audit-ready data without forcing you to replace upstream systems.',
  },
  {
    question: 'What happens to our data?',
    answer:
      'All capture data stays within your control. Operator actions, validation events, and exported records are logged for traceability, and enterprise deployments can scope longer retention and formal export requirements during technical review.',
  },
  {
    question: 'How are beta reviews and paid conversion handled?',
    answer:
      'Pilot and beta-style evaluations are framed up front. Before activation, you get a documented review date, the exact tier boundary, what converts to paid use, and what happens if you stop after validation. The goal is to avoid surprise billing and keep the commercial step explicit.',
  },
  {
    question: 'How are savings measured?',
    answer:
      'We use published industry baselines and logged operational metrics rather than self-reported numbers. During validation, the platform tracks scrap, rework, throughput, and usage against a stated baseline model so the economics stay transparent.',
  },
  {
    question: 'Do I need LiDAR?',
    answer:
      'No. LiDAR is optional. Most deployments start with standard cameras for reference and context capture. LiDAR-equipped devices are added when you need precision depth, such as tighter bend verification or spacing checks, and are positioned as upgrades rather than universal requirements.',
  },
  {
    question: 'How many cameras are included?',
    answer:
      'Every tier includes one reference camera per bench at no extra cost. Context cameras ($200/device/mo) and LiDAR-equipped devices ($450/device/mo) are available as add-ons across all tiers. The number of additional devices depends on your bench layout, coverage needs, and whether precision depth is required for your validation workflow.',
  },
  {
    question: 'How does per-device pricing work?',
    answer:
      'Every bench plan includes one reference camera at no extra cost. When you need wider coverage, add context cameras at $200/device/month. For sub-millimetre precision depth, add LiDAR-equipped devices at $450/device/month. You only pay for the devices your operation actually uses — no bundles, no minimums beyond the included reference camera.',
  },
  {
    question: 'What is the difference between a reference camera, a context camera, and a LiDAR device?',
    answer:
      'A reference camera is your baseline capture device — it records structured data tied to your job specs and operator-confirmed steps. A context camera adds wider coverage, additional angles, or redundancy to your bench setup. A LiDAR-equipped device adds precision depth measurement for tighter bend verification or spacing checks. Most operations start with the included reference camera and add devices as validation requirements grow.',
  },
];

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
