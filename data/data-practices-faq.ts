import type { FAQItem } from '@/data/faq';

export const dataPracticesFaqs: FAQItem[] = [
  {
    question: 'What data does Reality Anchors collect?',
    answer:
      'From the marketing website: contact form submissions (name, email, company, role, message), anonymised usage data (pages visited, session IDs, traffic source), and technical data (IP address, browser user-agent). From the platform: rebar reference measurements, AR calibration data, camera frames, LiDAR depth maps (when applicable), device identifiers, and operator session metadata.',
  },
  {
    question: 'Where is my data stored?',
    answer:
      'Website lead data is stored in Google Firebase (US data centres). Platform telemetry is processed on-device and synced to our cloud infrastructure hosted on Google Cloud Platform. All data is encrypted in transit (TLS/HTTPS) and at rest. We do not store data outside of US-based infrastructure unless specified in your enterprise agreement.',
  },
  {
    question: 'Who can access my data?',
    answer:
      'Access is scoped to your organisation. Only authorised members of your team and designated Reality Anchors support personnel can access your operational data. We do not sell, rent, or share your data with third parties for their own purposes. Third-party service providers (EmailJS for email delivery, Firebase for storage, GA4 for anonymised web analytics) process data solely on our behalf.',
  },
  {
    question: 'Can I export my data?',
    answer:
      'Yes. You can request a copy of your data in a structured, machine-readable format by contacting privacy@realityanchors.co or your account manager. We fulfil export requests within 30 days. Enterprise customers can arrange bulk exports as part of their subscription agreement.',
  },
  {
    question: 'What happens to my data if I cancel?',
    answer:
      'After cancellation, operational telemetry data is retained for up to 90 days to allow for reactivation, then permanently deleted. Raw camera frames and sensor data are purged within 30 days. Contracts, audit logs, and compliance records are retained as required by applicable law. Aggregated, anonymised data (which cannot identify you or your facility) may be retained indefinitely.',
  },
  {
    question: 'How does Reality Anchors use my data for analytics or AI?',
    answer:
      'We use a three-tier framework. Tier 1 (Operational): your data is used to run the platform for you — always permitted. Tier 2 (Aggregated Analytics): de-identified data is used to improve product quality and benchmark industry performance — no customer-identifiable information is involved. Tier 3 (Model Training): use of your facility-specific data to train ML models requires your explicit written opt-in and can be revoked at any time. See our Privacy Policy for full details.',
  },
  {
    question: 'Does Reality Anchors sell my data?',
    answer:
      'No. We do not sell your personal information. We do not share your personal information for cross-context behavioural advertising. This applies to all data categories — contact information, usage data, and fabrication telemetry.',
  },
];

export function dataPracticesFaqStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: dataPracticesFaqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
