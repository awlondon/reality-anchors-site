import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Reality Anchors Limited collects, uses, and protects your information when you use our website and services.',
  alternates: { canonical: '/privacy/' },
  openGraph: {
    title: 'Privacy Policy | Reality Anchors',
    description: 'How Reality Anchors Limited collects, uses, and protects your information.',
  },
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
              <a href="https://realityanchorsltd.com">realityanchorsltd.com</a> and provides operational validation
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
                <strong>EmailJS</strong> — email delivery for contact form notifications and confirmation
                emails. Your submitted data is transmitted to EmailJS solely to deliver notification and
                confirmation emails.
              </li>
              <li>
                <strong>Firebase (Google)</strong> — real-time database used for anonymised session analytics and
                sales alerting. No personally identifiable information is stored in Firebase without your explicit
                submission.
              </li>
              <li>
                <strong>Google Analytics 4 (GA4)</strong> — web analytics service provided by Google LLC. GA4
                collects anonymised usage data (pages visited, session duration, traffic source, device type) to
                help us understand how visitors interact with our site. GA4 may set cookies such as{' '}
                <code>_ga</code> and <code>_gid</code> on your device, subject to your consent.
              </li>
              <li>
                <strong>Google Tag Manager (GTM)</strong> — tag management service provided by Google LLC. GTM
                coordinates the loading and firing of analytics and advertising tags on our site. GTM itself does
                not collect personal data, but it manages the deployment of services that do (such as GA4 and
                Google Ads).
              </li>
              <li>
                <strong>Google Ads</strong> — we use Google Ads conversion tracking to measure the effectiveness
                of our advertising campaigns. When you arrive at our site after clicking a Google ad, a conversion
                tag records that visit. This may set cookies such as <code>_gcl_aw</code> and{' '}
                <code>_gcl_au</code> on your device, subject to your consent. No personally identifiable
                information is shared with Google for advertising purposes.
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

          <Section title="7. Cookies and similar technologies">
            <p>
              This site uses cookies and similar technologies for the following purposes, subject to your consent
              choices:
            </p>
            <ul>
              <li>
                <strong>Essential cookies:</strong> <code>exp_home_narrative_v1</code> — preserves A/B test
                variant assignment across page loads. Contains no personally identifiable information and expires
                with your session. This cookie is always active as it is necessary for site functionality.
              </li>
              <li>
                <strong>Analytics cookies (requires consent):</strong> <code>_ga</code>, <code>_gid</code> — set
                by Google Analytics 4 to distinguish unique users and throttle request rate. These cookies expire
                after up to 2 years (<code>_ga</code>) or 24 hours (<code>_gid</code>).
              </li>
              <li>
                <strong>Advertising cookies (requires consent):</strong> <code>_gcl_aw</code>,{' '}
                <code>_gcl_au</code>, <code>_gac_*</code> — set by Google Ads to attribute conversions to ad
                clicks. These cookies expire after 90 days.
              </li>
            </ul>
            <p>
              When you first visit our site, analytics and advertising cookies are blocked by default. A consent
              banner allows you to accept or reject these cookies. Your choice is stored in your browser&apos;s
              local storage and respected on subsequent visits. You can change your preference at any time by
              clearing your browser&apos;s local storage for this site.
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
