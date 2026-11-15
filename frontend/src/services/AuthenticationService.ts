import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth';
import { firebaseService } from './FirebaseService';
import { ErrorHandler, AppError } from '../utils/ErrorHandler';
import { Validation } from '../utils/Validation';

export interface AuthCredentials {
  email: string;
  password?: string;
  displayName?: string;
}

export class AuthenticationService {
  private static instance: AuthenticationService;

  private constructor() {}

  public static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  public onAuthStateChanged(callback: (user: User | null) => void): () => void {
    const auth = firebaseService.getAuth();
    if (!auth) return () => {};
    return onAuthStateChanged(auth, callback);
  }

  public getCurrentUser(): User | null {
    const auth = firebaseService.getAuth();
    return auth ? auth.currentUser : null;
  }

  public async register(credentials: AuthCredentials): Promise<User> {
    const validation = Validation.validateRegistration(credentials);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      throw new AppError(firstError, 'AUTH_VALIDATION_ERROR', 400);
    }

    const auth = firebaseService.getAuth();
    if (!auth) throw new AppError('Firebase Auth is not available.', 'AUTH_UNAVAILABLE');

    try {
      const cred = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password!);
      if (credentials.displayName) {
        await updateProfile(cred.user, { displayName: credentials.displayName.trim() });
      }
      return cred.user;
    } catch (error) {
      ErrorHandler.log(error, 'AuthenticationService.register');
      throw error;
    }
  }

  public async signIn(credentials: AuthCredentials): Promise<User> {
    const validation = Validation.validateLogin(credentials);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      throw new AppError(firstError, 'AUTH_VALIDATION_ERROR', 400);
    }

    const auth = firebaseService.getAuth();
    if (!auth) throw new AppError('Firebase Auth is not available.', 'AUTH_UNAVAILABLE');

    try {
      const cred = await signInWithEmailAndPassword(auth, credentials.email, credentials.password!);
      return cred.user;
    } catch (error) {
      ErrorHandler.log(error, 'AuthenticationService.signIn');
      throw error;
    }
  }

  public async signInWithGoogle(): Promise<User> {
    const auth = firebaseService.getAuth();
    const provider = firebaseService.getGoogleProvider();
    if (!auth || !provider) {
      throw new AppError('Google sign in is not configured.', 'GOOGLE_AUTH_UNAVAILABLE');
    }

    try {
      const cred = await signInWithPopup(auth, provider);
      return cred.user;
    } catch (error) {
      ErrorHandler.log(error, 'AuthenticationService.signInWithGoogle');
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    const auth = firebaseService.getAuth();
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      ErrorHandler.log(error, 'AuthenticationService.signOut');
      throw error;
    }
  }

  public async resetPassword(email: string): Promise<void> {
    if (!Validation.isValidEmail(email)) {
      throw new AppError('Please enter a valid email address.', 'INVALID_EMAIL', 400);
    }
    const auth = firebaseService.getAuth();
    if (!auth) throw new AppError('Firebase Auth is not available.', 'AUTH_UNAVAILABLE');

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      ErrorHandler.log(error, 'AuthenticationService.resetPassword');
      throw error;
    }
  }
}

export const authenticationService = AuthenticationService.getInstance();
