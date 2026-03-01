import ExecutiveDashboard from '@/components/ExecutiveDashboard';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function ExecutivePage() {
  return (
    <ErrorBoundary section="executive-dashboard">
      <ExecutiveDashboard />
    </ErrorBoundary>
  );
}
