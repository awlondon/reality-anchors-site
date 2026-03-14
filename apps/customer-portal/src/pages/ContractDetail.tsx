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

  const displayTitle = contract.title || contract.contractId || contract.id;

  return (
    <>
      <PageHeader
        title={displayTitle}
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
                {contract.signatoryName && <span className="text-muted"> by {contract.signatoryName}</span>}
              </dd>
            </div>
          )}
        </dl>
      </Card>

      {contract.terms && (
        <Card className="mb-6">
          <h3 className="text-sm font-medium text-muted mb-3">Terms</h3>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(contract.terms).map(([key, value]) => (
              <div key={key}>
                <dt className="text-muted capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
                <dd className="text-txt font-medium">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </Card>
      )}

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      {(contract.status === 'pending' || contract.status === 'sent' || contract.status === 'draft') && (
        <Button onClick={handleSign} loading={signing}>
          Sign Contract
        </Button>
      )}

      {contract.pdfPath && (
        <p className="text-muted text-sm mt-4">
          PDF stored at: {contract.pdfPath}
          {contract.pdfSha256 && <span className="ml-2 font-mono text-xs">SHA256: {contract.pdfSha256.slice(0, 12)}...</span>}
        </p>
      )}
    </>
  );
}
