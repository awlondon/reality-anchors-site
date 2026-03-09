import { useState } from 'react';
import { createCustomerPortalSession } from '../lib/callable';
import { Button, Card, PageHeader } from '../components/ui';

export default function Billing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleManageBilling = async () => {
    setError('');
    setLoading(true);
    try {
      const { url } = await createCustomerPortalSession({});
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open billing portal');
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Billing" description="Manage your payment method and view invoices" />

      <Card>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-txt mb-2">Stripe Billing Portal</h3>
            <p className="text-muted text-sm">
              Update your payment method, view past invoices, and manage your billing details through Stripe's secure portal.
            </p>
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}

          <Button onClick={handleManageBilling} loading={loading}>
            Manage Billing
          </Button>
        </div>
      </Card>
    </>
  );
}
