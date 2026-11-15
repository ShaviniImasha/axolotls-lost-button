import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  type User,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured, getFirebaseConfigStatus } from '../firebase/config';
import type { AssetName } from '../assets';
import { getAllLevels, type LevelId } from '../game/levelManager';
import { firestoreService } from './firestoreService';

export interface PlayerLevelProgress {
  bestScore: number;
}

export interface PlayerProfileData {
  playerId: string;
  name: string;
  email: string | null;
  avatar: AssetName;
  totalScore: number;
  currentLevel: LevelId;
  unlockedLevels: LevelId[];
  completedLevels: LevelId[];
  levelProgress: Record<LevelId, PlayerLevelProgress>;
  collectedPearls: number;
  collectedClues: string[];
  gameProgress: Record<string, unknown>;
  completionStatus: boolean;
  isOnlineUser?: boolean;
}

const LOCAL_USER_KEY = 'axolotl_local_player_user';
const REMEMBERED_IDENTITY_KEY = 'aqua-pals-remembered-player';

export function createEmptyLevelProgress(): Record<LevelId, PlayerLevelProgress> {
  return Object.fromEntries(getAllLevels().map((level) => [level.id, { bestScore: 0 }])) as Record<
    LevelId,
    PlayerLevelProgress
  >;
}

export function formatAuthError(err: unknown): string {
  if (!err) return 'An unexpected error occurred. Please try again.';
  const code = (err as { code?: string })?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead!';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No player account found with this email. Please check your spelling or register.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network issue connecting to Firebase. Please check your connection.';
    default:
      return (err as Error).message || 'Authentication failed. Please try again.';
  }
}

export class AuthService {
  private static instance: AuthService;
  private currentUser: PlayerProfileData | null = null;
  private idToken: string | null = null;
  private listeners: ((user: PlayerProfileData | null) => void)[] = [];

  private constructor() {
    this.initAuthListener();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private initAuthListener(): void {
    if (isFirebaseConfigured && auth) {
      onAuthStateChanged(auth, async (user: User | null) => {
        if (user) {
          try {
            this.idToken = await user.getIdToken();
          } catch {
            this.idToken = null;
          }

          // Update lastLogin in Firestore
          void firestoreService.recordPlayerLogin(user.uid);

          // Load remote multi-collection data
          const savedData = await firestoreService.loadPlayerProfile(user.uid, this.idToken);

          const profile: PlayerProfileData = {
            playerId: user.uid,
            name: savedData?.name || user.displayName || user.email?.split('@')[0] || 'Pip’s Pal',
            email: user.email,
            avatar: savedData?.avatar || 'axolotl-happy',
            totalScore: savedData?.totalScore || 0,
            currentLevel: savedData?.currentLevel || 'pond-easy',
            unlockedLevels: savedData?.unlockedLevels || ['pond-easy'],
            completedLevels: savedData?.completedLevels || [],
            levelProgress: savedData?.levelProgress || createEmptyLevelProgress(),
            collectedPearls: savedData?.collectedPearls || 0,
            collectedClues: savedData?.collectedClues || [],
            gameProgress: savedData?.gameProgress || {},
            completionStatus: savedData?.completionStatus || false,
            isOnlineUser: true,
          };
          this.currentUser = profile;
        } else {
          this.currentUser = null;
          this.idToken = null;
        }
        this.notifyListeners();
      });
    } else {
      // In local mode, restore saved local user if any
      const saved = this.getLocalUser();
      if (saved) {
        this.currentUser = saved;
      }
    }
  }

  public onAuthChange(listener: (user: PlayerProfileData | null) => void): () => void {
    this.listeners.push(listener);
    listener(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.currentUser);
    }
  }

  public getCurrentUser(): PlayerProfileData | null {
    return this.currentUser;
  }

  public getIdToken(): string | null {
    return this.idToken;
  }

  public isOnline(): boolean {
    return isFirebaseConfigured;
  }

  public getConfigNotice(): string | null {
    if (isFirebaseConfigured) return null;
    const { missingKeys } = getFirebaseConfigStatus();
    return `Firebase not configured (missing: ${missingKeys.join(', ')}). Using local player mode.`;
  }

