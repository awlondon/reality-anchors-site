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

export async function saveLead(payload: LeadPayload): Promise<void> {
  await addDoc(collection(db, 'leads'), {
    ...payload,
    source: 'web_form',
    createdAt: serverTimestamp(),
  });
}
