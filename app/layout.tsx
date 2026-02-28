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
        url: '/assets/brand/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Reality Anchors Limited — Operational Validation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/brand/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/brand/favicon-dark.png" />
        <link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
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
