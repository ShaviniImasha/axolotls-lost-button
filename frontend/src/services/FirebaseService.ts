import { auth, db, googleProvider, isFirebaseConfigured, getFirebaseConfigStatus } from '../firebase/config';
import type { Auth, GoogleAuthProvider } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

export class FirebaseService {
  private static instance: FirebaseService;

  private constructor() {}

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public getAuth(): Auth | null {
    return auth;
  }

  public getFirestore(): Firestore | null {
    return db;
  }

  public getGoogleProvider(): GoogleAuthProvider | null {
    return googleProvider;
  }

  public isConfigured(): boolean {
    return isFirebaseConfigured;
  }

  public getConfigStatus() {
    return getFirebaseConfigStatus();
  }
}

export const firebaseService = FirebaseService.getInstance();
