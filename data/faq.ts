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
    answer: `${pilot.name} includes ${pilot.includedUsage.cameras.toLowerCase()} and ${pilot.includedUsage.storage.toLowerCase()}. ${production.name} includes ${production.includedUsage.cameras.toLowerCase()} with ${production.includedUsage.storage.toLowerCase()}. ${enterprise.name} deployments use ${enterprise.includedUsage.cameras.toLowerCase()} with ${enterprise.includedUsage.storage.toLowerCase()}. ${production.includedUsage.overage}.`,
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
