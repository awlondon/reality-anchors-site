import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center px-6">
        <p className="text-6xl font-bold text-accent font-mono mb-4">404</p>
        <h1 className="text-2xl font-semibold text-txt mb-3">Page not found</h1>
        <p className="text-muted mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all"
          >
            Back to home
          </Link>
          <Link
            href="/commercial/#contact"
            className="px-5 py-2.5 rounded-lg border border-line hover:border-accent/40 text-txt text-sm font-semibold transition-all"
          >
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
