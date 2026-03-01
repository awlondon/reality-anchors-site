import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  alternates: { canonical: '/privacy/' },
};

const EFFECTIVE_DATE = '1 March 2026';
const CONTACT_EMAIL = 'privacy@realityanchors.co';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg text-txt pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-xs uppercase tracking-widest text-muted mb-3">Legal</p>
        <h1 className="text-3xl font-semibold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted mb-10">Effective date: {EFFECTIVE_DATE}</p>

        <div className="prose-legal">
          <Section title="1. Who we are">
            <p>
              Reality Anchors Limited (&quot;Reality Anchors&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website at{' '}
              <a href="https://ra.primarydesignco.com">ra.primarydesignco.com</a> and provides operational validation
              software for fabrication and industrial operations.
            </p>
          </Section>

          <Section title="2. What information we collect">
            <p>We collect information you provide directly to us:</p>
            <ul>
              <li>
                <strong>Contact form submissions:</strong> name, work email address, company name, role, and any
                message you include.
              </li>
              <li>
                <strong>Usage data:</strong> pages visited, session identifiers, traffic source, and interaction
                events (e.g. which product regime you engaged with). This data is anonymised and aggregated.
              </li>
              <li>
                <strong>Technical data:</strong> IP address, browser user-agent, and referring URL collected
                automatically when you submit a form, used solely for spam prevention and lead attribution.
              </li>
            </ul>
          </Section>

          <Section title="3. How we use your information">
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your enquiry and assess product fit.</li>
              <li>Send you communications related to your request (no unsolicited marketing).</li>
              <li>Improve the website and product based on aggregated, anonymised usage signals.</li>
              <li>Detect and prevent abuse of our contact and lead forms.</li>
            </ul>
            <p>We do not sell, rent, or share your personal information with third parties for their own marketing purposes.</p>
          </Section>

          <Section title="4. Third-party services">
            <p>We use the following third-party services to operate the site:</p>
            <ul>
              <li>
                <strong>Resend</strong> — email delivery for contact form notifications. Your submitted data is
                transmitted to Resend solely to deliver the notification email.
              </li>
              <li>
                <strong>Firebase (Google)</strong> — real-time database used for anonymised session analytics and
                sales alerting. No personally identifiable information is stored in Firebase without your explicit
                submission.
              </li>
            </ul>
            <p>
              Each service operates under its own privacy policy. We encourage you to review them if you have concerns
              about how they handle data.
            </p>
          </Section>

          <Section title="5. Data retention">
            <p>
              Contact form submissions are retained for up to 24 months for sales follow-up purposes, after which
              they are deleted. Anonymised session analytics may be retained indefinitely in aggregated form.
            </p>
          </Section>

          <Section title="6. Your rights">
            <p>
              Depending on your jurisdiction, you may have rights to access, correct, or delete personal data we hold
              about you. To exercise any of these rights, contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>
              This site uses a single session cookie (<code>exp_home_narrative_v1</code>) to preserve A/B test
              variant assignment across page loads. It contains no personally identifiable information and expires
              with your session. We do not use advertising or cross-site tracking cookies.
            </p>
          </Section>

          <Section title="8. Security">
            <p>
              We take reasonable technical measures to protect information transmitted to us, including HTTPS
              encryption. No transmission method is 100% secure; we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="9. Changes to this policy">
            <p>
              We may update this policy from time to time. Material changes will be reflected in an updated effective
              date at the top of this page.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              Questions about this policy? Contact us at{' '}
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
      <div className="text-muted leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-txt [&_code]:font-mono [&_code]:text-sm [&_code]:bg-card [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded">
        {children}
      </div>
    </section>
  );
}
