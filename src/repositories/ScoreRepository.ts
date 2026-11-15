/**
 * Score Repository
 * Model-View-Controller (MVC) - Repository Layer
 * Manages player high scores, total points, and level records in Firestore and local storage.
 */

import { doc, setDoc } from 'firebase/firestore';
import { firebaseService } from '../services/FirebaseService';
import { ErrorHandler } from '../utils/ErrorHandler';

export interface ScoreSubmission {
  userId: string;
  username: string;
  avatar: string;
  score: number;
  levelId: string;
  totalScore: number;
  completedLevelsCount: number;
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

  /**
   * Save score entry to Firestore `scores` collection and local history
   */
  public async submitScore(submission: ScoreSubmission): Promise<void> {
    try {
      const historyKey = `axolotl_scores_${submission.userId}`;
      const existing = JSON.parse(localStorage.getItem(historyKey) || '[]');
      existing.push({ ...submission, submittedAt: new Date().toISOString() });
      localStorage.setItem(historyKey, JSON.stringify(existing));
    } catch (err) {
      ErrorHandler.log(err, 'ScoreRepository.submitScore (local)');
    }

    const db = firebaseService.getFirestore();
    if (firebaseService.isConfigured() && db) {
      try {
        const scoreRef = doc(db, 'scores', submission.userId);
        await setDoc(
          scoreRef,
          {
            userId: submission.userId,
            username: submission.username,
            avatar: submission.avatar,
            totalScore: submission.totalScore,
            highestScore: submission.score,
            levelsCompleted: submission.completedLevelsCount,
            lastUpdated: new Date().toISOString(),
          },
          { merge: true },
        );
      } catch (err) {
        ErrorHandler.log(err, 'ScoreRepository.submitScore (remote)');
      }
    }
  }

  /**
   * Get best score for a specific level from local storage
   */
  public getLocalBestScore(userId: string, levelId: string): number {
    try {
      const historyKey = `axolotl_scores_${userId}`;
      const scores = JSON.parse(localStorage.getItem(historyKey) || '[]');
      const levelScores = scores.filter((s: { levelId: string; score: number }) => s.levelId === levelId);
      if (levelScores.length === 0) return 0;
      return Math.max(...levelScores.map((s: { score: number }) => s.score));
    } catch {
      return 0;
    }
  }
}

export const scoreRepository = ScoreRepository.getInstance();
