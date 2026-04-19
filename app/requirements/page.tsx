import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'System Requirements | Reality Anchors',
  description:
    'Everything your IT team needs to evaluate Reality Anchors. Browser requirements, mobile capture app specs, network infrastructure, and security architecture.',
  alternates: { canonical: '/requirements/' },
  openGraph: {
    title: 'System Requirements | Reality Anchors',
    description:
      'Browser, mobile, network, and security requirements for deploying Reality Anchors in your fabrication environment.',
  },
};

const BROWSER_REQS = [
  { label: 'Browser', detail: 'Chrome 90+, Edge 90+, Firefox 90+, Safari 15+' },
  { label: 'Connection', detail: 'Stable internet connection (WebSocket support required)' },
  { label: 'Installation', detail: 'None — SaaS delivery' },
];

const MOBILE_REQS = [
  { label: 'OS', detail: 'Android 10 (API level 29) or later' },
  { label: 'Camera', detail: 'Rear-facing camera, 12 MP or higher recommended' },
  { label: 'Depth sensor', detail: 'Optional — enables enhanced capture capabilities' },
  { label: 'Connectivity', detail: 'Wi-Fi or cellular data (for cloud upload)' },
  { label: 'Storage', detail: 'Minimum 2 GB free for local capture buffer' },
];

const NETWORK_REQS = [
  { label: 'Outbound access', detail: 'HTTPS (port 443) to Reality Anchors cloud services' },
  { label: 'On-premise server', detail: 'Not required — fully cloud-hosted' },
  { label: 'Data residency', detail: 'United States (Google Cloud)' },
];

const SECURITY_POINTS = [
  {
    title: 'Role-based access control',
    description: 'Operators, managers, and admins see only what their role permits.',
  },
  {
    title: 'Encryption',
    description: 'Data encrypted in transit (TLS 1.2+) and at rest (AES-256).',
  },
  {
    title: 'Audit logging',
    description: 'Access and configuration changes are logged.',
  },
  {
    title: 'Authentication',
    description: 'Cloud-based identity management; SSO available on Production and Enterprise plans.',
  },
];

function ReqTable({ rows }: { rows: { label: string; detail: string }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line/50 last:border-0">
              <td className="py-3 pr-4 font-medium text-txt whitespace-nowrap w-40">{row.label}</td>
              <td className="py-3 text-muted">{row.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RequirementsPage() {
  return (
    <main id="main-content">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-14 border-b border-line">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3">
            Technical Requirements
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-txt mb-5 leading-tight">
            System Requirements
          </h1>
          <p className="text-xl text-muted max-w-2xl leading-relaxed">
            Everything your IT team needs to evaluate Reality Anchors.
          </p>
        </div>
      </section>

      {/* Web Dashboard */}
      <section className="py-14 border-b border-line">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-txt mb-2">Web Dashboard</h2>
            <p className="text-sm text-muted mb-6">
              Access the Reality Anchors dashboard from any modern browser — no installation required.
            </p>
            <ReqTable rows={BROWSER_REQS} />
          </div>
        </div>
      </section>

      {/* Mobile Capture App */}
      <section className="py-14 border-b border-line">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-txt">Mobile Capture App</h2>
              <span className="px-2 py-0.5 text-xs font-bold tracking-wider uppercase bg-accent/15 text-accent-2 rounded-full border border-accent/30">
                Beta
              </span>
            </div>
            <p className="text-sm text-muted mb-6">
              The Reality Anchors mobile app captures structured bend data from the shop floor.
              Currently available on Android.
            </p>
            <ReqTable rows={MOBILE_REQS} />
            <div className="mt-6 p-4 rounded-xl bg-bg-2/60 border border-line/50">
              <p className="text-sm text-muted">
                <span className="font-medium text-txt">iOS:</span>{' '}
                Not yet available. iOS is on our roadmap —{' '}
                <Link href="/commercial/#contact" className="text-accent-2 hover:underline">
                  contact us
                </Link>{' '}
                for timeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Network & Infrastructure */}
      <section className="py-14 border-b border-line">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-txt mb-2">Network &amp; Infrastructure</h2>
            <p className="text-sm text-muted mb-6">
              Reality Anchors is fully cloud-hosted. No on-premise hardware or VPN required.
            </p>
            <ReqTable rows={NETWORK_REQS} />
          </div>
        </div>
      </section>

      {/* Security Architecture */}
      <section className="py-14 border-b border-line">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-line bg-card rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-txt mb-4">Security Architecture</h2>
            <p className="text-sm text-muted mb-6">
              Reality Anchors is built on an enterprise security architecture.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {SECURITY_POINTS.map((point) => (
                <div key={point.title} className="p-4 rounded-xl bg-bg-2/60 border border-line/50">
                  <h3 className="text-sm font-semibold text-txt mb-1">{point.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{point.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-line/50">
              <p className="text-sm text-muted">
                Need a detailed security overview for your IT/Security evaluation?{' '}
                <Link href="/commercial/#contact" className="text-accent-2 hover:underline">
                  Request our Deployment &amp; Security Guide
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Device Compatibility CTA */}
      <section className="py-14 border-b border-line">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold text-txt mb-3">Have a specific device to validate?</h2>
          <p className="text-muted mb-6 max-w-lg mx-auto">
            Our team can advise on compatibility for your device fleet before you commit.
          </p>
          <Link
            href="/commercial/#contact"
            className="inline-block px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
