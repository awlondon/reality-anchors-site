import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';

// Mock Firebase before importing component
vi.mock('@/lib/firebaseClient', () => ({
  db: null,
  isFirebaseConfigured: false,
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: 'test-doc' }),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}));

import AccessGate from '@/app/executive/AccessGate';

describe('AccessGate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders access code form when not authorized', () => {
    render(<AccessGate>Secret Content</AccessGate>);
    expect(screen.getByLabelText('Executive dashboard access code')).toBeInTheDocument();
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  it('renders children when correct code is entered', async () => {
    render(<AccessGate>Secret Content</AccessGate>);
    const input = screen.getByLabelText('Executive dashboard access code');
    fireEvent.change(input, { target: { value: 'ra2026' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Secret Content')).toBeInTheDocument();
    });
  });

  it('shows error on invalid code', async () => {
    render(<AccessGate>Secret Content</AccessGate>);
    const input = screen.getByLabelText('Executive dashboard access code');
    fireEvent.change(input, { target: { value: 'wrong' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Invalid access code')).toBeInTheDocument();
    });
  });

  it('locks out after 3 failed attempts', async () => {
    render(<AccessGate>Secret Content</AccessGate>);
    const input = screen.getByLabelText('Executive dashboard access code');
    const form = input.closest('form')!;

    for (let i = 0; i < 3; i++) {
      fireEvent.change(input, { target: { value: 'wrong' } });
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText(/Too many failed attempts/)).toBeInTheDocument();
    });

    // Verify submit button is disabled during lockout
    const button = screen.getByRole('button', { name: /continue/i });
    expect(button).toBeDisabled();
  });

  it('restores authorized state from sessionStorage', async () => {
    sessionStorage.setItem('ra_exec_access', 'ra2026');
    render(<AccessGate>Secret Content</AccessGate>);

    await waitFor(() => {
      expect(screen.getByText('Secret Content')).toBeInTheDocument();
    });
  });
});
