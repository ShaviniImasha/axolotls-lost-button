/**
 * Score Repository
 * Backend Repository Layer
 * Manages high score submissions in Firestore 'scores' collection.
 */

import { getAdminDb } from '../config/firebase';

export interface ScoreRecord {
  userId: string;
  username: string;
  avatar: string;
  totalScore: number;
  highestScore: number;
  levelsCompleted: number;
  lastUpdated: string;
}

export class ScoreRepository {
  private static instance: ScoreRepository;

  private constructor() {}

  public static getInstance(): ScoreRepository {
    if (!ScoreRepository.instance) {
      ScoreRepository.instance = new ScoreRepository();
    }
    return ScoreRepository.instance;
  }

  public async saveScore(record: ScoreRecord): Promise<void> {
    const db = getAdminDb();
    if (db) {
      try {
        await db.collection('scores').doc(record.userId).set(record, { merge: true });
      } catch (err) {
        console.warn('[Backend ScoreRepository] Error persisting score:', err);
      }
    }
  }
}

export const scoreRepository = ScoreRepository.getInstance();
