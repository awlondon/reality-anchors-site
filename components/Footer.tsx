import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image src="/assets/brand/svg/logo-ra-speed-square-dark.svg" alt="Reality Anchors" width={36} height={36} className="h-9 w-auto" />
          <div>
            <div className="text-sm font-semibold text-txt">Reality Anchors</div>
            <div className="text-xs text-muted">Measured. Anchored. Deterministic.</div>
          </div>
        </div>

        <nav className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-6 gap-y-2 text-sm text-muted w-full md:w-auto" aria-label="Footer navigation">
          <Link href="/personal/" className="hover:text-txt transition-colors py-1 sm:py-0">Personal</Link>
          <Link href="/commercial/" className="hover:text-txt transition-colors py-1 sm:py-0">Commercial</Link>
          <Link href="/industrial/" className="hover:text-txt transition-colors py-1 sm:py-0">Industrial</Link>
          <Link href="/calculator/" className="hover:text-txt transition-colors py-1 sm:py-0">Estimator</Link>
          <Link href="/margin-impact/" className="hover:text-txt transition-colors py-1 sm:py-0">Margin Model</Link>
          <Link href="/pricing-methodology/" className="hover:text-txt transition-colors py-1 sm:py-0">Methodology</Link>
          <Link href="/board-strategy/" className="hover:text-txt transition-colors py-1 sm:py-0">Strategy</Link>
          <Link href="/commercial/#contact" className="hover:text-txt transition-colors py-1 sm:py-0">Contact</Link>
          <Link href="/privacy/" className="hover:text-txt transition-colors py-1 sm:py-0">Privacy</Link>
          <Link href="/terms/" className="hover:text-txt transition-colors py-1 sm:py-0">Terms</Link>
        </nav>

        <div className="text-xs text-muted/80">
          © {new Date().getFullYear()} Reality Anchors LLC
        </div>
      </div>
    </footer>
  );
}
