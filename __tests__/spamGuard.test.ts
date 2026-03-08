import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isDisposableEmail,
  markFormLoaded,
  isSubmittedTooFast,
  isRateLimited,
  recordSubmission,
  runSpamChecks,
} from '@/lib/spamGuard';

describe('spamGuard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ── Disposable email detection ──────────────────────────────────────
  describe('isDisposableEmail', () => {
    it('blocks known disposable domains', () => {
      expect(isDisposableEmail('bot@armyspy.com')).toBe(true);
      expect(isDisposableEmail('x@7novels.com')).toBe(true);
      expect(isDisposableEmail('y@cslua.com')).toBe(true);
      expect(isDisposableEmail('z@mailinator.com')).toBe(true);
      expect(isDisposableEmail('a@yopmail.com')).toBe(true);
      expect(isDisposableEmail('b@guerrillamail.com')).toBe(true);
    });

    it('allows legitimate domains', () => {
      expect(isDisposableEmail('jane@acme.com')).toBe(false);
      expect(isDisposableEmail('user@company.org')).toBe(false);
      expect(isDisposableEmail('ops@factory.io')).toBe(false);
      expect(isDisposableEmail('test@gmail.com')).toBe(false);
    });

    it('is case-insensitive on domain', () => {
      expect(isDisposableEmail('bot@ARMYSPY.COM')).toBe(true);
      expect(isDisposableEmail('bot@ArmySpy.Com')).toBe(true);
    });

    it('returns false for invalid email', () => {
      expect(isDisposableEmail('no-at-sign')).toBe(false);
      expect(isDisposableEmail('')).toBe(false);
    });
  });

  // ── Timing trap ─────────────────────────────────────────────────────
  describe('isSubmittedTooFast', () => {
    it('flags submission within 3 seconds', () => {
      const loadedAt = Date.now();
      expect(isSubmittedTooFast(loadedAt)).toBe(true);
    });

    it('allows submission after 3 seconds', () => {
      const loadedAt = Date.now() - 4_000;
      expect(isSubmittedTooFast(loadedAt)).toBe(false);
    });
  });

  describe('markFormLoaded', () => {
    it('returns a timestamp', () => {
      const t = markFormLoaded();
      expect(t).toBeGreaterThan(0);
      expect(t).toBeLessThanOrEqual(Date.now());
    });
  });

  // ── Rate limiting ───────────────────────────────────────────────────
  describe('rate limiting', () => {
    it('allows first submission', () => {
      expect(isRateLimited()).toBe(false);
    });

    it('allows up to 3 submissions', () => {
      recordSubmission();
      recordSubmission();
      recordSubmission();
      expect(isRateLimited()).toBe(true);
    });

    it('resets after the window expires', () => {
      // Seed localStorage with old timestamps (> 1 hour ago)
      const oldTimestamp = Date.now() - 2 * 60 * 60 * 1_000;
      localStorage.setItem(
        'ra_lead_submissions',
        JSON.stringify({ timestamps: [oldTimestamp, oldTimestamp, oldTimestamp] }),
      );
      expect(isRateLimited()).toBe(false);
    });
  });

  // ── Aggregate check ─────────────────────────────────────────────────
  describe('runSpamChecks', () => {
    it('returns blocked=false for clean submissions', () => {
      const loadedAt = Date.now() - 5_000; // 5 seconds ago
      const result = runSpamChecks('user@realcompany.com', loadedAt);
      expect(result.blocked).toBe(false);
      expect(result.reason).toBeNull();
    });

    it('blocks disposable emails', () => {
      const loadedAt = Date.now() - 5_000;
      const result = runSpamChecks('bot@armyspy.com', loadedAt);
      expect(result.blocked).toBe(true);
      expect(result.reason).toContain('work email');
    });

    it('blocks fast submissions', () => {
      const loadedAt = Date.now(); // just now
      const result = runSpamChecks('user@realcompany.com', loadedAt);
      expect(result.blocked).toBe(true);
      expect(result.reason).toContain('moment');
    });

    it('blocks rate-limited submissions', () => {
      recordSubmission();
      recordSubmission();
      recordSubmission();
      const loadedAt = Date.now() - 5_000;
      const result = runSpamChecks('user@realcompany.com', loadedAt);
      expect(result.blocked).toBe(true);
      expect(result.reason).toContain('Too many');
    });

    it('checks timing before email before rate limit', () => {
      // When all three fail, timing should be the reported reason
      recordSubmission();
      recordSubmission();
      recordSubmission();
      const loadedAt = Date.now();
      const result = runSpamChecks('bot@armyspy.com', loadedAt);
      expect(result.reason).toContain('moment'); // timing fires first
    });
  });
});
