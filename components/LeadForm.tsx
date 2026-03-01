'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import { fadeUp } from '@/lib/motion';
import { getLastRegime } from '@/lib/funnelContext';
import { getSessionId } from '@/lib/session';
import { upsertSalesAlert } from '@/lib/salesNotifications';
import { saveLead } from '@/lib/saveLead';
import { getCalculatorContext } from '@/lib/calculatorContext';
import { sendLeadEmail, sendConfirmationEmail } from '@/lib/sendLeadEmail';
import { buildConfirmationParams } from '@/lib/buildConfirmationHtml';

interface FormData {
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
  /** Honeypot — hidden from real users, left empty; bots that auto-fill forms populate this */
  _hp: string;
}

const ROLES = ['Operations', 'Engineering', 'IT / Security', 'Executive', 'Other'];

interface LeadFormProps {
  id?: string;
  heading?: string;
  description?: string;
}

export default function LeadForm({ id = 'contact', heading, description }: LeadFormProps) {
  const [data, setData] = useState<FormData>({ name: '', email: '', company: '', role: '', message: '', _hp: '' });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('analytics', {
        detail: {
          type: 'lead_form_view',
          stage: 'lead_form_view',
        },
      })
    );
  }, []);

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!data.name.trim()) e.name = 'Required';
    if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid work email required';
    if (!data.company.trim()) e.company = 'Required';
    if (!data.role) e.role = 'Required';
    return e;
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    const honeypot = form.elements.namedItem('website') as HTMLInputElement;
    if (honeypot?.value) return; // Bot detected, silently ignore
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSubmitError(null);
    setLoading(true);
    const attributedRegime = getLastRegime();
    const sessionId = getSessionId() ?? 'unknown';

    try {
      // Send email notification (primary — this is what notifies the team)
      await sendLeadEmail({
        ...data,
        sessionId,
        regimeId: attributedRegime,
        source: 'request_contact_form',
        submittedAt: new Date().toISOString(),
        calculatorContext: getCalculatorContext(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Email send failed:', err);
      setSubmitError('Something went wrong while submitting your request. Please try again.');
    } finally {
      setLoading(false);
    }

    // Best-effort side effects — wrapped so unhandled throws can't crash the component
    // Capture form values for side effects (closure safety)
    const formName = data.name;
    const formEmail = data.email;
    const formCompany = data.company;
    const formRole = data.role;
    const formMessage = data.message;
    try {
      // Send confirmation email to submitter (best-effort)
      const calcCtx = getCalculatorContext();
      const confirmParams = buildConfirmationParams(calcCtx, formName);
      console.log('[LeadForm] Confirmation params:', JSON.stringify(confirmParams));
      sendConfirmationEmail({
        email: formEmail,
        name: formName,
        company: formCompany,
        params: { ...confirmParams },
      }).catch((err) => console.warn('Confirmation email failed (non-critical):', err));

      // Persist to Firebase (best-effort backup)
      saveLead({
        name: formName,
        email: formEmail,
        company: formCompany,
        role: formRole,
        message: formMessage,
        sessionId,
        regimeId: attributedRegime,
      }).catch((err) => console.warn('Firebase save failed (non-critical):', err));

      window.dispatchEvent(
        new CustomEvent('analytics', {
          detail: {
            type: 'lead_form_submit',
            stage: 'lead_form_submit',
            regimeId: attributedRegime ?? undefined,
            role: formRole,
          },
        })
      );

      const alert = {
        id: `${sessionId}_form_submit`,
        type: 'form_submit' as const,
        sessionId,
        createdAt: Date.now(),
      };
      upsertSalesAlert(alert);
      window.dispatchEvent(new CustomEvent('analytics', { detail: { ...alert, type: 'sales_notification', notificationType: alert.type } }));

      trackEvent('lead_submitted', { role: formRole, regimeId: attributedRegime ?? 'unknown' });
    } catch (sideEffectErr) {
      // Non-critical side effects — log but don't block form completion
      console.warn('Post-submit side effects failed (non-critical):', sideEffectErr);
    }
  };

  const field = (
    key: keyof FormData,
    label: string,
    type = 'text',
    placeholder = '',
  ) => (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted uppercase tracking-wide">{label}</span>
      <input
        type={type}
        value={data[key]}
        onChange={(e) => setData((d) => ({ ...d, [key]: e.target.value }))}
        placeholder={placeholder}
        className={`ra-input ${errors[key] ? 'border-red-500/60' : ''}`}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
      />
      {errors[key] && (
        <span id={`${key}-error`} className="text-xs text-red-400">{errors[key]}</span>
      )}
    </label>
  );

  return (
    <section id={id} className="relative overflow-hidden py-24 bg-bg border-t border-line">
      {/* Background photograph — team collaboration */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/team-collaboration.jpg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.08] mix-blend-luminosity pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/70 to-bg/90 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Copy */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-4">Get in Touch</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-txt mb-5 leading-tight">
              {heading || 'Request a scoped consultation'}
            </h2>
            <p className="text-muted leading-relaxed mb-8">
              {description || 'Complete the form and we\'ll return with a fit assessment, suggested rollout scope, and a timeline for value realization.'}
            </p>
            <ul className="flex flex-col gap-3">
              {[
                'Role-specific solution mapping for operations, engineering, and procurement.',
                'Estimated savings ranges by segment and material throughput.',
                'Optional technical deep-dive with architecture and governance review.',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted">
                  <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="border border-line bg-card rounded-2xl p-7"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                    <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-txt mb-2">Request received</h3>
                  <p className="text-muted text-sm">We&apos;ll follow up with a fit assessment and suggested scope.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                  noValidate
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    {field('name', 'Full name', 'text', 'Jane Smith')}
                    {field('email', 'Work email', 'email', 'jane@company.com')}
                  </div>
                  {field('company', 'Company', 'text', 'Acme Fabrication')}

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-muted uppercase tracking-wide">Role</span>
                    <select
                      value={data.role}
                      onChange={(e) => setData((d) => ({ ...d, role: e.target.value }))}
                      className={`ra-input ${errors.role ? 'border-red-500/60' : ''}`}
                      aria-invalid={!!errors.role}
                      aria-describedby={errors.role ? 'role-error' : undefined}
                    >
                      <option value="">Select…</option>
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {errors.role && <span id="role-error" className="text-xs text-red-400">{errors.role}</span>}
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-muted uppercase tracking-wide">Message (optional)</span>
                    <textarea
                      value={data.message}
                      onChange={(e) => setData((d) => ({ ...d, message: e.target.value }))}
                      placeholder="Describe your workflow challenge, throughput, or goals…"
                      rows={4}
                      maxLength={2000}
                      className="ra-input resize-none"
                    />
                  </label>

                  {/* Honeypot field — hidden from humans, traps bots */}
                  <input
                    type="text"
                    name="website"
                    autoComplete="off"
                    className="absolute opacity-0 h-0 w-0 overflow-hidden"
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  {submitError && (
                    <p className="text-sm text-amber-300" role="status">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    aria-label={loading ? 'Sending your request…' : 'Submit contact request'}
                    className="w-full py-3.5 rounded-lg bg-accent hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition-all hover:-translate-y-px mt-1"
                  >
                    {loading ? 'Sending…' : 'Request Contact'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
