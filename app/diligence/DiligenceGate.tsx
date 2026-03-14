'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function DiligenceGate() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      // Dynamically import to avoid bundling Firebase in the initial load
      const { saveLead } = await import('@/lib/saveLead');
      const { getSessionId } = await import('@/lib/session');

      await saveLead({
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        role: 'Diligence Request',
        message: 'Requested full diligence package download.',
        sessionId: getSessionId() ?? '',
        regimeId: null,
      });

      trackEvent('diligence_download_request', { email: email.trim() });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/15 mb-4">
          <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-txt mb-2">Package requested</h3>
        <p className="text-muted mb-6 max-w-md mx-auto">
          A member of our team will follow up with the full diligence package at{' '}
          <span className="text-txt font-medium">{email}</span>.
        </p>
        <p className="text-sm text-muted/60">
          Typical response time: 1 business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <label htmlFor="diligence-name" className="block text-sm text-muted mb-1">
          Full name
        </label>
        <input
          id="diligence-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-bg border border-line text-txt placeholder:text-muted/40 focus:border-accent focus:outline-none transition-colors"
          placeholder="Jane Smith"
        />
      </div>
      <div>
        <label htmlFor="diligence-email" className="block text-sm text-muted mb-1">
          Work email
        </label>
        <input
          id="diligence-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-bg border border-line text-txt placeholder:text-muted/40 focus:border-accent focus:outline-none transition-colors"
          placeholder="jane@company.com"
        />
      </div>
      <div>
        <label htmlFor="diligence-company" className="block text-sm text-muted mb-1">
          Company
        </label>
        <input
          id="diligence-company"
          type="text"
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-bg border border-line text-txt placeholder:text-muted/40 focus:border-accent focus:outline-none transition-colors"
          placeholder="Acme Capital"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-7 py-4 rounded-lg bg-accent hover:bg-blue-500 text-white font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? 'Submitting\u2026' : 'Request Full Package'}
      </button>

      <p className="text-xs text-muted/50 text-center">
        We will not share your information. See our{' '}
        <a href="/privacy/" className="underline hover:text-muted">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