  /**
   * Registers a new player with Firebase Authentication and automatically creates
   * initial documents in `players`, `playerProgress`, and `scores`.
   */
  public async register(name: string, email: string, password: string): Promise<PlayerProfileData> {
    const trimmedName = name.trim() || 'Pip’s Pal';
    const trimmedEmail = email.trim();

    if (isFirebaseConfigured && auth) {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: trimmedName });
      this.idToken = await user.getIdToken();

      // Automatically create documents in players, playerProgress, and scores collections
      await firestoreService.createInitialPlayerRecords(
        user.uid,
        trimmedName,
        user.email,
        'axolotl-happy',
      );

      const profile: PlayerProfileData = {
        playerId: user.uid,
        name: trimmedName,
        email: user.email,
        avatar: 'axolotl-happy',
        totalScore: 0,
        currentLevel: 'pond-easy',
        unlockedLevels: ['pond-easy'],
        completedLevels: [],
        levelProgress: createEmptyLevelProgress(),
        collectedPearls: 0,
        collectedClues: [],
        gameProgress: {},
        completionStatus: false,
        isOnlineUser: true,
      };
      this.currentUser = profile;
      this.notifyListeners();
      return profile;
    }

    // Local registration fallback
    const mockId = 'local_' + Math.random().toString(36).substring(2, 10);
    const profile: PlayerProfileData = {
      playerId: mockId,
      name: trimmedName,
      email: trimmedEmail,
      avatar: 'axolotl-happy',
      totalScore: 0,
      currentLevel: 'pond-easy',
      unlockedLevels: ['pond-easy'],
      completedLevels: [],
      levelProgress: createEmptyLevelProgress(),
      collectedPearls: 0,
      collectedClues: [],
      gameProgress: {},
      completionStatus: false,
      isOnlineUser: false,
    };
    this.saveLocalUser(profile);
    this.currentUser = profile;
    this.notifyListeners();
    return profile;
  }

  /**
   * Logs in a player using Firebase Authentication and loads their Firestore documents.
   */
  public async login(email: string, password: string, remember: boolean = false): Promise<PlayerProfileData> {
    const trimmedEmail = email.trim();
    if (remember) {
      this.rememberIdentity(trimmedEmail);
    } else {
      this.rememberIdentity(null);
    }

    if (isFirebaseConfigured && auth) {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const user = userCredential.user;
      this.idToken = await user.getIdToken();

      // Record login timestamp
      void firestoreService.recordPlayerLogin(user.uid);

      // Load remote Firestore profile across collections
      const saved = await firestoreService.loadPlayerProfile(user.uid, this.idToken);

      const profile: PlayerProfileData = {
        playerId: user.uid,
        name: saved?.name || user.displayName || user.email?.split('@')[0] || 'Pip’s Pal',
        email: user.email,
        avatar: saved?.avatar || 'axolotl-happy',
        totalScore: saved?.totalScore || 0,
        currentLevel: saved?.currentLevel || 'pond-easy',
        unlockedLevels: saved?.unlockedLevels || ['pond-easy'],
        completedLevels: saved?.completedLevels || [],
        levelProgress: saved?.levelProgress || createEmptyLevelProgress(),
        collectedPearls: saved?.collectedPearls || 0,
        collectedClues: saved?.collectedClues || [],
        gameProgress: saved?.gameProgress || {},
        completionStatus: saved?.completionStatus || false,
        isOnlineUser: true,
      };
      this.currentUser = profile;
      this.notifyListeners();
      return profile;
    }

    // Local login fallback
    const saved = this.getLocalUser();
    const mockId = saved?.playerId || 'local_' + Math.random().toString(36).substring(2, 10);
    const name = trimmedEmail.includes('@') ? trimmedEmail.split('@')[0] : trimmedEmail;
    const profile: PlayerProfileData = saved || {
      playerId: mockId,
      name: name || 'Pip’s Pal',
      email: trimmedEmail.includes('@') ? trimmedEmail : null,
      avatar: 'axolotl-happy',
      totalScore: 0,
      currentLevel: 'pond-easy',
      unlockedLevels: ['pond-easy'],
      completedLevels: [],
      levelProgress: createEmptyLevelProgress(),
      collectedPearls: 0,
      collectedClues: [],
      gameProgress: {},
      completionStatus: false,
      isOnlineUser: false,
    };
    this.saveLocalUser(profile);
    this.currentUser = profile;
    this.notifyListeners();
    return profile;
  }

  /**
   * Sends a password reset email via Firebase Authentication.
   */
  public async resetPassword(email: string): Promise<void> {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error('Please enter a valid email address to reset your password.');
    }

    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, trimmedEmail);
      return;
    }

    // If local mode
    console.log(`[Local Mode] Password reset requested for: ${trimmedEmail}`);
  }

  public async loginWithGoogle(): Promise<PlayerProfileData> {
    if (isFirebaseConfigured && auth && googleProvider) {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      this.idToken = await user.getIdToken();

      // Ensure initial records exist
      await firestoreService.createInitialPlayerRecords(
        user.uid,
        user.displayName || 'Pond Explorer',
        user.email,
        'axolotl-happy',
      );
      void firestoreService.recordPlayerLogin(user.uid);

      const saved = await firestoreService.loadPlayerProfile(user.uid, this.idToken);

      const profile: PlayerProfileData = {
        playerId: user.uid,
        name: saved?.name || user.displayName || user.email?.split('@')[0] || 'Pip’s Pal',
        email: user.email,
        avatar: saved?.avatar || 'axolotl-happy',
        totalScore: saved?.totalScore || 0,
        currentLevel: saved?.currentLevel || 'pond-easy',
        unlockedLevels: saved?.unlockedLevels || ['pond-easy'],
        completedLevels: saved?.completedLevels || [],
        levelProgress: saved?.levelProgress || createEmptyLevelProgress(),
        collectedPearls: saved?.collectedPearls || 0,
        collectedClues: saved?.collectedClues || [],
        gameProgress: saved?.gameProgress || {},
        completionStatus: saved?.completionStatus || false,
        isOnlineUser: true,
      };
      this.currentUser = profile;
      this.notifyListeners();
      return profile;
    }

    throw new Error(
      'Google Sign-In requires Firebase configuration. Please configure VITE_FIREBASE_API_KEY in .env.',
    );
  }

  public async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    }
    this.currentUser = null;
    this.idToken = null;
    try {
      window.localStorage.removeItem(LOCAL_USER_KEY);
    } catch {
      // ignore
    }
    this.notifyListeners();
  }

  public updateCurrentUserProfile(updated: Partial<PlayerProfileData>): void {
    if (!this.currentUser) return;
    this.currentUser = { ...this.currentUser, ...updated };
    if (!isFirebaseConfigured) {
      this.saveLocalUser(this.currentUser);
    }
    this.notifyListeners();
  }

  public getRememberedIdentity(): string | null {
    try {
      return window.localStorage.getItem(REMEMBERED_IDENTITY_KEY);
    } catch {
      return null;
    }
  }

  public rememberIdentity(identity: string | null): void {
    try {
      if (identity) {
        window.localStorage.setItem(REMEMBERED_IDENTITY_KEY, identity);
      } else {
        window.localStorage.removeItem(REMEMBERED_IDENTITY_KEY);
      }
    } catch {
      // storage unavailable
    }
  }

  public async updateUsername(newName: string): Promise<void> {
    const user = auth?.currentUser;
    if (!user) throw new Error('Not signed in.');
    const trimmed = newName.trim();
    if (!trimmed) throw new Error('Username cannot be empty.');
    await updateProfile(user, { displayName: trimmed });
    await firestoreService.updatePlayerName(user.uid, trimmed);
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, name: trimmed };
      this.saveLocalUser(this.currentUser);
    }
  }

  public async updateUserEmail(newEmail: string, currentPassword: string): Promise<void> {
    const user = auth?.currentUser;
    if (!user || !user.email) throw new Error('Not signed in or no email on account.');
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, newEmail.trim());
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, email: newEmail.trim() };
      this.saveLocalUser(this.currentUser);
    }
  }

  public async updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = auth?.currentUser;
    if (!user || !user.email) throw new Error('Not signed in or no email on account.');
    if (newPassword.length < 6) throw new Error('New password must be at least 6 characters.');
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  }

  private saveLocalUser(user: PlayerProfileData): void {
    try {
      window.localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  }

  private getLocalUser(): PlayerProfileData | null {
    try {
      const raw = window.localStorage.getItem(LOCAL_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

export const authService = AuthService.getInstance();
