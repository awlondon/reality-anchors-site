import { useParams, Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  useOrgDetails,
  useOrgUsageDaily,
  useOrgBenches,
  useOrgSubscriptions,
  useOrgContracts,
} from '../lib/hooks';
import {
  Card,
  PageHeader,
  Spinner,
  StatusBadge,
  KpiCard,
} from '../components/ui';
import { format } from 'date-fns';

function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  if (v && typeof v === 'object' && 'toDate' in v) return (v as { toDate: () => Date }).toDate();
  return new Date(v as string);
}

export default function AdminOrgDetail() {
  const { orgId } = useParams<{ orgId: string }>();
  const { org, loading: orgLoading } = useOrgDetails(orgId);
  const { data: usage, loading: usageLoading } = useOrgUsageDaily(orgId, 30);
  const { data: benches } = useOrgBenches(orgId);
  const { data: subs } = useOrgSubscriptions(orgId);
  const { data: contracts } = useOrgContracts(orgId);

  if (orgLoading || usageLoading) {
    return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;
  }

  const chartData = [...usage].reverse().map((d) => ({
    date: d.date?.slice(5),
    bends: d.totalBends,
    activeBenches: d.activeBenches,
  }));

  const totalBends = usage.reduce((s, d) => s + (d.totalBends ?? 0), 0);
  const totalAccurate = usage.reduce((s, d) => s + (d.accurateBends ?? 0), 0);
  const accuracy = totalBends > 0 ? ((totalAccurate / totalBends) * 100).toFixed(1) : '0';
  const activeBenchCount = benches.filter((b) => b.status === 'active').length;
  const activeSub = subs.find((s) => s.status === 'active' || s.status === 'trialing');

  // Operational alerts
  const alerts: string[] = [];
  if (activeSub?.status === 'past_due') alerts.push('Payment is past due');
  if (activeSub?.cancelAtPeriodEnd) alerts.push('Subscription set to cancel at period end');
  const licensedBenchCount = activeSub?.licensedBenches ?? 0;
  if (licensedBenchCount > 0 && activeBenchCount / licensedBenchCount < 0.5) {
    alerts.push(`Low bench utilization: ${activeBenchCount}/${licensedBenchCount} benches active`);
  }
  const pendingContracts = contracts.filter((c) => c.status === 'pending');
  if (pendingContracts.length > 0) alerts.push(`${pendingContracts.length} contract(s) pending signature`);

  return (
    <>
      <PageHeader
        title={org?.name ?? orgId ?? 'Organization'}
        action={
          <Link to="/admin" className="text-accent-2 hover:underline text-sm">
            ← Back to retention
          </Link>
        }
      />

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((alert, i) => (
            <div key={i} className="bg-warning/10 border border-warning/30 rounded-lg px-4 py-3 text-warning text-sm">
              {alert}
            </div>
          ))}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Total Bends (30d)" value={totalBends.toLocaleString()} />
        <KpiCard label="Accuracy" value={accuracy} unit="%" />
        <KpiCard label="Active Benches" value={`${activeBenchCount} / ${licensedBenchCount}`} />
        <KpiCard
          label="Subscription"
          value={activeSub?.status ?? 'None'}
        />
      </div>

      {/* Usage chart */}
      {chartData.length > 0 && (
        <Card className="mb-6">
          <h3 className="text-sm font-medium text-muted mb-4">Daily Bends (30d)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
              <XAxis dataKey="date" stroke="#8aa8c8" fontSize={12} />
              <YAxis stroke="#8aa8c8" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#111d2c', border: '1px solid #1e3048', borderRadius: 8 }}
                labelStyle={{ color: '#e4edf8' }}
              />
              <Area type="monotone" dataKey="bends" stroke="#2e7deb" fill="#2e7deb" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Benches */}
        <Card>
          <h3 className="text-sm font-medium text-muted mb-4">Benches ({benches.length})</h3>
          {benches.length === 0 ? (
            <p className="text-muted/60 text-sm">No benches configured</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {benches.map((bench) => (
                <div key={bench.id} className="flex items-center justify-between text-sm py-1.5 border-b border-line/30 last:border-0">
                  <div>
                    <span className="text-txt">Bench {bench.id.slice(0, 6)}</span>
                    {bench.assignedEmail && (
                      <span className="text-muted ml-2">{bench.assignedEmail}</span>
                    )}
                  </div>
                  <StatusBadge status={bench.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Subscriptions */}
        <Card>
          <h3 className="text-sm font-medium text-muted mb-4">Subscriptions</h3>
          {subs.length === 0 ? (
            <p className="text-muted/60 text-sm">No subscriptions</p>
          ) : (
            <div className="space-y-3">
              {subs.map((sub) => (
                <div key={sub.id} className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-txt font-medium">{sub.planName}</span>
                    <StatusBadge status={sub.status} />
                  </div>
                  <p className="text-muted">
                    {sub.licensedBenches} benches · {format(toDate(sub.currentPeriodStart), 'MMM d')} – {format(toDate(sub.currentPeriodEnd), 'MMM d, yyyy')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Contracts */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-medium text-muted mb-4">Contract History</h3>
          {contracts.length === 0 ? (
            <p className="text-muted/60 text-sm">No contracts</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="pb-2 text-muted font-medium">Title</th>
                  <th className="pb-2 text-muted font-medium">Status</th>
                  <th className="pb-2 text-muted font-medium">Created</th>
                  <th className="pb-2 text-muted font-medium">Signed</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c) => (
                  <tr key={c.id} className="border-b border-line/30">
                    <td className="py-2 text-txt">{c.title}</td>
                    <td className="py-2"><StatusBadge status={c.status} /></td>
                    <td className="py-2 text-muted">{format(toDate(c.createdAt), 'MMM d, yyyy')}</td>
                    <td className="py-2 text-muted">
                      {c.signedAt ? format(toDate(c.signedAt), 'MMM d, yyyy') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </>
  );
}
