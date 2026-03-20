import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import ProofStrip from '@/components/ProofStrip';
import VideoShowcasePlatform from '@/components/VideoShowcasePlatform';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Metrics from '@/components/Metrics';
import ValueBridge from '@/components/ValueBridge';
import CaptureLoop from '@/components/CaptureLoop';
import Tiers from '@/components/Tiers';
import FeatureMatrix from '@/components/FeatureMatrix';
import LeadForm from '@/components/LeadForm';
import StickyCTA from '@/components/StickyCTA';
import Footer from '@/components/Footer';
import PhotoDivider from '@/components/PhotoDivider';
import FAQ from '@/components/FAQ';
import { faqStructuredData } from '@/data/faq';
import { getDividersForPage } from '@/data/photoDividers';

export const metadata: Metadata = {
  title: 'Fabrication Capture Software for Rebar and Industrial Workcells',
  description:
    'Reality Anchors is fabrication capture software for calibrated validation in rebar and industrial workcells. Start with one camera, use your own hardware, and add LiDAR only when precision depth matters.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Reality Anchors | Fabrication Capture Software',
    description:
      'Calibrated capture and execution validation for fabrication teams using mixed camera fleets and customer-supplied hardware.',
  },
};

export default async function Home() {
  const dividers = getDividersForPage('home');

  return (
    <main id="main-content" className="snap-y">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Reality Anchors',
            url: 'https://realityanchorsltd.com',
            description:
              'Calibrated capture and execution validation for steel fabrication. Mixed camera fleets, customer-supplied hardware, and measurable results that improve with every run.',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData()),
        }}
      />
      <Hero />
      <ProofStrip />
      <VideoShowcasePlatform />
      {dividers[0] && <PhotoDivider {...dividers[0]} />}
      <HowItWorks />
      <Features />
      <ValueBridge />
      <Metrics />
      <CaptureLoop />
      <Tiers />
      <FeatureMatrix />
      <FAQ />
      <LeadForm />
      <StickyCTA />
      <Footer />
    </main>
  );
}
