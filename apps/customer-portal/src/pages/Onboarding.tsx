import { useEffect, useState } from 'react';
import { getAvailablePlans, createStripeCheckoutSession } from '../lib/callable';
import { Button, Card, PageHeader, Spinner, Badge } from '../components/ui';
import type { Plan } from '../types';

function formatNumber(n: number): string {
  return n.toLocaleString();
}

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

  const selected = plans.find((p) => p.id === selectedPlan);
  const monthlyTotal = selected ? selected.pricePerSeat * seatCount : 0;

  if (loading) {
    return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;
  }

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Production System Licensing"
        description="Select your tier and number of benches to get started"
      />

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      <div className="grid md:grid-cols-3 gap-4 mb-8">
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
              ${formatNumber(plan.pricePerSeat)}
              <span className="text-sm text-muted font-normal"> / bench / mo</span>
            </p>

            <div className="mt-3 space-y-1 text-sm">
              <p className="text-accent-2">
                {formatNumber(plan.includedActions)} actions included
              </p>
              <p className="text-muted">
                ${plan.overagePerAction}/action overage
              </p>
            </div>

            <ul className="mt-4 space-y-1 border-t border-line pt-3">
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

      {selectedPlan && selected && (
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div>
                <label className="text-sm text-muted block mb-1" htmlFor="seatCount">
                  Number of benches
                </label>
                <input
                  id="seatCount"
                  type="number"
                  min="1"
                  max="100"
                  value={seatCount}
                  onChange={(e) => setSeatCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-20 bg-bg-2 border border-line rounded-lg px-3 py-2 text-txt text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <p className="text-sm text-muted">Monthly total</p>
                <p className="text-xl font-semibold text-txt">
                  ${formatNumber(monthlyTotal)}
                  <span className="text-sm text-muted font-normal">/mo</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">Included actions</p>
                <p className="text-xl font-semibold text-txt">
                  {formatNumber(selected.includedActions * seatCount)}
                  <span className="text-sm text-muted font-normal">/mo</span>
                </p>
              </div>
            </div>
            <Button onClick={handleCheckout} loading={checkoutLoading}>
              Continue to Checkout
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
