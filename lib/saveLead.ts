import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
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

export async function saveLead(payload: LeadPayload): Promise<void> {
  if (!db) {
    reportWarning('Firebase not configured — skipping lead persistence', { component: 'saveLead' });
    return;
  }

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
    reportError(err, { component: 'saveLead', action: 'firestore_write', email: payload.email });
    throw err;
  }
}
