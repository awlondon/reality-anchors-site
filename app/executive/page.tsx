import type { Metadata } from 'next';
import ExecutiveDashboard from '@/components/ExecutiveDashboard';
import ErrorBoundary from '@/components/ErrorBoundary';
import AccessGate from './AccessGate';

export const metadata: Metadata = {
  title: 'Executive Dashboard',
  robots: { index: false, follow: false },
};

export default function ExecutivePage() {
  return (
    <AccessGate>
      <ErrorBoundary section="executive-dashboard">
        <ExecutiveDashboard />
      </ErrorBoundary>
    </AccessGate>
  );
}
