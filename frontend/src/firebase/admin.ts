/**
 * Firebase Admin Initializer
 * Provides Firebase Admin SDK instances for backend middleware.
 */

import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

let isFirebaseAdminInitialized = false;
let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

try {
  if (serviceAccountJson) {
    const certData = JSON.parse(serviceAccountJson);
    adminApp = initializeApp({ credential: cert(certData) });
    isFirebaseAdminInitialized = true;
  } else if (projectId && clientEmail && privateKey) {
    adminApp = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
    isFirebaseAdminInitialized = true;
  } else if (getApps().length > 0) {
    adminApp = getApps()[0];
    isFirebaseAdminInitialized = true;
  }

  if (isFirebaseAdminInitialized && adminApp) {
    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
    console.log('Firebase Admin SDK initialized successfully.');
  } else {
    console.log('Firebase Admin SDK: Running in local emulation mode (no service account configured in .env).');
  }
} catch (err) {
  console.warn('Firebase Admin SDK initialization notice:', err);
}

export { adminApp, adminAuth, adminDb, isFirebaseAdminInitialized };