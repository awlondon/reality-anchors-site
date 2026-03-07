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

          <nav className="grid grid-cols-2 sm:grid-cols-4 gap-8" aria-label="Footer navigation">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[10px] font-bold tracking-[2px] uppercase text-muted/60 mb-3">{col.title}</p>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-muted hover:text-txt transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-line/50 text-xs text-muted/80">
          © {new Date().getFullYear()} Reality Anchors LLC
        </div>
      </div>
    </footer>
  );
}
