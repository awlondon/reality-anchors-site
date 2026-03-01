import emailjs from '@emailjs/browser';
import type { CalculatorContext } from '@/lib/calculatorContext';
import { reportError } from '@/lib/errorReporting';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '';
const CONFIRM_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_CONFIRM_TEMPLATE_ID ?? '';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '';

const SEND_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1_500;

if (typeof window !== 'undefined' && (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY)) {
  console.warn('[EmailJS] Missing env vars — email notifications will be skipped');
}

interface LeadEmailPayload {
  name: string;
  email: string;
  company: string;
  role: string;
  message?: string;
  sessionId?: string;
  regimeId?: string | null;
  source?: string;
  submittedAt?: string;
  calculatorContext?: CalculatorContext | null;
}

function fmtUSD(value?: number): string {
  if (value == null || !Number.isFinite(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendWithTimeout(
  serviceId: string,
  templateId: string,
  params: Record<string, string>,
  publicKey: string,
): Promise<void> {
  const send = emailjs.send(serviceId, templateId, params, publicKey);
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Email send timed out')), SEND_TIMEOUT_MS),
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
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      await sendWithTimeout(serviceId, templateId, params, publicKey);
      return;
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * (attempt + 1);
        await wait(delay);
      }
    }
  }
  reportError(lastError, { component: 'sendLeadEmail', action: context });
  throw lastError;
}

export async function sendLeadEmail(payload: LeadEmailPayload): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) return;

  const ctx = payload.calculatorContext;
  const now = new Date();

  const templateParams: Record<string, string> = {
    name: payload.name || 'N/A',
    email: payload.email || 'N/A',
    company: payload.company || 'N/A',
    role: payload.role || 'N/A',
    message: payload.message?.trim() || 'N/A',
    sessionId: payload.sessionId || 'N/A',
    regimeId: payload.regimeId || 'N/A',
    source: payload.source || 'request_contact_form',
    submittedAt: payload.submittedAt || now.toISOString(),
    time: now.toLocaleString(),
    calcAnnualTons: ctx?.annualTons != null ? `${ctx.annualTons.toLocaleString()} t` : 'N/A',
    calcScrapRate: ctx?.scrapRatePct != null ? `${ctx.scrapRatePct.toFixed(1)}%` : 'N/A',
    calcCostPerTon: fmtUSD(ctx?.costPerTon),
    calcMaterialSavings: fmtUSD(ctx?.materialDollarsSaved ?? ctx?.estimatedMaterialSavings),
    calcLaborSavings: fmtUSD(ctx?.laborDollarsSaved),
    calcThroughput: fmtUSD(ctx?.throughputContribution),
    calcOversightRisk: fmtUSD(ctx?.oversightRiskSaved),
    calcEbitda: fmtUSD(ctx?.estimatedEbitda),
    hasCalculator: ctx ? 'yes' : '',
  };

  await sendWithRetry(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY, 'lead_email');
}

interface ConfirmationPayload {
  email: string;
  name: string;
  company: string;
  params: Record<string, string>;
}

export async function sendConfirmationEmail(payload: ConfirmationPayload): Promise<void> {
  if (!SERVICE_ID || !CONFIRM_TEMPLATE_ID || !PUBLIC_KEY) return;

  const templateParams: Record<string, string> = {
    email: payload.email,
    name: payload.name,
    company: payload.company,
    ...payload.params,
  };

  await sendWithRetry(SERVICE_ID, CONFIRM_TEMPLATE_ID, templateParams, PUBLIC_KEY, 'confirmation_email');
}
