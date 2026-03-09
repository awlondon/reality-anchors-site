import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContract } from '../lib/hooks';
import { signContract } from '../lib/callable';
import { Card, PageHeader, Spinner, StatusBadge, Button } from '../components/ui';
import { format } from 'date-fns';

function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  if (v && typeof v === 'object' && 'toDate' in v) return (v as { toDate: () => Date }).toDate();
  return new Date(v as string);
}

export default function ContractDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: contract, loading } = useContract(id);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState('');

  const handleSign = async () => {
    if (!id) return;
    setError('');
    setSigning(true);
    try {
      await signContract({ contractId: id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign contract');
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;
  }

  if (!contract) {
    return (
      <div className="text-center py-12">
        <p className="text-muted text-lg">Contract not found</p>
        <Link to="/contracts" className="text-accent-2 hover:underline text-sm mt-2 inline-block">
          Back to contracts
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={contract.title}
        action={
          <Link to="/contracts" className="text-accent-2 hover:underline text-sm">
            ← Back to contracts
          </Link>
        }
      />

      <Card className="mb-6">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <dt className="text-muted">Status</dt>
            <dd className="mt-1"><StatusBadge status={contract.status} /></dd>
          </div>
          <div>
            <dt className="text-muted">Created</dt>
            <dd className="text-txt font-medium mt-1">{format(toDate(contract.createdAt), 'MMM d, yyyy')}</dd>
          </div>
          {contract.expiresAt && (
            <div>
              <dt className="text-muted">Expires</dt>
              <dd className="text-txt font-medium mt-1">{format(toDate(contract.expiresAt), 'MMM d, yyyy')}</dd>
            </div>
          )}
          {contract.signedAt && (
            <div>
              <dt className="text-muted">Signed</dt>
              <dd className="text-txt font-medium mt-1">
                {format(toDate(contract.signedAt), 'MMM d, yyyy')}
                {contract.signedBy && <span className="text-muted"> by {contract.signedBy}</span>}
              </dd>
            </div>
          )}
        </dl>
      </Card>

      {contract.terms && (
        <Card className="mb-6">
          <h3 className="text-sm font-medium text-muted mb-3">Terms</h3>
          <div className="prose prose-invert prose-sm max-w-none text-muted whitespace-pre-wrap">
            {contract.terms}
          </div>
        </Card>
      )}

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      {contract.status === 'pending' && (
        <Button onClick={handleSign} loading={signing}>
          Sign Contract
        </Button>
      )}

      {contract.documentUrl && (
        <a
          href={contract.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4"
        >
          <Button variant="secondary">Download Document</Button>
        </a>
      )}
    </>
  );
}
