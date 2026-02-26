import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import ProgressBar from '@/components/ProgressBar';

export const metadata: Metadata = {
  title: {
    default: 'Reality Anchors Limited | Structural Governance Platform',
    template: '%s | Reality Anchors',
  },
  description:
    'Reality Anchors delivers deterministic AI-governed optimization for fabrication, field, and operations teams — measurable scrap reduction, traceable workflows, field-ready deployment.',
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
      </head>
      <body>
        <ProgressBar />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
