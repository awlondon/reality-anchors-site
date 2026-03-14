import { useSubscriptions } from '../lib/hooks';
import NotesPanel from '../components/NotesPanel';
import {
  Card,
  PageHeader,
  Spinner,
  StatusBadge,
  EmptyState,
} from '../components/ui';
import { format } from 'date-fns';

function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  if (v && typeof v === 'object' && 'toDate' in v) return (v as { toDate: () => Date }).toDate();
  return new Date(v as string);
}

export default function Subscription() {
  const { data: subs, loading } = useSubscriptions();

  if (loading) {
    return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;
  }

  return (
    <>
      <PageHeader title="Subscription" description="Your current plan and subscription details" />

      {subs.length === 0 ? (
        <EmptyState title="No active subscription" description="Visit the onboarding page to choose a plan." />
      ) : (
        <div className="space-y-4">
          {subs.map((sub) => (
            <Card key={sub.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-txt">{sub.planName}</h3>
                    <StatusBadge status={sub.status} />
                  </div>
                  <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div>
                      <dt className="text-muted">Licensed Benches</dt>
                      <dd className="text-txt font-medium">{sub.licensedBenches}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">Current Period</dt>
                      <dd className="text-txt font-medium">
                        {format(toDate(sub.currentPeriodStart), 'MMM d')} – {format(toDate(sub.currentPeriodEnd), 'MMM d, yyyy')}
                      </dd>
                    </div>
                    {sub.cancelAtPeriodEnd && (
                      <div className="col-span-2">
                        <p className="text-warning text-sm">Cancels at end of period</p>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <NotesPanel context="subscription" title="Subscription Notes" />
    </>
  );
}
