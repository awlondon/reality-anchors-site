import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import FeatureMatrix from '@/components/FeatureMatrix';

describe('FeatureMatrix', () => {
  afterEach(cleanup);

  it('renders all three tier column headers', () => {
    render(<FeatureMatrix />);
    expect(screen.getByText('Pilot')).toBeInTheDocument();
    expect(screen.getByText('Production')).toBeInTheDocument();
    expect(screen.getAllByText('Enterprise').length).toBeGreaterThanOrEqual(1);
  });

  it('renders category headers', () => {
    render(<FeatureMatrix />);
    expect(screen.getByText('Core')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
    // 'Enterprise' appears as both a column header and a category header
    expect(screen.getAllByText('Enterprise').length).toBe(2);
  });

  it('renders feature names', () => {
    render(<FeatureMatrix />);
    expect(screen.getByText('AR Execution Guidance')).toBeInTheDocument();
    expect(screen.getByText('Analytics & QA')).toBeInTheDocument();
    expect(screen.getByText('ERP Integration')).toBeInTheDocument();
  });

  it('renders checkmarks and dashes', () => {
    const { container } = render(<FeatureMatrix />);
    const checks = container.querySelectorAll('[aria-label="Included"]');
    const dashes = container.querySelectorAll('[aria-label="Not included"]');
    expect(checks.length).toBeGreaterThan(0);
    expect(dashes.length).toBeGreaterThan(0);
  });
});
