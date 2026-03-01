import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import ProgressBar from '@/components/ProgressBar';
import AnalyticsProvider from '@/components/AnalyticsProvider';
import ExperimentProvider from '@/components/ExperimentProvider';
import { HOME_EXPERIMENT } from '@/lib/experiments/config';

export const metadata: Metadata = {
  title: {
    default: 'Reality Anchors Limited | Operational Validation Platform',
    template: '%s | Reality Anchors',
  },
  description:
    'Reality Anchors delivers AI-assisted operational validation for fabrication, field, and operations teams — measurable scrap reduction, traceable workflows, and field-ready deployment.',
  metadataBase: new URL('https://ra.primarydesignco.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    siteName: 'Reality Anchors Limited',
    type: 'website',
    locale: 'en_AU',
    images: [
      {
        url: '/assets/brand/reality-anchors-lockup-dark.png',
        width: 1200,
        height: 630,
        alt: 'Reality Anchors Limited — Operational Validation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/brand/reality-anchors-lockup-dark.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/brand/favicon-dark.png" />
        <link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png" />
        {/* Security headers (meta-tag equivalents for static hosting) */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        {/* Prefetch hints for external APIs */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.emailjs.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <ExperimentProvider config={HOME_EXPERIMENT}>
          <AnalyticsProvider />
        <ProgressBar />
        <Navbar />
          {children}
        </ExperimentProvider>
      </body>
    </html>
  );
}
