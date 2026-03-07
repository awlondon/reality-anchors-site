import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import LeadForm from '@/components/LeadForm';

// Mock external services
vi.mock('@/lib/sendLeadEmail', () => ({
  sendLeadEmail: vi.fn().mockResolvedValue(undefined),
  sendConfirmationEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/saveLead', () => ({
  saveLead: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/funnelContext', () => ({
  getLastRegime: vi.fn().mockReturnValue(null),
}));

vi.mock('@/lib/session', () => ({
  getSessionId: vi.fn().mockReturnValue('test-session-id'),
}));

vi.mock('@/lib/salesNotifications', () => ({
  upsertSalesAlert: vi.fn(),
}));

vi.mock('@/lib/calculatorContext', () => ({
  getCalculatorContext: vi.fn().mockReturnValue(null),
}));

vi.mock('@/lib/buildConfirmationHtml', () => ({
  buildConfirmationParams: vi.fn().mockReturnValue({}),
}));

describe('LeadForm', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders step 1 with email field and continue button', () => {
    const { container } = render(<LeadForm />);

    expect(container.querySelector('input[placeholder="jane@company.com"]')).toBeInTheDocument();
    expect(container.querySelector('button[type="submit"]')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
    // Step 2 fields should not be visible yet
    expect(container.querySelector('input[placeholder="Jane Smith"]')).not.toBeInTheDocument();
  });

  it('shows email validation error when submitting empty form', async () => {
    const { container } = render(<LeadForm />);

    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Valid work email required')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const { container } = render(<LeadForm />);

    const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Valid work email required')).toBeInTheDocument();
    });
  });

  it('advances to step 2 after valid email', async () => {
    const { container } = render(<LeadForm />);

    const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(container.querySelector('input[placeholder="Jane Smith"]')).toBeInTheDocument();
      expect(container.querySelector('input[placeholder="Acme Fabrication"]')).toBeInTheDocument();
      expect(screen.getByText('Request Contact')).toBeInTheDocument();
    });
  });

  it('submits successfully with valid data', async () => {
    const { sendLeadEmail } = await import('@/lib/sendLeadEmail');

    const { container } = render(<LeadForm />);

    // Step 1: enter email and continue
    const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(container.querySelector('button[type="submit"]') as HTMLButtonElement);

    // Step 2: fill details and submit
    await waitFor(() => {
      expect(container.querySelector('input[placeholder="Jane Smith"]')).toBeInTheDocument();
    });

    const nameInput = container.querySelector('input[placeholder="Jane Smith"]') as HTMLInputElement;
    const companyInput = container.querySelector('input[placeholder="Acme Fabrication"]') as HTMLInputElement;
    const roleSelect = container.querySelector('select') as HTMLSelectElement;

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(companyInput, { target: { value: 'Test Corp' } });
    fireEvent.change(roleSelect, { target: { value: 'Operations' } });

    const form = container.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(sendLeadEmail).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Request received')).toBeInTheDocument();
    });
  });

  it('renders custom heading and description', () => {
    render(<LeadForm heading="Custom Title" description="Custom desc" />);

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom desc')).toBeInTheDocument();
  });

  it('honeypot field is hidden from users', () => {
    render(<LeadForm />);

    const honeypot = document.querySelector('input[name="website"]') as HTMLInputElement;
    expect(honeypot).toBeTruthy();
    expect(honeypot.tabIndex).toBe(-1);
    expect(honeypot.getAttribute('aria-hidden')).toBe('true');
  });
});
