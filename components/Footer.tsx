import Link from 'next/link';
import Image from 'next/image';

const columns = [
  {
    title: 'Solutions',
    links: [
      { href: '/personal/', label: 'Personal' },
      { href: '/commercial/', label: 'Commercial' },
      { href: '/industrial/', label: 'Industrial' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { href: '/calculator/', label: 'ROI Estimate' },
      { href: '/margin-impact/', label: 'Margin Model' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/board-strategy/', label: 'Strategy' },
      { href: '/pricing-methodology/', label: 'Methodology' },
      { href: '/blog/', label: 'Blog' },
      { href: '/commercial/#contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy/', label: 'Privacy' },
      { href: '/terms/', label: 'Terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="flex items-center gap-3">
            <Image src="/assets/brand/svg/logo-ra-speed-square-dark.svg" alt="Reality Anchors" width={36} height={36} className="h-9 w-auto" />
            <div>
              <div className="text-sm font-semibold text-txt">Reality Anchors</div>
              <div className="text-xs text-muted">Measured. Anchored. Reliable.</div>
            </div>
          </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted" aria-label="Footer navigation">
          <Link href="/personal/" className="hover:text-txt transition-colors">Pilot</Link>
          <Link href="/commercial/" className="hover:text-txt transition-colors">Production</Link>
          <Link href="/industrial/" className="hover:text-txt transition-colors">Enterprise</Link>
          <Link href="/calculator/" className="hover:text-txt transition-colors">Estimator</Link>
          <Link href="/margin-impact/" className="hover:text-txt transition-colors">Margin Model</Link>
          <Link href="/pricing-methodology/" className="hover:text-txt transition-colors">Methodology</Link>
          <Link href="/board-strategy/" className="hover:text-txt transition-colors">Strategy</Link>
          <Link href="/commercial/#contact" className="hover:text-txt transition-colors">Contact</Link>
          <Link href="/privacy/" className="hover:text-txt transition-colors">Privacy</Link>
          <Link href="/terms/" className="hover:text-txt transition-colors">Terms</Link>
        </nav>

        <div className="mt-8 pt-6 border-t border-line/50 text-xs text-muted/80">
          © {new Date().getFullYear()} Reality Anchors LLC
        </div>
      </div>
    </footer>
  );
}
