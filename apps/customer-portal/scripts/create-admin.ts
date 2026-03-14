/**
 * Creates an admin user in Firebase Auth + Firestore.
 *
 * Prerequisites:
 *   npm install -g firebase-admin   (or use npx)
 *   Set GOOGLE_APPLICATION_CREDENTIALS to your service account key JSON path.
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts
 */

import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const EMAIL = 'realityanchors@gmail.com';
const PASSWORD = 'admin_0198!';
const ROLE = 'admin';

async function main() {
  // Load service account key and initialize with explicit credential + project
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!keyPath) {
    console.error('Set GOOGLE_APPLICATION_CREDENTIALS to your service account key JSON path.');
    process.exit(1);
  }
  const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf-8'));
  const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
  const auth = getAuth(app);
  const db = getFirestore(app);

  // 1. Create or get the Auth user
  let uid: string;
  try {
    const existing = await auth.getUserByEmail(EMAIL);
    uid = existing.uid;
    console.log(`User already exists: ${uid}`);
  } catch {
    const created = await auth.createUser({
      email: EMAIL,
      password: PASSWORD,
      displayName: 'Reality Anchors Admin',
    });
    uid = created.uid;
    console.log(`Created user: ${uid}`);
  }

  // 2. Set custom claims for admin
  await auth.setCustomUserClaims(uid, { role: ROLE });
  console.log(`Set custom claims: role=${ROLE}`);

  // 3. Write Firestore user profile with admin role
  await db.doc(`users/${uid}`).set(
    {
      email: EMAIL,
      displayName: 'Reality Anchors Admin',
      role: ROLE,
      createdAt: new Date(),
    },
    { merge: true },
  );
  console.log(`Wrote users/${uid} doc with role=${ROLE}`);

  console.log('\nAdmin user ready. Sign in at the portal with:');
  console.log(`  Email:    ${EMAIL}`);
  console.log(`  Password: ${PASSWORD}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
