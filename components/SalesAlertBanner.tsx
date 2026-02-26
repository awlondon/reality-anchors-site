'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { SalesAlert } from '@/lib/salesNotifications';

type Props = {
  alerts: SalesAlert[];
  onDismiss: (id: string) => void;
};

export default function SalesAlertBanner({ alerts, onDismiss }: Props) {
  return (
    <div className="fixed left-1/2 top-4 z-50 w-full max-w-2xl -translate-x-1/2 px-4">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-3 rounded-xl border border-green-400/40 bg-green-900/30 px-5 py-4 shadow-xl backdrop-blur"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">
                  {alert.type === 'form_submit' ? 'New Lead Submitted' : 'High-Intent Session'}
                </div>
                <div className="mt-1 text-xs text-white/70">
                  Session: {alert.sessionId.slice(0, 8)}
                  {alert.probability ? ` • ${(alert.probability * 100).toFixed(0)}% likelihood` : ''}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onDismiss(alert.id)}
                  className="rounded border border-white/30 px-3 py-1 text-xs"
                >
                  Dismiss
                </button>
                <button
                  className="rounded bg-white/10 px-3 py-1 text-xs"
                  onClick={() => {
                    window.location.href = `/executive?session=${alert.sessionId}`;
                  }}
                >
                  View
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
