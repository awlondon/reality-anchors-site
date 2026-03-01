import emailjs from '@emailjs/browser';
import type { CalculatorContext } from '@/lib/calculatorContext';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '';
const CONFIRM_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_CONFIRM_TEMPLATE_ID ?? '';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '';

const SEND_TIMEOUT_MS = 10_000;

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

export async function sendLeadEmail(payload: LeadEmailPayload): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS not configured — skipping email notification');
    return;
  }

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
    // Calculator context — pre-formatted for the template
    calcAnnualTons: ctx?.annualTons != null ? `${ctx.annualTons.toLocaleString()} t` : 'N/A',
    calcScrapRate: ctx?.scrapRatePct != null ? `${ctx.scrapRatePct.toFixed(1)}%` : 'N/A',
    calcCostPerTon: fmtUSD(ctx?.costPerTon),
    calcMaterialSavings: fmtUSD(ctx?.estimatedMaterialSavings),
    calcEbitda: fmtUSD(ctx?.estimatedEbitda),
    hasCalculator: ctx ? 'yes' : '',
  };

  const send = emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Email send timed out')), SEND_TIMEOUT_MS),
  );

  await Promise.race([send, timeout]);
}

interface ConfirmationPayload {
  email: string;
  name: string;
  company: string;
  params: Record<string, string>;
}

export async function sendConfirmationEmail(payload: ConfirmationPayload): Promise<void> {
  if (!SERVICE_ID || !CONFIRM_TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS confirmation template not configured — skipping');
    return;
  }

  const templateParams: Record<string, string> = {
    email: payload.email,
    name: payload.name,
    company: payload.company,
    ...payload.params,
  };

  const send = emailjs.send(SERVICE_ID, CONFIRM_TEMPLATE_ID, templateParams, PUBLIC_KEY);
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Confirmation email timed out')), SEND_TIMEOUT_MS),
  );

  await Promise.race([send, timeout]);
}
