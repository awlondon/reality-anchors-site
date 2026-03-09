import { Link } from 'react-router-dom';
import { useContracts } from '../lib/hooks';
import { Card, PageHeader, Spinner, StatusBadge, EmptyState } from '../components/ui';
import { format } from 'date-fns';

function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  if (v && typeof v === 'object' && 'toDate' in v) return (v as { toDate: () => Date }).toDate();
  return new Date(v as string);
}

export default function Contracts() {
  const { data: contracts, loading } = useContracts();

  if (loading) {
    return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;
  }

  return (
    <>
      <PageHeader title="Contracts" description="View and manage your service agreements" />

      {contracts.length === 0 ? (
        <EmptyState title="No contracts" description="Contracts will appear here when created." />
      ) : (
        <div className="space-y-3">
          {contracts.map((c) => (
            <Link key={c.id} to={`/contracts/${c.id}`}>
              <Card className="flex items-center justify-between hover:border-muted/40 transition-colors cursor-pointer">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-txt font-medium">{c.title || c.contractId || c.id}</p>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-muted text-sm">
                    Created {format(toDate(c.createdAt), 'MMM d, yyyy')}
                    {c.signatoryName && ` · Signed by ${c.signatoryName}`}
                  </p>
                </div>
                <span className="text-muted">→</span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
