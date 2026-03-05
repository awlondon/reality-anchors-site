import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Next.js only inlines process.env.NEXT_PUBLIC_* with static dot notation.
// Dynamic access like process.env[v] is NOT replaced at build time.
// So we must read each var directly with dot notation.
const firebaseConfig = {
  apiKey:     process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  appId:      process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
};

const isConfigured = !!(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);

if (!isConfigured && typeof window !== 'undefined') {
  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  console.warn(`[Firebase] Missing config: ${missing.join(', ')} — Firestore writes will be skipped`);
}

const app = isConfigured && getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0] ?? null;

export const db: Firestore | null = app ? getFirestore(app) : null;
export { isConfigured as isFirebaseConfigured };
