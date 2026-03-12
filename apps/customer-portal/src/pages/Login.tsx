import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Button, Input } from '../components/ui';

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign in failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-txt">Reality Anchors</h1>
          <p className="text-muted mt-1">Sign in to your account</p>
        </div>

        <div className="bg-card border border-line rounded-xl p-6">
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
            <div>
              <label htmlFor="password" className="block text-sm text-muted mb-1">Password</label>
              <Input
                id="password"
                type="password"
                required
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            {error && (
              <p className="text-danger text-sm" role="alert">{error}</p>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted">or</span>
            </div>
          </div>

          <Button variant="secondary" className="w-full" onClick={handleGoogle}>
            Continue with Google
          </Button>

          <div className="mt-4 text-center text-sm text-muted space-y-1">
            <p>
              <Link to="/forgot-password" className="text-accent-2 hover:underline">
                Forgot password?
              </Link>
            </p>
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent-2 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
