import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let isFirebaseAdminInitialized = false;
let adminAuth: admin.auth.Auth | null = null;
let adminDb: admin.firestore.Firestore | null = null;

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

try {
  if (serviceAccountJson) {
    const cert = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(cert),
    });
    isFirebaseAdminInitialized = true;
  } else if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    isFirebaseAdminInitialized = true;
  }

  if (isFirebaseAdminInitialized) {
    adminAuth = admin.auth();
    adminDb = admin.firestore();
    console.log('Firebase Admin SDK initialized successfully.');
  } else {
    console.log('Firebase Admin SDK: Running in local emulation mode (no service account configured in .env).');
  }
} catch (err) {
  console.warn('Firebase Admin SDK initialization notice:', err);
}

export { admin, adminAuth, adminDb, isFirebaseAdminInitialized };

