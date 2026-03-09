import { useEffect, useState } from 'react';
import { getAvailablePlans, createStripeCheckoutSession } from '../lib/callable';
import { Button, Card, PageHeader, Spinner, Badge } from '../components/ui';
import type { Plan } from '../types';

export default function Onboarding() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [seatCount, setSeatCount] = useState(1);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getAvailablePlans({})
      .then((result) => {
        setPlans(result.plans as Plan[]);
        const rec = result.plans.find((p) => p.recommended);
        if (rec) setSelectedPlan(rec.id);
      })
      .catch(() => setError('Failed to load plans'))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckout = async () => {
    if (!selectedPlan) return;
    setError('');
    setCheckoutLoading(true);
    try {
      const { url } = await createStripeCheckoutSession({
        planId: selectedPlan,
        licensedBenches: seatCount,
      });
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;
  }

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <PageHeader
        title="Choose Your Plan"
        description="Select a plan and number of benches to get started"
      />

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {plans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setSelectedPlan(plan.id)}
            className={`text-left rounded-xl border p-6 transition-all ${
              selectedPlan === plan.id
                ? 'border-accent bg-accent/5 ring-2 ring-accent/30'
                : 'border-line bg-card hover:border-muted/40'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-medium text-txt">{plan.name}</h3>
              {plan.recommended && <Badge color="blue">Recommended</Badge>}
            </div>
            <p className="text-muted text-sm mb-4">{plan.description}</p>
            <p className="text-2xl font-semibold text-txt">
              ${plan.pricePerSeat}
              <span className="text-sm text-muted font-normal"> / seat / {plan.interval}</span>
            </p>
            <ul className="mt-4 space-y-1">
              {plan.features.map((f, i) => (
                <li key={i} className="text-sm text-muted flex items-start gap-2">
                  <span className="text-success mt-0.5">+</span>
                  {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      {selectedPlan && (
        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm text-muted" htmlFor="seatCount">Number of benches:</label>
            <input
              id="seatCount"
              type="number"
              min="1"
              max="100"
              value={seatCount}
              onChange={(e) => setSeatCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-20"
            />
          </div>
          <Button onClick={handleCheckout} loading={checkoutLoading}>
            Continue to Checkout
          </Button>
        </Card>
      )}
    </div>
  );
}
