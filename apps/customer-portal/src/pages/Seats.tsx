import { useState } from 'react';
import { useSeats, useSubscriptions } from '../lib/hooks';
import NotesPanel from '../components/NotesPanel';
import { assignSeat, releaseSeat, updateSeatCount } from '../lib/callable';
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
  const { data: seats, loading } = useSeats();
  const { data: subs } = useSubscriptions();
  const activeSub = subs.find((s) => s.status === 'active' || s.status === 'trialing');
  const licensedCount = activeSub?.licensedBenches ?? 0;

  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [assignEmail, setAssignEmail] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [buyCount, setBuyCount] = useState('');

  const handleAssign = async (seatId: string) => {
    if (!assignEmail.trim()) return;
    setError('');
    setActionLoading(seatId);
    try {
      await assignSeat({ seatId, email: assignEmail.trim() });
      setAssignModal(null);
      setAssignEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign bench');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRelease = async (seatId: string) => {
    setError('');
    setActionLoading(seatId);
    try {
      await releaseSeat({ seatId });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to release bench');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBuySeats = async () => {
    const count = parseInt(buyCount, 10);
    if (!count || count <= 0) return;
    setError('');
    setActionLoading('buy');
    try {
      const result = await updateSeatCount({ newCount: licensedCount + count });
      if (result.url) {
        window.location.href = result.url; // Redirect to Stripe if payment needed
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

  const activeCount = seats.filter((s) => s.status === 'active').length;
  const availableCount = seats.filter((s) => s.status === 'available').length;

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
              onClick={handleBuySeats}
              loading={actionLoading === 'buy'}
              disabled={!buyCount}
            >
              Add Benches
            </Button>
          </div>
        }
      />

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      {seats.length === 0 ? (
        <EmptyState title="No benches configured" description="Benches are provisioned when your subscription is created." />
      ) : (
        <div className="space-y-3">
          {seats.map((seat) => (
            <Card key={seat.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-txt font-medium">
                    {seat.seatId ? `Bench ${seat.id.slice(0, 6)}` : seat.id.slice(0, 8)}
                  </p>
                  {seat.assignedEmail && (
                    <p className="text-muted text-sm">{seat.assignedEmail}</p>
                  )}
                </div>
                <StatusBadge status={seat.status} />
              </div>

              <div className="flex items-center gap-2">
                {seat.status === 'available' && (
                  <>
                    {assignModal === seat.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="email"
                          placeholder="operator@company.com"
                          className="w-56"
                          value={assignEmail}
                          onChange={(e) => setAssignEmail(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAssign(seat.id)}
                        />
                        <Button
                          onClick={() => handleAssign(seat.id)}
                          loading={actionLoading === seat.id}
                          disabled={!assignEmail.trim()}
                        >
                          Assign
                        </Button>
                        <Button variant="ghost" onClick={() => { setAssignModal(null); setAssignEmail(''); }}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button variant="secondary" onClick={() => setAssignModal(seat.id)}>
                        Assign
                      </Button>
                    )}
                  </>
                )}
                {seat.status === 'active' && (
                  <Button
                    variant="danger"
                    onClick={() => handleRelease(seat.id)}
                    loading={actionLoading === seat.id}
                  >
                    Release
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <NotesPanel context="seats" title="Bench Notes" />
    </>
  );
}
