/**
 * Firebase Admin Service
 * Backend Service Layer
 * Privileged server-side Firebase Admin SDK initialization.
 */

import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { ENV } from '../config/environment';

export class FirebaseAdminService {
  private static instance: FirebaseAdminService;
  private app: App | null = null;
  private auth: Auth | null = null;
  private firestore: Firestore | null = null;
  private initialized = false;

  private constructor() {
    this.init();
  }

  public static getInstance(): FirebaseAdminService {
    if (!FirebaseAdminService.instance) {
      FirebaseAdminService.instance = new FirebaseAdminService();
    }
    return FirebaseAdminService.instance;
  }

  private init(): void {
    try {
      if (ENV.FIREBASE_SERVICE_ACCOUNT) {
        const certData = JSON.parse(ENV.FIREBASE_SERVICE_ACCOUNT);
        this.app = initializeApp({ credential: cert(certData) });
        this.initialized = true;
      } else if (ENV.FIREBASE_PROJECT_ID && ENV.FIREBASE_CLIENT_EMAIL && ENV.FIREBASE_PRIVATE_KEY) {
        this.app = initializeApp({
          credential: cert({
            projectId: ENV.FIREBASE_PROJECT_ID,
            clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
            privateKey: ENV.FIREBASE_PRIVATE_KEY,
          }),
        });
        this.initialized = true;
      } else if (getApps().length > 0) {
        this.app = getApps()[0];
        this.initialized = true;
      }

      if (this.initialized && this.app) {
        this.auth = getAuth(this.app);
        this.firestore = getFirestore(this.app);
        console.log('[Backend] Firebase Admin SDK initialized successfully.');
      } else {
        console.log('[Backend] Firebase Admin SDK: Local emulation mode active.');
      }
    } catch (err) {
      console.warn('[Backend] Firebase Admin SDK init warning:', err);
    }
  }

  public getAuth(): Auth | null {
    return this.auth;
  }

  public getFirestore(): Firestore | null {
    return this.firestore;
  }

  public isReady(): boolean {
    return this.initialized && this.auth !== null;
  }
}

export const firebaseAdminService = FirebaseAdminService.getInstance();
