import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for the Reality Anchors Limited website. Covers site usage, intellectual property, liability, and governing law.',
  alternates: { canonical: '/terms/' },
  openGraph: {
    title: 'Terms of Service | Reality Anchors',
    description: 'Terms of Service for the Reality Anchors Limited website.',
  },
};

const EFFECTIVE_DATE = '1 March 2026';
const CONTACT_EMAIL = 'legal@realityanchors.co';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg text-txt pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-xs uppercase tracking-widest text-muted mb-3">Legal</p>
        <h1 className="text-3xl font-semibold mb-2">Terms of Service</h1>
        <p className="text-sm text-muted mb-10">Effective date: {EFFECTIVE_DATE}</p>

        <div>
          <Section title="1. Acceptance">
            <p>
              By accessing or using the Reality Anchors website (&quot;Site&quot;) or any associated software
              services (&quot;Services&quot;), you agree to be bound by these Terms of Service. If you do not agree,
              please do not use the Site or Services.
            </p>
          </Section>

          <Section title="2. Use of the site">
            <p>You agree not to:</p>
            <ul>
              <li>Use the Site for any unlawful purpose or in violation of any applicable regulations.</li>
              <li>Submit false, misleading, or fraudulent information through any form.</li>
              <li>Attempt to gain unauthorised access to any part of the Site or its infrastructure.</li>
              <li>Use automated tools to scrape or systematically copy Site content without permission.</li>
            </ul>
          </Section>

          <Section title="3. Intellectual property">
            <p>
              All content on this Site — including text, graphics, product descriptions, data models, and software —
              is the property of Reality Anchors Limited or its licensors and is protected by applicable intellectual
              property laws. Nothing on this Site grants you any licence to use our intellectual property without
              express written permission.
            </p>
          </Section>

          <Section title="4. Software services">
            <p>
              Access to the Reality Anchors platform software is governed by a separate subscription agreement or
              enterprise licence agreement entered into at the time of purchase. These Terms do not govern platform
              access; they apply only to your use of this marketing website.
            </p>
          </Section>

          <Section title="5. No warranty">
            <p>
              The Site and its content are provided &quot;as is&quot; without warranty of any kind, express or
              implied, including warranties of merchantability, fitness for a particular purpose, or
              non-infringement. Metrics and outcome figures presented on the Site are indicative and based on observed
              customer data; individual results will vary.
            </p>
          </Section>

          <Section title="6. Limitation of liability">
            <p>
              To the fullest extent permitted by law, Reality Anchors Limited shall not be liable for any indirect,
              incidental, consequential, or punitive damages arising from your use of the Site. Our total liability
              for any claim arising from Site use shall not exceed AUD $100.
            </p>
          </Section>

          <Section title="7. Third-party links">
            <p>
              The Site may link to third-party websites. We are not responsible for the content, privacy practices,
              or accuracy of any third-party site.
            </p>
          </Section>

          <Section title="8. Governing law">
            <p>
              These Terms are governed by the laws of New South Wales, Australia. Any disputes arising under these
              Terms shall be subject to the exclusive jurisdiction of the courts of New South Wales.
            </p>
          </Section>

          <Section title="9. Changes to these terms">
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be indicated by an
              updated effective date. Continued use of the Site after changes constitutes acceptance of the revised
              Terms.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              Questions about these Terms? Contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-txt mb-3">{title}</h2>
      <div className="text-muted leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-txt">
        {children}
      </div>
    </section>
  );
}
