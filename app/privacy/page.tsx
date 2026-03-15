import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Reality Anchors LLC collects, uses, and protects your information when you use our website and services.',
  alternates: { canonical: '/privacy/' },
  openGraph: {
    title: 'Privacy Policy | Reality Anchors',
    description: 'How Reality Anchors collects, uses, and protects your information.',
  },
};

const EFFECTIVE_DATE = '15 March 2026';
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
              Reality Anchors LLC (&quot;Reality Anchors&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website at{' '}
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

          <Section title="4. Data usage tiers">
            <p>
              We organise data usage into three tiers to make our practices transparent:
            </p>
            <ul>
              <li>
                <strong>Tier 1 — Operational:</strong> data used solely to deliver the service to you. This includes
                running execution workflows, storing validation records, and generating reports you request. Operational
                use is always permitted under your subscription agreement.
              </li>
              <li>
                <strong>Tier 2 — Aggregated and anonymised analytics:</strong> de-identified data used to improve
                product quality, benchmark performance across the industry, and generate aggregate insights. No
                customer-identifiable information leaves this tier. This usage is disclosed here and in your
                subscription agreement.
              </li>
              <li>
                <strong>Tier 3 — Model training on customer-specific data:</strong> use of your facility-specific
                operational data to train machine learning models. This tier requires your explicit written opt-in
                consent, documented in your subscription or enterprise agreement. You may revoke this consent at any
                time by contacting us at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </li>
            </ul>
          </Section>

          <Section title="5. Third-party services">
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

          <Section title="6. Fabrication telemetry and sensor data">
            <p>
              When you use the Reality Anchors platform, the following categories of operational data may be collected
              during execution sessions:
            </p>
            <ul>
              <li>Rebar reference measurements (bar size, count, length, weight).</li>
              <li>AR calibration data and session metadata.</li>
              <li>Camera frames captured during validation workflows.</li>
              <li>LiDAR depth maps (when LiDAR-equipped devices are used).</li>
              <li>Device identifiers and operator session metadata.</li>
            </ul>
            <p>
              Telemetry is processed both on-device and in our cloud infrastructure. Raw sensor data (camera frames,
              depth maps) is never shared with third parties. All fabrication telemetry falls under Tier 1
              (Operational) usage unless you have opted into Tier 3 (Model Training) as described in Section 4.
            </p>
          </Section>

          <Section title="7. Data retention">
            <p>We retain different categories of data for different periods:</p>
            <ul>
              <li>
                <strong>Contact form submissions:</strong> retained for up to 24 months for sales follow-up purposes,
                after which they are deleted.
              </li>
              <li>
                <strong>Anonymised session analytics:</strong> may be retained indefinitely in aggregated form.
              </li>
              <li>
                <strong>Fabrication telemetry metadata:</strong> retained for up to 90 days from the date of capture.
              </li>
              <li>
                <strong>Raw camera frames and sensor data:</strong> retained for up to 30 days, then automatically
                purged. Raw frames may contain device identifiers and shop-floor imagery.
              </li>
              <li>
                <strong>Contracts, audit logs, and compliance records:</strong> retained indefinitely or as required
                by applicable law and your subscription agreement.
              </li>
            </ul>
            <p>
              Retention windows may be customised under your enterprise subscription agreement. Contact your account
              manager or <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> to discuss specific requirements.
            </p>
          </Section>

          <Section title="8. Your rights">
            <p>
              Depending on your jurisdiction, you may have rights to access, correct, or delete personal data we hold
              about you. To exercise any of these rights, contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </Section>

          <Section title="9. California privacy rights (CCPA / CPRA)">
            <p>
              If you are a California resident, you have additional rights under the California Consumer Privacy Act
              (CCPA) and the California Privacy Rights Act (CPRA):
            </p>
            <ul>
              <li>
                <strong>Right to know:</strong> you may request details about what personal information we have
                collected and how it is used, as described in Sections 2–4 above.
              </li>
              <li>
                <strong>Right to delete:</strong> you may request deletion of personal information we hold about you,
                subject to certain legal exceptions.
              </li>
              <li>
                <strong>Right to opt out of sale or sharing:</strong> we do not sell your personal information. We do
                not share your personal information for cross-context behavioural advertising.
              </li>
              <li>
                <strong>Right to non-discrimination:</strong> we will not discriminate against you for exercising any
                of your privacy rights.
              </li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will respond within 45 days of receiving
              a verifiable request. In the preceding 12 months, we have collected the categories of personal
              information described in Section 2 above.
            </p>
          </Section>

          <Section title="10. Data breach notification">
            <p>
              In the event of a confirmed data breach affecting your personal information, we will notify affected
              customers within 72 hours of confirmation, consistent with GDPR Article 33 and applicable US state
              breach notification laws. Notification will be sent via the email address associated with your account
              or submission.
            </p>
          </Section>

          <Section title="11. Data portability and export">
            <p>
              You may request a copy of your personal data in a structured, commonly used, machine-readable format.
              Enterprise customers can request bulk data exports through their account manager. All other requests
              should be directed to{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
            <p>
              We will fulfil export requests within 30 days. For more information about what data is available for
              export, see our <a href="/data-practices/">Data Practices FAQ</a>.
            </p>
          </Section>

          <Section title="12. Cookies and similar technologies">
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

          <Section title="13. Security">
            <p>
              We take reasonable technical measures to protect information transmitted to us, including HTTPS
              encryption and access controls scoped to organisational membership. No transmission method is 100%
              secure; we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="14. Changes to this policy">
            <p>
              We may update this policy from time to time. Material changes will be reflected in an updated effective
              date at the top of this page.
            </p>
          </Section>

          <Section title="15. Contact">
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
