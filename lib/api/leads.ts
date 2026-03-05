/**
 * Lead persistence abstraction layer.
 *
 * Decouples UI components from specific storage backends (Firebase, etc.).
 * To swap storage providers, modify this file only — no component changes needed.
 */

import { reportError, reportWarning } from '@/lib/errorReporting';
import { FIREBASE_SAVE_TIMEOUT_MS } from '@/lib/constants';

export interface LeadPayload {
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
  sessionId: string;
  regimeId: string | null;
}

/**
 * Persist a lead to the configured storage backend.
 * Currently uses Firebase Firestore. Throws on failure.
 */
export async function persistLead(payload: LeadPayload): Promise<void> {
  // Lazy-import Firebase to keep it out of the main bundle for pages that don't use it
  const { db } = await import('@/lib/firebaseClient');

  if (!db) {
    reportWarning('Firebase not configured — skipping lead persistence', { component: 'api/leads' });
    return;
  }

  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

  try {
    const write = addDoc(collection(db, 'leads'), {
      ...payload,
      source: 'web_form',
      createdAt: serverTimestamp(),
    });

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Lead save timed out')), FIREBASE_SAVE_TIMEOUT_MS)
    );

    await Promise.race([write, timeout]);
  } catch (err) {
    reportError(err, { component: 'api/leads', action: 'persist', email: payload.email });
    throw err;
  }
}
