

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseService } from '../services/FirebaseService';
import { UserModel, type UserAttributes } from '../models/UserModel';
import { ErrorHandler } from '../utils/ErrorHandler';

const STORAGE_KEY = 'axolotl_user_profile';

export class UserRepository {
  private static instance: UserRepository;

  private constructor() { }

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  /**
   * Fetch user profile from Firestore with fallback to LocalStorage
   */
  public async getProfile(userId: string): Promise<UserModel | null> {
    try {
      const db = firebaseService.getFirestore();
      if (firebaseService.isConfigured() && db) {
        const docRef = doc(db, 'players', userId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data() as Partial<UserAttributes>;
          return UserModel.fromJSON({ ...data, id: userId, isOnlineUser: true });
        }
      }
    } catch (err) {
      ErrorHandler.log(err, 'UserRepository.getProfile (remote)');
    }

    // LocalStorage fallback
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
      if (raw) {
        return UserModel.fromJSON(JSON.parse(raw));
      }
    } catch (err) {
      ErrorHandler.log(err, 'UserRepository.getProfile (local)');
    }

    return null;
  }

  /**
   * Save user profile to Firestore and LocalStorage
   */
  public async saveProfile(user: UserModel): Promise<void> {
    const data = user.toJSON();

    // Always cache locally
    try {
      localStorage.setItem(`${STORAGE_KEY}_${user.getId()}`, JSON.stringify(data));
    } catch (err) {
      ErrorHandler.log(err, 'UserRepository.saveProfile (local)');
    }

    // Persist to Firestore if online
    const db = firebaseService.getFirestore();
    if (firebaseService.isConfigured() && db && !user.getIsGuest()) {
      try {
        const docRef = doc(db, 'players', user.getId());
        await setDoc(docRef, data, { merge: true });
      } catch (err) {
        ErrorHandler.log(err, 'UserRepository.saveProfile (remote)');
      }
    }
  }
}

export const userRepository = UserRepository.getInstance();
