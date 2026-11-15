import { getAdminDb } from '../config/firebase';
import type { UserAttributes } from '../models/UserModel';

export class UserRepository {
  private static instance: UserRepository;

  private constructor() { }

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  public async findById(userId: string): Promise<UserAttributes | null> {
    const db = getAdminDb();
    if (db) {
      try {
        const snap = await db.collection('players').doc(userId).get();
        if (snap.exists) {
          return snap.data() as UserAttributes;
        }
      } catch (err) {
        console.warn('[Backend UserRepository] Firestore read error:', err);
      }
    }
    return null;
  }

  public async save(user: UserAttributes): Promise<void> {
    const db = getAdminDb();
    if (db) {
      try {
        await db.collection('players').doc(user.id).set(user, { merge: true });
      } catch (err) {
        console.warn('[Backend UserRepository] Firestore write error:', err);
      }
    }
  }
}

export const userRepository = UserRepository.getInstance();
