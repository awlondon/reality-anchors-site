import { useEffect, useState } from 'react';
import { getAvailablePlans, createStripeCheckoutSession } from '../lib/callable';
import { Button, Card, PageHeader, Spinner, Badge } from '../components/ui';
import type { Plan, DeviceSelection } from '../types';

interface DeviceAddOnInfo {
  deviceId: 'context_camera' | 'lidar_device';
  name: string;
  monthlyUsd: number;
}

function formatNumber(n: number): string {
  return n.toLocaleString();
}

export default function Onboarding() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [deviceAddOns, setDeviceAddOns] = useState<DeviceAddOnInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [benchCount, setBenchCount] = useState(1);
  const [devices, setDevices] = useState<Record<string, number>>({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getAvailablePlans({})
      .then((result) => {
        setPlans(result.plans as Plan[]);
        const rec = result.plans.find((p) => p.recommended);
        if (rec) setSelectedPlan(rec.id);
        if (result.deviceAddOns) {
          setDeviceAddOns(result.deviceAddOns as DeviceAddOnInfo[]);
        }
      })
      .catch(() => setError('Failed to load plans'))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckout = async () => {
    if (!selectedPlan) return;
    setError('');
    setCheckoutLoading(true);

    const deviceSelections: DeviceSelection[] = Object.entries(devices)
      .filter(([, qty]) => qty > 0)
      .map(([deviceId, quantity]) => ({
        deviceId: deviceId as DeviceSelection['deviceId'],
        quantity,
      }));

    try {
      const { url } = await createStripeCheckoutSession({
        planId: selectedPlan,
        licensedBenches: benchCount,
        devices: deviceSelections.length > 0 ? deviceSelections : undefined,
      });
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
      setCheckoutLoading(false);
    }
  };

  const selected = plans.find((p) => p.id === selectedPlan);
  const benchTotal = selected ? selected.pricePerBench * benchCount : 0;
  const deviceTotal = deviceAddOns.reduce(
    (sum, d) => sum + (devices[d.deviceId] ?? 0) * d.monthlyUsd,
    0,
  );
  const monthlyTotal = benchTotal + deviceTotal;

  if (loading) {
    return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;
  }

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Production System Licensing"
        description="Select your tier, benches, and optional devices to get started"
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
              ${formatNumber(plan.pricePerBench)}
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
        <div className="space-y-4">
          {/* Bench count + device add-ons */}
          <Card>
            <div className="space-y-6">
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <label className="text-sm text-muted block mb-1" htmlFor="benchCount">
                    Number of benches
                  </label>
                  <input
                    id="benchCount"
                    type="number"
                    min="1"
                    max="100"
                    value={benchCount}
                    onChange={(e) => setBenchCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-20 bg-bg-2 border border-line rounded-lg px-3 py-2 text-txt text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <p className="text-sm text-muted">Bench subtotal</p>
                  <p className="text-lg font-semibold text-txt">
                    ${formatNumber(benchTotal)}
                    <span className="text-sm text-muted font-normal">/mo</span>
                  </p>
                </div>
              </div>

              {/* Device add-ons */}
              {deviceAddOns.length > 0 && (
                <div>
                  <p className="text-sm text-muted mb-3">Optional device add-ons</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {deviceAddOns.map((addon) => (
                      <div
                        key={addon.deviceId}
                        className={`rounded-lg border p-4 transition-all ${
                          (devices[addon.deviceId] ?? 0) > 0
                            ? 'border-accent/50 bg-accent/5'
                            : 'border-line bg-bg-2'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-txt text-sm font-medium">{addon.name}</span>
                          <span className="text-muted text-sm">${addon.monthlyUsd}/device/mo</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="text-xs text-muted" htmlFor={`device-${addon.deviceId}`}>
                            Qty
                          </label>
                          <input
                            id={`device-${addon.deviceId}`}
                            type="number"
                            min="0"
                            max="50"
                            value={devices[addon.deviceId] ?? 0}
                            onChange={(e) =>
                              setDevices((prev) => ({
                                ...prev,
                                [addon.deviceId]: Math.max(0, parseInt(e.target.value, 10) || 0),
                              }))
                            }
                            className="w-16 bg-bg border border-line rounded-lg px-2 py-1 text-txt text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                          {(devices[addon.deviceId] ?? 0) > 0 && (
                            <span className="text-accent-2 text-sm ml-auto">
                              +${formatNumber((devices[addon.deviceId] ?? 0) * addon.monthlyUsd)}/mo
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Total + checkout */}
          <Card>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-muted">Monthly total</p>
                  <p className="text-2xl font-semibold text-txt">
                    ${formatNumber(monthlyTotal)}
                    <span className="text-sm text-muted font-normal">/mo</span>
                  </p>
                </div>
                {deviceTotal > 0 && (
                  <div>
                    <p className="text-xs text-muted">
                      ${formatNumber(benchTotal)} benches + ${formatNumber(deviceTotal)} devices
                    </p>
                  </div>
                )}
              </div>
              <Button onClick={handleCheckout} loading={checkoutLoading}>
                Continue to Checkout
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
