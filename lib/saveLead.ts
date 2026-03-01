import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

export interface LeadPayload {
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
  sessionId: string;
  regimeId: string | null;
}

const SAVE_TIMEOUT_MS = 10_000;

export async function saveLead(payload: LeadPayload): Promise<void> {
  if (!db) {
    console.warn('[saveLead] Firebase not configured — skipping persistence');
    return;
  }

  const write = addDoc(collection(db, 'leads'), {
    ...payload,
    source: 'web_form',
    createdAt: serverTimestamp(),
  });

  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Lead save timed out after 10 seconds')), SAVE_TIMEOUT_MS)
  );

  await Promise.race([write, timeout]);
}
