'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';
import { trackEvent, trackGadsConversion } from '@/lib/analytics';
import { sendLeadEmail } from '@/lib/sendLeadEmail';
import { getCalculatorContext } from '@/lib/calculatorContext';
import { getSessionId } from '@/lib/session';
import { getLastRegime } from '@/lib/funnelContext';
import { markFormLoaded, runSpamChecks, recordSubmission } from '@/lib/spamGuard';
import { verifyTurnstileToken } from '@/lib/turnstile';

export default function InlineCapture() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formLoadedAt = useRef(markFormLoaded());
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  useEffect(() => {
    trackEvent('inline_capture_view');
  }, []);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey || !turnstileRef.current) return;
    if (!window.turnstile) return;
    const widgetId = window.turnstile.render(turnstileRef.current, {
      sitekey: siteKey,
      callback: (token: string) => setTurnstileToken(token),
      'error-callback': () => setTurnstileToken(null),
      'expired-callback': () => setTurnstileToken(null),
      theme: 'dark',
      size: 'flexible',
    });
    return () => { window.turnstile?.reset(widgetId); };
  }, []);

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    const honeypot = form.elements.namedItem('website') as HTMLInputElement;
    if (honeypot?.value) return;

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Valid work email required');
      return;
    }

    // Spam guard — disposable email, timing, rate limit
    const spam = runSpamChecks(email, formLoadedAt.current);
    if (spam.blocked) { setError(spam.reason); return; }

    // Turnstile verification
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      if (!turnstileToken) {
        setError('Please complete the verification challenge.');
        return;
      }
      const isHuman = await verifyTurnstileToken(turnstileToken);
      if (!isHuman) {
        setError('Verification failed. Please refresh and try again.');
        return;
      }
    }

    setError(null);
    setLoading(true);
    try {
      await sendLeadEmail({
        name: '',
        email,
        company: '',
        role: '',
        message: 'Inline capture \u2014 mid-page email submission',
        sessionId: getSessionId() ?? 'unknown',
        regimeId: getLastRegime(),
        source: 'inline_capture_mid_page',
        submittedAt: new Date().toISOString(),
        calculatorContext: getCalculatorContext(),
      });
      trackGadsConversion();
      setSubmitted(true);
      recordSubmission();
      trackEvent('inline_capture_submit');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 bg-bg">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={fadeUp}
        className="max-w-xl mx-auto px-6 text-center"
      >
        {submitted ? (
          <p className="text-sm text-muted">
            <span className="text-accent font-semibold">Got it.</span>{' '}
            We&apos;ll be in touch with your estimate.
          </p>
        ) : (
          <>
            <h2 className="text-xl md:text-2xl font-semibold text-txt mb-2">
              Want to see what this means for your operation?
            </h2>
            <p className="text-sm text-muted mb-6">
              Drop your work email. We&apos;ll send a scrap estimate&nbsp;&mdash; no pitch deck, no sales call unless you want one.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-start"
              noValidate
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={`ra-input flex-1 text-sm ${error ? 'border-red-500/60' : ''}`}
                aria-label="Work email"
                aria-invalid={!!error}
              />
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                autoComplete="off"
                className="absolute opacity-0 h-0 w-0 overflow-hidden"
                tabIndex={-1}
                aria-hidden="true"
              />
              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <div ref={turnstileRef} className="flex justify-center" />
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-lg bg-accent hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all hover:-translate-y-px whitespace-nowrap"
              >
                {loading ? 'Sending\u2026' : 'Get ROI Estimate'}
              </button>
            </form>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          </>
        )}
      </motion.div>
    </section>
  );
}
