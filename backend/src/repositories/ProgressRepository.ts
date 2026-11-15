/**
 * Progress Repository
 * Backend Repository Layer
 * Manages player progression in Firestore 'playerProgress' collection.
 */

import { getAdminDb } from '../config/firebase';

export interface ProgressRecord {
  userId: string;
  currentLevel: string;
  completedLevels: string[];
  collectedRewards: { pearls: number };
  totalScore: number;
  lastUpdated: string;
}

export class ProgressRepository {
  private static instance: ProgressRepository;

  private constructor() {}

  public static getInstance(): ProgressRepository {
    if (!ProgressRepository.instance) {
      ProgressRepository.instance = new ProgressRepository();
    }
    return ProgressRepository.instance;
  }

  public async getProgress(userId: string): Promise<ProgressRecord | null> {
    const db = getAdminDb();
    if (db) {
      try {
        const snap = await db.collection('playerProgress').doc(userId).get();
        if (snap.exists) {
          return snap.data() as ProgressRecord;
        }
      } catch (err) {
        console.warn('[Backend ProgressRepository] Error loading progress:', err);
      }
    }
    return null;
  }

  public async saveProgress(record: ProgressRecord): Promise<void> {
    const db = getAdminDb();
    if (db) {
      try {
        await db.collection('playerProgress').doc(record.userId).set(record, { merge: true });
      } catch (err) {
        console.warn('[Backend ProgressRepository] Error saving progress:', err);
      }
    }
  }
}

export const progressRepository = ProgressRepository.getInstance();
