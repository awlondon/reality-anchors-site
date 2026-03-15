import type { Metadata } from 'next';
import { dataPracticesFaqs, dataPracticesFaqStructuredData } from '@/data/data-practices-faq';

export const metadata: Metadata = {
  title: 'Data Practices',
  description:
    'How Reality Anchors handles your data — plain-language answers for security and procurement teams.',
  alternates: { canonical: '/data-practices/' },
  openGraph: {
    title: 'Data Practices | Reality Anchors',
    description: 'Plain-language answers about data collection, storage, access, export, and retention.',
  },
};

const CONTACT_EMAIL = 'privacy@realityanchors.co';

export default function DataPracticesPage() {
  return (
    <main className="min-h-screen bg-bg text-txt pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-xs uppercase tracking-widest text-muted mb-3">Trust</p>
        <h1 className="text-3xl font-semibold mb-2">Data Practices</h1>
        <p className="text-muted mb-10 leading-relaxed">
          How we handle your data — plain-language answers for security and procurement teams. For the
          full legal policy, see our <a href="/privacy/" className="text-accent underline underline-offset-2">Privacy Policy</a>.
        </p>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dataPracticesFaqStructuredData()) }}
        />

        <div className="space-y-8">
          {dataPracticesFaqs.map((item) => (
            <section key={item.question}>
              <h2 className="text-lg font-semibold text-txt mb-2">{item.question}</h2>
              <p className="text-muted leading-relaxed">{item.answer}</p>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-line">
          <h2 className="text-lg font-semibold text-txt mb-2">Still have questions?</h2>
          <p className="text-muted leading-relaxed">
            Contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>{' '}
            or <a href="/commercial/#contact" className="text-accent underline underline-offset-2">request a call</a> with
            our team. Enterprise customers can reach their dedicated account manager directly.
          </p>
        </div>
      </div>
    </main>
  );
}
