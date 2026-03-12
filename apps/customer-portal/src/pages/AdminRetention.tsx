import { Link } from 'react-router-dom';
import { useOrgHealthList } from '../lib/hooks';
import { PageHeader, Spinner, Badge } from '../components/ui';
import { format, differenceInDays } from 'date-fns';

function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  if (v && typeof v === 'object' && 'toDate' in v) return (v as { toDate: () => Date }).toDate();
  return new Date(v as string);
}

function riskColor(score: number): 'green' | 'yellow' | 'red' {
  if (score >= 70) return 'red';
  if (score >= 40) return 'yellow';
  return 'green';
}

function paymentColor(status: string): 'green' | 'yellow' | 'red' | 'gray' {
  if (status === 'current') return 'green';
  if (status === 'past_due') return 'yellow';
  if (status === 'canceled') return 'red';
  return 'gray';
}

function isChurnRisk(org: {
  churnRiskScore: number;
  lastActive: unknown;
  paymentStatus: string;
  activeSeats: number;
  licensedSeats: number;
}): boolean {
  const daysSinceActive = differenceInDays(new Date(), toDate(org.lastActive));
  const seatUtilization = org.licensedSeats > 0 ? org.activeSeats / org.licensedSeats : 0;
  return (
    org.churnRiskScore >= 70 ||
    daysSinceActive > 14 ||
    org.paymentStatus === 'past_due' ||
    org.paymentStatus === 'canceled' ||
    seatUtilization < 0.5
  );
}

export default function AdminRetention() {
  const { data: orgs, loading } = useOrgHealthList();

  if (loading) {
    return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;
  }

  const sorted = [...orgs].sort((a, b) => b.churnRiskScore - a.churnRiskScore);

  return (
    <>
      <PageHeader
        title="Customer Retention"
        description={`${orgs.filter(isChurnRisk).length} of ${orgs.length} customers flagged for churn risk`}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="pb-3 text-muted font-medium">Organization</th>
              <th className="pb-3 text-muted font-medium">Churn Risk</th>
              <th className="pb-3 text-muted font-medium">Last Active</th>
              <th className="pb-3 text-muted font-medium">Bends (30d)</th>
              <th className="pb-3 text-muted font-medium">Benches</th>
              <th className="pb-3 text-muted font-medium">Payment</th>
              <th className="pb-3 text-muted font-medium">Adoption</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((org) => {
              const risk = isChurnRisk(org);
              const daysSince = differenceInDays(new Date(), toDate(org.lastActive));
              return (
                <tr
                  key={org.orgId}
                  className={`border-b border-line/50 hover:bg-card/50 transition-colors ${
                    risk ? 'bg-danger/5' : ''
                  }`}
                >
                  <td className="py-3">
                    <Link
                      to={`/admin/org/${org.orgId}`}
                      className="text-accent-2 hover:underline font-medium"
                    >
                      {org.orgName}
                    </Link>
                  </td>
                  <td className="py-3">
                    <Badge color={riskColor(org.churnRiskScore)}>
                      {org.churnRiskScore}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <span className={daysSince > 14 ? 'text-danger' : 'text-txt'}>
                      {format(toDate(org.lastActive), 'MMM d')}
                      <span className="text-muted ml-1">({daysSince}d ago)</span>
                    </span>
                  </td>
                  <td className="py-3 text-txt">{org.totalBends30d.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={
                      org.licensedSeats > 0 && (org.activeSeats / org.licensedSeats) < 0.5
                        ? 'text-warning' : 'text-txt'
                    }>
                      {org.activeSeats} / {org.licensedSeats}
                    </span>
                  </td>
                  <td className="py-3">
                    <Badge color={paymentColor(org.paymentStatus)}>
                      {org.paymentStatus}
                    </Badge>
                  </td>
                  <td className="py-3 text-txt">{org.featureAdoption}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sorted.length === 0 && (
        <p className="text-muted text-center py-8">No organization health data available yet.</p>
      )}
    </>
  );
}
