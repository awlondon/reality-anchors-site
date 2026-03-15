import { useState } from 'react';
import { useBenches, useSubscriptions } from '../lib/hooks';
import NotesPanel from '../components/NotesPanel';
import { assignBench, releaseBench, updateBenchCount } from '../lib/callable';
import {
  Card,
  PageHeader,
  Spinner,
  Button,
  StatusBadge,
  EmptyState,
  Input,
} from '../components/ui';

export default function Seats() {
  const { data: benches, loading } = useBenches();
  const { data: subs } = useSubscriptions();
  const activeSub = subs.find((s) => s.status === 'active' || s.status === 'trialing');
  const licensedCount = activeSub?.licensedBenches ?? 0;

  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [assignEmail, setAssignEmail] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [buyCount, setBuyCount] = useState('');

  const handleAssign = async (benchId: string) => {
    if (!assignEmail.trim()) return;
    setError('');
    setActionLoading(benchId);
    try {
      await assignBench({ benchId, email: assignEmail.trim() });
      setAssignModal(null);
      setAssignEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign bench');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRelease = async (benchId: string) => {
    setError('');
    setActionLoading(benchId);
    try {
      await releaseBench({ benchId });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to release bench');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBuyBenches = async () => {
    const count = parseInt(buyCount, 10);
    if (!count || count <= 0) return;
    setError('');
    setActionLoading('buy');
    try {
      const result = await updateBenchCount({ newCount: licensedCount + count });
      if (result.url) {
        window.location.href = result.url;
      }
      setBuyCount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bench count');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;
  }

  const activeCount = benches.filter((b) => b.status === 'active').length;
  const availableCount = benches.filter((b) => b.status === 'available').length;

  return (
    <>
      <PageHeader
        title="Bench Management"
        description={`${activeCount} active / ${availableCount} available / ${licensedCount} licensed`}
        action={
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              placeholder="Qty"
              className="w-20"
              value={buyCount}
              onChange={(e) => setBuyCount(e.target.value)}
            />
            <Button
              variant="secondary"
              onClick={handleBuyBenches}
              loading={actionLoading === 'buy'}
              disabled={!buyCount}
            >
              Add Benches
            </Button>
          </div>
        }
      />

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      {benches.length === 0 ? (
        <EmptyState title="No benches configured" description="Benches are provisioned when your subscription is created." />
      ) : (
        <div className="space-y-3">
          {benches.map((bench) => (
            <Card key={bench.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-txt font-medium">
                    {bench.benchId ? `Bench ${bench.id.slice(0, 6)}` : bench.id.slice(0, 8)}
                  </p>
                  {bench.assignedEmail && (
                    <p className="text-muted text-sm">{bench.assignedEmail}</p>
                  )}
                </div>
                <StatusBadge status={bench.status} />
              </div>

              <div className="flex items-center gap-2">
                {bench.status === 'available' && (
                  <>
                    {assignModal === bench.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="email"
                          placeholder="operator@company.com"
                          className="w-56"
                          value={assignEmail}
                          onChange={(e) => setAssignEmail(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAssign(bench.id)}
                        />
                        <Button
                          onClick={() => handleAssign(bench.id)}
                          loading={actionLoading === bench.id}
                          disabled={!assignEmail.trim()}
                        >
                          Assign
                        </Button>
                        <Button variant="ghost" onClick={() => { setAssignModal(null); setAssignEmail(''); }}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button variant="secondary" onClick={() => setAssignModal(bench.id)}>
                        Assign
                      </Button>
                    )}
                  </>
                )}
                {bench.status === 'active' && (
                  <Button
                    variant="danger"
                    onClick={() => handleRelease(bench.id)}
                    loading={actionLoading === bench.id}
                  >
                    Release
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <NotesPanel context="benches" title="Bench Notes" />
    </>
  );
}
