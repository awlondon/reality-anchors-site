/**
 * Email delivery abstraction layer.
 *
 * Decouples UI components from specific email providers (EmailJS, etc.).
 * To swap email providers, modify this file only — no component changes needed.
 */

import { reportError, reportWarning } from '@/lib/errorReporting';
import { EMAIL_SEND_TIMEOUT_MS, EMAIL_MAX_RETRIES, EMAIL_RETRY_DELAY_MS } from '@/lib/constants';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '';
const CONFIRM_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_CONFIRM_TEMPLATE_ID ?? '';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '';

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendWithTimeout(
  serviceId: string,
  templateId: string,
  params: Record<string, string>,
  publicKey: string,
): Promise<void> {
  // Lazy-import EmailJS to keep it out of bundles for pages that don't use forms
  const { default: emailjs } = await import('@emailjs/browser');
  const send = emailjs.send(serviceId, templateId, params, publicKey);
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Email send timed out')), EMAIL_SEND_TIMEOUT_MS),
  );
  await Promise.race([send, timeout]);
}

async function sendWithRetry(
  serviceId: string,
  templateId: string,
  params: Record<string, string>,
  publicKey: string,
  context: string,
): Promise<void> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= EMAIL_MAX_RETRIES; attempt++) {
    try {
      await sendWithTimeout(serviceId, templateId, params, publicKey);
      return;
    } catch (err) {
      lastError = err;
      reportWarning(`Email attempt ${attempt + 1}/${EMAIL_MAX_RETRIES + 1} failed`, {
        component: 'api/email',
        action: context,
        attempt,
      });
      if (attempt < EMAIL_MAX_RETRIES) {
        await wait(EMAIL_RETRY_DELAY_MS * (attempt + 1));
      }
    }
  }
  reportError(lastError, { component: 'api/email', action: context, totalAttempts: EMAIL_MAX_RETRIES + 1 });
  throw lastError;
}

/** Check if email sending is configured */
export function isEmailConfigured(): boolean {
  return !!(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}

/** Send a lead notification email to the team */
export async function sendNotification(params: Record<string, string>): Promise<void> {
  if (!isEmailConfigured()) return;
  await sendWithRetry(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY, 'lead_notification');
}

/** Send a confirmation email to the lead */
export async function sendConfirmation(params: Record<string, string>): Promise<void> {
  if (!SERVICE_ID || !CONFIRM_TEMPLATE_ID || !PUBLIC_KEY) return;
  await sendWithRetry(SERVICE_ID, CONFIRM_TEMPLATE_ID, params, PUBLIC_KEY, 'lead_confirmation');
}
