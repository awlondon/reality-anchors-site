import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Button, Input } from '../components/ui';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-txt">Reset Password</h1>
          <p className="text-muted mt-1">We'll send you a reset link</p>
        </div>

        <div className="bg-card border border-line rounded-xl p-6">
          {sent ? (
            <div className="text-center">
              <p className="text-success mb-4">Check your email for a reset link.</p>
              <Link to="/login" className="text-accent-2 hover:underline text-sm">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm text-muted mb-1">Email</label>
                <Input
                  id="email"
                  type="email"
                  required
                  className="w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                />
              </div>

              {error && (
                <p className="text-danger text-sm" role="alert">{error}</p>
              )}

              <Button type="submit" className="w-full" loading={loading}>
                Send Reset Link
              </Button>

              <p className="text-center text-sm text-muted">
                <Link to="/login" className="text-accent-2 hover:underline">
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
