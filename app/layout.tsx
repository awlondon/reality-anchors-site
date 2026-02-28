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
  openGraph: {
    siteName: 'Reality Anchors Limited',
    type: 'website',
    locale: 'en_AU',
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
