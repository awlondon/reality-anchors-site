import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const REQUIRED_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const;

const missing = REQUIRED_VARS.filter((v) => !process.env[v]);
if (missing.length > 0 && typeof window !== 'undefined') {
  console.warn(`[Firebase] Missing env vars: ${missing.join(', ')} — Firestore writes will be skipped`);
}

const firebaseConfig = {
  apiKey:     process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId:      process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isConfigured = missing.length === 0;

const app = isConfigured && getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0] ?? null;

export const db: Firestore | null = app ? getFirestore(app) : null;
export { isConfigured as isFirebaseConfigured };
