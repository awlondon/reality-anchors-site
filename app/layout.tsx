import type { Metadata } from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import ProgressBar from '@/components/ProgressBar';
import AnalyticsProvider from '@/components/AnalyticsProvider';
import ExperimentProvider from '@/components/ExperimentProvider';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import { HOME_EXPERIMENT } from '@/lib/experiments/config';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Reality Anchors | Fabrication Capture & Execution Validation Software',
    template: '%s | Reality Anchors',
  },
  description:
    'Deterministic capture and execution validation software for fabrication teams. Start with one camera, bring your own compatible hardware, add LiDAR only when precision depth matters, and build traceable learning loops from bench to fleet.',
  metadataBase: new URL('https://realityanchorsltd.com'),
  openGraph: {
    siteName: 'Reality Anchors',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/assets/brand/reality-anchors-lockup-dark.png',
        width: 1200,
        height: 630,
        alt: 'Reality Anchors - Fabrication Capture Software',
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
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <head>
        <link rel="icon" href="/assets/brand/favicon-dark.png" />
        <link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2e7deb" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        {process.env.NEXT_PUBLIC_GSC_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GSC_VERIFICATION} />
        )}
        <link rel="dns-prefetch" href="https://api.emailjs.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'analytics_storage':'denied','ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied'});`,
          }}
        />
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`} />
        )}
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA4_ID}');${process.env.NEXT_PUBLIC_GADS_ID ? `gtag('config','${process.env.NEXT_PUBLIC_GADS_ID}');` : ''}`,
            }}
          />
        )}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
            }}
          />
        )}
      </head>
      <body className="overflow-x-hidden">
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
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
        <CookieConsentBanner />
      </body>
    </html>
  );
}
