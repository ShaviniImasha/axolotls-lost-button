import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

export interface FirebaseConfigStatus {
  isConfigured: boolean;
  missingKeys: string[];
}

export const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || 'AIzaSyBhMTtbNbDhFPjZw0CCfq_Cwhcq4lbtL50',
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || 'axolotl-lost-button.firebaseapp.com',
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || 'axolotl-lost-button',
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || 'axolotl-lost-button.firebasestorage.app',
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '705356865961',
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || '1:705356865961:web:9a6bcdd0d886108a0ea4b8',
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID || 'G-DRFS65XMYE',
};

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;
const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);

export const isFirebaseConfigured = missingKeys.length === 0;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let analytics: Analytics | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      }).catch(() => {
        // Analytics optional in non-browser or test environments
      });
    }
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
  }
}

export { app, auth, db, googleProvider, analytics };
export function getFirebaseConfigStatus(): FirebaseConfigStatus {
  return {
    isConfigured: isFirebaseConfigured,
    missingKeys,
  };
}
