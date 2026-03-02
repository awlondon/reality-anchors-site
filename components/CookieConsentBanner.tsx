'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

const STORAGE_KEY = 'cookie_consent';
type ConsentChoice = 'granted' | 'denied';

function getStoredConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === 'granted' || v === 'denied') return v;
  return null;
}

function updateConsent(choice: ConsentChoice) {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as Record<string, unknown>).gtag;
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      analytics_storage: choice,
      ad_storage: choice,
      ad_user_data: choice,
      ad_personalization: choice,
    });
  }
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      updateConsent(stored);
    } else {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: ConsentChoice) => {
    localStorage.setItem(STORAGE_KEY, choice);
    updateConsent(choice);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Cookie consent"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-card/95 backdrop-blur-sm"
        >
          <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-sm text-muted flex-1">
              We use cookies for analytics and advertising measurement.{' '}
              <Link href="/privacy/" className="text-accent underline underline-offset-2">
                Privacy&nbsp;Policy
              </Link>
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => handleChoice('denied')}
                className="px-4 py-2 text-sm rounded-lg border border-line text-muted hover:text-txt hover:border-muted transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => handleChoice('granted')}
                className="px-4 py-2 text-sm rounded-lg bg-accent text-white font-medium hover:bg-blue-500 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
